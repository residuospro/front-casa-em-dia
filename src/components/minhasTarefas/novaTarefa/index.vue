<template>
  <div class="w-full bg-white rounded-2xl p-6">
    <div class="mb-5">
      <h1 class="text-2xl font-semibold text-[#1C1F1F]">Nova tarefa</h1>

      <p class="text-sm text-black/50">Crie as suas tarefas aqui.</p>
    </div>

    <div class="flex flex-row gap-2">
      <div class="border border-[#ECE4D8] rounded-2xl overflow-hidden flex-1">
        <div class="p-5 space-y-5">
          <h2 class="font-semibold">Informações da tarefa</h2>

          <Input
            label="Nome da tarefa *"
            placeholder="Ex: Lavar louça"
            v-model="form.titulo"
          />

          <Textarea
            id="descricao-tarefa"
            label="Descrição"
            v-model="form.descricao"
            maxlength="200"
            placeholder="Descreva a tarefa..."
          />

          <div class="grid grid-cols-2 gap-3">
            <Select
              label="Tipo de tarefa *"
              v-model="form.tipo"
              :items="tipos"
              placeholder="Selecione o tipo de tarefa"
            />

            <Select
              label="Categoria *"
              placeholder="Selecione uma categoria"
              v-model="form.categoria"
              :items="categorias"
            />
          </div>

          <div class="">
            <p class="text-sm mb-2">Como será a distribuição?</p>

            <div class="flex flex-row items-center gap-2 w-full">
              <button
                type="button"
                @click="form.modoDistribuicao = 'FIXA'"
                class="rounded-xl border p-4 text-left transition w-full"
                :class="
                  form.modoDistribuicao === 'FIXA'
                    ? 'border-[#53864C] bg-[#EEF5EA]'
                    : 'border-slate-700'
                "
              >
                <div class="flex flex-row items-center gap-1">
                  <svg-icon type="mdi" :path="mdiAccountOutline" class="" />
                  <span class="font-medium flex flex-row"> Fixa </span>
                </div>

                <p class="text-xs text-black/50 mt-1">
                  A tarefa ficará sempre com o mesmo membro.
                </p>
              </button>

              <button
                type="button"
                :disabled="form.tipo === 'PESSOAL'"
                @click="form.modoDistribuicao = 'REVEZAMENTO'"
                class="rounded-xl border p-4 text-left w-full"
                :class="{
                  'border-[#53864C] bg-[#EEF5EA]':
                    form.modoDistribuicao === 'REVEZAMENTO',
                  'bg-slate-400': form.tipo === 'PESSOAL',
                }"
              >
                <div class="flex flex-row items-center gap-1">
                  <svg-icon
                    type="mdi"
                    :path="mdiAccountGroupOutline"
                    class=""
                  />
                  <span class="font-medium flex flex-row"> Revezamento </span>
                </div>

                <p class="text-xs text-black/50 mt-1">
                  A tarefa será alternada entre os membros.
                </p>
              </button>
            </div>
          </div>

          <Select
            label="Responsável"
            placeholder="Selecione um membro"
            v-model="form.responsavelAtualId"
            :items="opcoesFamiliares"
          />

          <Select
            label="Ciclo"
            placeholder="Selecione o ciclo"
            v-model="form.cicloId"
            :items="opcaoCiclo"
          />

          <!-- Frequência -->

          <div class="border-t border-[#ECE4D8] pt-5 space-y-3">
            <h2 class="font-semibold">Frequência da tarefa</h2>

            <p class="text-xs text-black/50">
              Defina em quais dias e horários essa tarefa será executada.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <Input
                label="Horário"
                type="time"
                v-model="novoAgendamento.horario"
              />

              <ce-date-picker
                range
                modal
                id="periodo-nova-tarefa"
                label="Período"
                format="yyyy-MM-dd"
                @update:start="(valor) => onUpdateStart(valor as string)"
                @update:end="(valor) => onUpdateEnd(valor as string)"
              />
            </div>

            <Button type="button" variant="outline" @click="() => {}">
              Adicionar horário
            </Button>

            <!-- <div
              v-if="form.agendamentos.length"
              class="space-y-2 max-h-[15rem] overflow-auto"
            >
              <div
                v-for="(item, index) in form.agendamentos"
                :key="index"
                class="flex items-center justify-between border rounded-xl p-3"
              >
                <div>
                  <p class="font-medium text-sm">
                    {{ nomeDia(item.diaSemana || 0) }}
                  </p>

                  <p class="text-xs text-black/50">
                    {{ item.horario }}
                  </p>
                </div>

                <button
                  type="button"
                  @click="removerAgendamento(index)"
                  class="text-red-500 text-sm"
                >
                  Remover
                </button>
              </div>
            </div> -->
          </div>

          <div class="border-t border-[#ECE4D8] pt-5">
            <h2 class="font-semibold mt-1">Pontuação (Gamificação)</h2>

            <p class="text-xs text-black/50">
              Quantos pontos o membro ganha ao concluir essa tarefa?
            </p>

            <div class="mt-3 border rounded-xl px-3 flex items-center">
              <input
                type="number"
                v-model="form.pontos"
                class="flex-1 h-11 outline-none"
              />

              <span class="text-xs"> pts </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-between gap-2">
        <div
          class="border border-[#ECE4D8] rounded-2xl p-5 flex flex-col justify-between h-full"
        >
          <div class="flex flex-col">
            <h2 class="font-semibold mb-5">Resumo da tarefa</h2>

            <ResumoItem label="Tipo" :value="form.tipo || '-'" />

            <ResumoItem
              label="Distribuição"
              :value="form.modoDistribuicao || '-'"
            />

            <ResumoItem label="Responsável" :value="responsavel || '-'" />

            <ResumoItem
              label="Frequência"
              :value="
                form.agendamentos.length
                  ? `${form.agendamentos.length} horários`
                  : '-'
              "
            />

            <ResumoItem
              label="Pontuação"
              :value="form.pontos ? `${form.pontos} pts` : '-'"
            />
          </div>

          <div
            class="mt-6 rounded-xl bg-[#EEF5EA] border border-[#53864C]/20 p-3 text-xs text-[#24572E]"
          >
            💡 A pontuação será aplicada ao membro sempre que a tarefa for
            concluída.
          </div>
        </div>

        <div class="flex items-end gap-3">
          <Button variant="outline" type="button">Cancelar</Button>

          <Button
            class="px-8 h-11 rounded-xl bg-[#53864C] text-white"
            @click="criarNovaTarefa"
          >
            Salvar tarefa
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Textarea from "@/components/textarea/index.vue";
import Button from "@/components/botao/index.vue";
import ResumoItem from "@/components/ResumoItem/index.vue";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccountOutline, mdiAccountGroupOutline } from "@mdi/js";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useCiclos } from "../ciclos/useCiclos";
import { useApiCiclos } from "../ciclos/useApiCiclos";
import { useNovaTarefa } from "./useNovaTarefa";
import { computed, onMounted, watch } from "vue";
import { useApiNovaTarefa } from "./useApiNovaTarefa";
import { CeDatePicker } from "@comercti/vue-components";

const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const { opcoesFamiliares } = useMinhaFamilia();
const { obterCicloAtivo } = useApiCiclos();
const { opcaoCiclo } = useCiclos();
const {
  categorias,
  tipos,
  form,
  novoAgendamento,
  diasSemana,
  onUpdateStart,
  onUpdateEnd,
  removerAgendamento,
  nomeDia,
} = useNovaTarefa();

const { criarNovaTarefa } = useApiNovaTarefa();

onMounted(async () => {
  await Promise.all([obterOpcoesFamiliares(), obterCicloAtivo()]);
});

const responsavel = computed(
  () =>
    opcoesFamiliares.value.find(
      (opcao) => opcao.value === form.value.responsavelAtualId,
    )?.text,
);

watch(
  () => form.value.tipo,
  (valor) => {
    console.log("valor", valor);

    if (valor === "PESSOAL") {
      form.value.modoDistribuicao = "FIXA";
    }
  },
  { deep: true },
);
</script>
