<template>
  <div class="w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
    <div class="p-4 border-b">
      <h1 class="text-xl font-semibold text-gray-900">Tarefas urgentes</h1>
    </div>

    <div class="divide-y divide-gray-100">
      <div
        v-for="(task, index) in dataTarefasUrgentes"
        :key="index"
        class="px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
      >
        <div
          class="flex flex-rows items-center justify-between w-full sm:flex-col sm:items-start sm:gap-4"
        >
          <div class="flex-1 min-w-0 flex flex-row gap-2 items-center">
            <p :class="['text-[17px] font-medium']">
              {{ task.titulo }}
            </p>

            <span
              class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
              :style="{
                color: getCategoriaStyle(task?.categoria).cor,
                background: getCategoriaStyle(task?.categoria).background,
              }"
            >
              {{ task?.categoria.toLocaleLowerCase() }}
            </span>
          </div>

          <div
            class="flex items-center gap-10 sm:gap-4 sm:justify-between sm:w-full"
          >
            <div class="flex items-center gap-4">
              <div
                v-if="obterProximaExecucao(task.execucoes)"
                class="flex flex-col gap-1"
              >
                <div
                  class="flex items-start gap-2"
                  :class="
                    obterClasseExecucaoFormatada(
                      obterProximaExecucao(task.execucoes),
                    ).text
                  "
                >
                  <span
                    class="mt-[6px] h-2.5 w-2.5 rounded-full shrink-0"
                    :class="
                      obterClasseExecucaoFormatada(
                        obterProximaExecucao(task.execucoes),
                      ).dot
                    "
                  />

                  <div class="flex flex-col">
                    <span class="text-sm font-medium leading-5">
                      {{
                        formatarExecucao(obterProximaExecucao(task.execucoes))
                          .titulo
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <span
                class="border rounded-full p-1 text-sm capitalize"
                :class="setarClasseStatus(task?.execucoes[0] || null)"
                >{{
                  (task.execucoes[0]?.status || "AGENDADA").toLocaleLowerCase()
                }}
              </span>
            </div>

            <img
              :src="
                parseFotoPerfil(
                  perfilResponsavel(task?.responsavelAtualId).foto || '',
                )
              "
              :alt="perfilResponsavel(task?.responsavelAtualId).nome"
              class="w-9 h-9 rounded-2xl object-cover ring-2 ring-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="p-4 flex items-center justify-center border-t text-center w-full"
    >
      <button
        @click="router.push('/minhas-tarefas')"
        class="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
      >
        Ver todas as tarefas
        <span aria-hidden="true">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTarefasUrgentes } from "./useTarefasUrgentes";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useUtils } from "@/utils/useUtils";
import { useTarefas } from "@/components/minhasTarefas/useTarefas";
import { useVisualizarTarefas } from "@/components/minhasTarefas/visualizarTarefa/useVisualizarTarefa";
import { useRouter } from "vue-router";

const router = useRouter();
const { dataTarefasUrgentes } = useTarefasUrgentes();
const {
  obterProximaExecucao,
  obterClasseExecucaoFormatada,
  formatarExecucao,
  getCategoriaStyle,
} = useTarefas();
const { opcoesFamiliares } = useMinhaFamilia();
const { parseFotoPerfil } = useUtils();
const { setarClasseStatus } = useVisualizarTarefas();

const perfilResponsavel = (responsavelId: string | null) => {
  const usuario = opcoesFamiliares.value.find(
    (opcao) => opcao.value === responsavelId,
  );

  return {
    foto: usuario?.fotoPerfil || "",
    nome: usuario?.text || "",
  };
};
</script>
