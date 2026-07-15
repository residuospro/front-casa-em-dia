<template>
  <div class="w-full bg-white rounded-2xl p-6">
    <div
      class="flex flex-row items-center justify-between mb-5 sm:flex-col gap-2 sm:items-start"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">
          {{ acao === "criar" ? "Nova tarefa" : "Editar tarefa" }}
        </h1>

        <p class="text-sm text-black/50">
          {{
            acao === "criar"
              ? "Crie as suas tarefas aqui."
              : "Edite as informações da tarefa."
          }}
        </p>
      </div>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar'
            ? router.push('/minhas-tarefas')
            : router.push({
                name: 'minhas-tarefas.visualizar-tarefa',
                query: { id: idTarefa },
              })
        "
      >
        {{ acao === "criar" ? " Visualizar tarefas" : " Visualizar tarefa" }}
      </Button>
    </div>

    <div class="flex flex-row gap-2 sm:flex-col md:!flex-col">
      <div class="border rounded-2xl overflow-hidden flex-1">
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

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:grid-rows-2">
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

            <div class="flex flex-row items-center gap-2 w-full sm:flex-col">
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
                  'bg-gray-200': form.tipo === 'PESSOAL',
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

          <div
            class="space-y-1"
            v-if="
              form.modoDistribuicao === 'REVEZAMENTO' &&
              !form.responsavelAtualId
            "
          >
            <Toggle
              v-model="form.atribuirAutomaticamente"
              label="Atribuir automaticamente"
            />
            <span class="text-xs font-medium"
              >A tarefa será atribuída automaticamente ao próximo membro do
              ciclo.</span
            >
          </div>

          <Select
            v-if="!form.atribuirAutomaticamente"
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

          <div class="border-t pt-5 flex flex-col justify-center gap-3">
            <div>
              <h2 class="font-semibold">Frequência da tarefa</h2>

              <p class="text-xs text-black/50">
                Defina em quais dias e horários essa tarefa será executada.
              </p>
            </div>

            <Toggle
              v-if="form.execucoes.length === 0"
              @update:model-value="setarFrequenciaAutomatica"
              :model-value="frequenciaAutomatica"
              label="Definir frequência automaticamente"
            />

            <div
              v-if="frequenciaAutomatica"
              class="flex flex-col justify-center gap-2 w-full mt-3"
            >
              <div
                class="flex flex-row items-center gap-2 sm:flex-col sm:items-start"
              >
                <ce-checkbox
                  v-for="item in frequencias"
                  @update:model-value="
                    (valor) =>
                      setarFrequencia(
                        item.value as FrequenciasRecorrencia,
                        valor as boolean,
                      )
                  "
                  :id="item.label"
                  :model-value="recorrencia.frequencia === item.value"
                  :label="item.label"
                />
              </div>

              <div class="flex flex-row items-center gap-2">
                <Input
                  label="Data ínicio"
                  type="date"
                  class="!w-full"
                  v-model="recorrencia.dataInicio"
                />

                <Input
                  label="Data fim (opcional)"
                  type="date"
                  class="!w-full"
                  v-model="recorrencia.dataFim"
                />
              </div>

              <div class="flex flex-row items-end gap-2">
                <Input
                  label="Horário"
                  type="time"
                  class="!w-full"
                  v-model="horario"
                />

                <Button
                  class="!w-full"
                  size="lg"
                  @click="setarHorarioRecorrencia"
                  >{{
                    recorrencia?.horarios.length === 0
                      ? "Adicionar horário"
                      : "Adicionar novo horário"
                  }}</Button
                >
              </div>
            </div>

            <div
              class="flex flex-col justify-center gap-2 mt-3"
              v-if="!frequenciaAutomatica"
            >
              <div class="flex flex-row items-center gap-2 sm:flex-col">
                <Input
                  label="Data ínicio"
                  type="date"
                  class="!w-full"
                  v-model="dataInicio"
                />

                <Input
                  label="Data fim (opcional)"
                  type="date"
                  class="!w-full"
                  v-model="dataFim"
                />

                <Input
                  label="Horário"
                  type="time"
                  v-model="horario"
                  class="!w-1/2 sm:!w-full"
                />
              </div>
            </div>

            <Button
              v-if="!frequenciaAutomatica"
              type="button"
              variant="outline"
              class="!w-full"
              @click="gerarExecucoes"
            >
              Adicionar horário
            </Button>
          </div>

          <div class="border-t pt-5" v-if="form.tipo === 'FAMILIAR'">
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
          class="border rounded-2xl p-5 flex flex-col justify-between h-full"
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
              label="Pontuação"
              :value="form.pontos ? `${form.pontos} pts` : '-'"
            />

            <ResumoItem
              label="Frequência"
              :value="
                form.execucoes.length
                  ? `${form.execucoes.length} horários`
                  : '-'
              "
            />

            <div
              class="flex flex-row justify-between items-center w-full sm:flex-col sm:items-start gap-2"
              v-if="frequenciaDefinida.exibir"
            >
              <div class="flex flex-row items-center gap-2 font-medium text-xs">
                <div
                  class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center p-1"
                >
                  <svg-icon
                    type="mdi"
                    :path="mdiClockTimeEightOutline"
                    class="text-emerald-600"
                  />
                </div>

                <span class="capitalize">{{
                  frequenciaDefinida.frequencia.toLocaleLowerCase()
                }}</span>
              </div>

              <div
                class="flex flex-row items-center gap-2 font-medium text-xs sm:justify-between"
              >
                <span>{{ frequenciaDefinida.data }}</span>

                <span>às {{ frequenciaDefinida.horario }}</span>

                <button @click="limparRecorrencia">
                  <svg-icon
                    type="mdi"
                    :path="mdiTrashCanOutline"
                    class="text-red-500"
                  />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2" v-else>
              <div
                class="flex flex-row items-center justify-between font-medium"
                v-for="(item, index) in form.execucoes"
                :key="index"
              >
                <div class="flex flex-row gap-2">
                  <div
                    class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold p-1"
                  >
                    <svg-icon
                      type="mdi"
                      :path="mdiClockTimeEightOutline"
                      class="text-emerald-600"
                    />
                  </div>
                  <span>{{ formatarDataAgenda(item.data) }}</span>
                </div>

                <button @click="excluirData(item.data)">
                  <svg-icon
                    type="mdi"
                    :path="mdiTrashCanOutline"
                    class="text-red-500"
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            class="mt-6 rounded-xl bg-[#EEF5EA] border border-[#53864C]/20 p-3 text-xs text-[#24572E]"
          >
            💡 A pontuação será aplicada ao membro sempre que a tarefa for
            concluída.
          </div>
        </div>

        <div class="flex justify-end w-full gap-3 sm:flex-col">
          <Button
            variant="outline"
            type="button"
            @click="
              acao === 'criar'
                ? limparFormulario()
                : router.push('/minhas-tarefas')
            "
            >{{ acao === "criar" ? "Limpar" : "Cancelar" }}</Button
          >

          <Button
            variant="primary"
            type="button"
            @click="acao === 'criar' ? criarNovaTarefa() : editarTarefa()"
          >
            {{ acao === "criar" ? "Criar tarefa" : "Salvar alterações" }}
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
import Toggle from "@/components/toggle/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiAccountOutline,
  mdiAccountGroupOutline,
  mdiTrashCanOutline,
  mdiClockTimeEightOutline,
} from "@mdi/js";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useCiclos } from "../../ciclos/useCiclos";
import { useApiCiclos } from "../../ciclos/useApiCiclos";
import { useNovaTarefa } from "./useNovaTarefa";
import { computed, onMounted, ref, watch } from "vue";
import { useApiNovaTarefa } from "./useApiNovaTarefa";
import { CeDatePicker, CeCheckbox } from "@comercti/vue-components-hmg";
import { useRouter } from "vue-router";
import type { FrequenciasRecorrencia } from "@/utils/tipagem";

