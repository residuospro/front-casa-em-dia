<template>
  <div class="min-h-screen bg-white p-6 rounded-lg flex flex-col gap-3">
    <div class="flex items-center justify-between sm:flex-col sm:gap-2">
      <div class="flex flex-col justify-center gap-1">
        <h1 class="text-2xl font-semibold">
          {{ acao === "criar" ? "Novo" : "Editar" }} ciclo
        </h1>

        <p class="text-sm text-black/50">
          Defina um ciclo para o revezamento automático das tarefas.
        </p>
      </div>
      <Button
        @click="router.push('/minhas-tarefas/ciclos')"
        class="!w-1/5 sm:!w-full"
        >Visualizar Ciclos</Button
      >
    </div>

    <div
      class="grid grid-cols-2 xl:grid-cols-[1fr_340px] gap-5 sm:grid-cols-1 sm:grid-rows-2"
    >
      <div class="bg-white rounded-2xl border border-[#ECE4D8] overflow-hidden">
        <form
          @submit.prevent="acao === 'criar' ? criaNovoCiclo : atualizarCiclo()"
        >
          <div class="p-6">
            <h2 class="font-semibold mb-5">Informações do ciclo</h2>

            <div class="space-y-4">
              <Input
                label="Nome do ciclo *"
                placeholder="Ex: Revezamento semanal"
                v-model="form.nome"
              />

              <Textarea
                id="descricao-ciclo"
                v-model="form.descricao"
                label="Descrição (opcional)"
                placeholder="Descreva o objetivo deste ciclo..."
              />

              <Input
                label="Data de início *"
                type="date"
                v-model="form.inicio"
              />

              <div>
                <label class="text-sm"> Duração do ciclo * </label>

                <div
                  class="h-11 rounded-xl border border-slate-700 flex items-center px-3"
                >
                  <input
                    type="number"
                    v-model="form.duracaoDias"
                    class="flex-1 outline-none"
                  />

                  <span class="text-sm text-black/40"> dias </span>
                </div>

                <p class="text-xs text-black/40 mt-2">
                  Após esse período, as tarefas em modo revezamento serão
                  redistribuídas.
                </p>
              </div>
            </div>
          </div>

          <div class="border-t border-[#ECE4D8] p-6">
            <h2 class="font-semibold">Status do ciclo</h2>

            <p class="text-sm text-black/50">
              Ative o ciclo para começar o revezamento.
            </p>

            <Toogle v-model="form.ativo" label="Ativo" />
          </div>

          <div class="border-t border-[#ECE4D8] p-5 flex justify-end gap-3">
            <Button type="button" variant="outline" @click="limparForm">
              Limpar
            </Button>

            <Button type="submit">
              {{ acao === "criar" ? "Salvar" : "Atualizar" }} ciclo
            </Button>
          </div>
        </form>
      </div>

      <div class="space-y-5">
        <div class="bg-white rounded-2xl border p-5">
          <h2 class="font-semibold mb-5">Como funciona</h2>

          <div
            v-for="(item, index) in passos"
            :key="item.titulo"
            class="flex gap-3 mb-5"
          >
            <div
              class="w-6 h-6 rounded-full bg-[#53864C] text-white text-xs flex items-center justify-center"
            >
              {{ index + 1 }}
            </div>

            <div>
              <p class="text-sm font-medium">
                {{ item.titulo }}
              </p>

              <p class="text-xs text-black/50">
                {{ item.texto }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-[#EEF5EA] border border-[#53864C]/20 rounded-xl p-5">
          <p class="font-medium text-[#24572E]">💡 Dica</p>

          <p class="text-sm text-black/60 mt-2">
            Você pode ter apenas um ciclo ativo por vez na família.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNovoCiclo } from "./useNovoCiclo";
import Input from "@/components/input/index.vue";
import Toogle from "@/components/toggle/index.vue";
import Textarea from "@/components/textarea/index.vue";
import { useApiNovoCiclo } from "./useApiNovoCiclo";
import Button from "@/components/botao/index.vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const { form, passos, acao, idCiclo, limparForm } = useNovoCiclo();
const { criaNovoCiclo, obterCicloPorId, atualizarCiclo } = useApiNovoCiclo();
const router = useRouter();

onMounted(async () => {
  const { id } = router.currentRoute.value.query;

  if (id) {
    idCiclo.value = id as string;
    acao.value = "editar";
    await obterCicloPorId();
  }
});
</script>