const props = defineProps<{
  acao: "criar" | "editar";
}>();

const router = useRouter();

const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const { opcoesFamiliares } = useMinhaFamilia();
const { obterCicloAtivo } = useApiCiclos();
const { opcaoCiclo } = useCiclos();
const {
  categorias,
  tipos,
  form,
  horario,
  idTarefa,
  dataFim,
  dataInicio,
  frequenciaAutomatica,
  frequencias,
  recorrencia,
  frequenciaDefinida,
  limparRecorrencia,
  setarFrequencia,
  setarHorarioRecorrencia,
  setarFrequenciaAutomatica,
  excluirData,
  limparFormulario,
  gerarExecucoes,
  onUpdateStart,
  onUpdateEnd,
  preencherFormulario,
  formatarDataAgenda,
} = useNovaTarefa();

const { criarNovaTarefa, editarTarefa, obterTarefaPorId } = useApiNovaTarefa();

onMounted(async () => {});

const responsavel = computed(
  () =>
    opcoesFamiliares.value.find(
      (opcao) => opcao.value === form.value.responsavelAtualId,
    )?.text,
);

watch(
  () => form.value.tipo,
  (valor) => {
    if (valor === "PESSOAL") {
      form.value.modoDistribuicao = "FIXA";
    }
  },
  { deep: true },
);

onMounted(async () => {
  const { id, data } = router.currentRoute.value.query as unknown as {
    id: string;
    data: string;
  };

  limparFormulario();
  limparRecorrencia();
  frequenciaAutomatica.value = false;

  if (props.acao === "editar" && id) {
    const id = router.currentRoute.value.query.id as string;
    idTarefa.value = id;
    await obterTarefaPorId(id);
  } else if (data) {
    preencherFormulario(data);
  }

  await Promise.all([obterOpcoesFamiliares(), obterCicloAtivo()]);
});
</script>

<style>
.border-gray-300 {
  border: 1px solid #334155 !important;
}
</style>
