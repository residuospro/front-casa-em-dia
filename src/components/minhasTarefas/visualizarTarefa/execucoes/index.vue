<template>
  <div v-if="execucoesAgrupadas.length">
    <h3 class="text-sm font-medium text-gray-500 mb-2">{{ titulo }}</h3>

    <div class="space-y-4">
      <div
        class="flex justify-between bg-gray-50 rounded-2xl p-4 sm:flex-col sm:items-start md:!flex-col gap-3"
        v-for="(item, index) in execucoesAgrupadas.slice(0, qtExecucoes)"
        :key="index"
      >
        <div
          class="flex items-center justify-between gap-4 sm:w-full md:!w-full"
        >
          <div class="flex items-center justify-between sm:w-full md:!w-full">
            <div class="flex items-center gap-2">
              <div
                v-if="obterProximaExecucao([item])"
                class="flex flex-col gap-1"
              >
                <div
                  class="flex items-start gap-2"
                  :class="
                    obterClasseExecucaoFormatada(obterProximaExecucao([item]))
                      .text
                  "
                >
                  <span
                    class="mt-[6px] h-2.5 w-2.5 rounded-full shrink-0"
                    :class="
                      obterClasseExecucaoFormatada(obterProximaExecucao([item]))
                        .dot
                    "
                  />

                  <div class="flex flex-col">
                    <span class="text-sm font-medium leading-5">
                      {{
                        formatarExecucao(obterProximaExecucao([item])).titulo
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <span
                class="border rounded-full p-1 text-sm capitalize"
                :class="setarClasseStatus(item)"
                >{{ item.status.toLocaleLowerCase() }}
              </span>
            </div>

            <div class="lg:hidden xl:hidden">
              <ce-context-menu
                v-if="!['CONCLUIDA', 'CANCELADA'].includes(item.status)"
                :items="opcoesMenuExecucao"
                @select="
                  executarOpcoesMenuExecucao($event, item.id, dataTarefa?.id)
                "
              >
                <button>
                  <svg-icon
                    type="mdi"
                    :path="mdiDotsVertical"
                    class="text-gray-400 cursor-pointer"
                  />
                </button>
              </ce-context-menu>
            </div>
          </div>
        </div>

        <div class="flex flex-row gap-2">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
              <ce-tooltip
                v-if="
                  item.executorId &&
                  item.concluidoPorId &&
                  item.executorId === item.concluidoPorId
                "
                :focus="false"
                location="top"
                :text="`Executado e concluído por: ${
                  perfilMembro(item.executorId).nome
                }`"
              >
                <template #activator>
                  <button>
                    <img
                      :src="
                        parseFotoPerfil(
                          perfilMembro(item.executorId).foto || '',
                        )
                      "
                      alt=""
                      class="w-6 h-6 rounded-full"
                    />
                  </button>
                </template>
              </ce-tooltip>

              <!-- Executor diferente de quem concluiu -->
              <template v-else>
                <!-- Executor -->
                <ce-tooltip
                  v-if="item.executorId"
                  :focus="false"
                  location="top"
                  :text="`Executado por: ${perfilMembro(item.executorId).nome}`"
                >
                  <template #activator>
                    <button>
                      <img
                        :src="
                          parseFotoPerfil(
                            perfilMembro(item.executorId).foto || '',
                          )
                        "
                        alt=""
                        class="w-6 h-6 rounded-full"
                      />
                    </button>
                  </template>
                </ce-tooltip>

                <!-- Quem concluiu -->
                <ce-tooltip
                  v-if="item.concluidoPorId"
                  :focus="false"
                  location="top"
                  :text="`Concluído por: ${
                    perfilMembro(item.concluidoPorId).nome
                  }`"
                >
                  <template #activator>
                    <button>
                      <img
                        :src="
                          parseFotoPerfil(
                            perfilMembro(item.concluidoPorId).foto || '',
                          )
                        "
                        alt=""
                        class="w-6 h-6 rounded-full"
                      />
                    </button>
                  </template>
                </ce-tooltip>
              </template>
            </div>
            <span
              class="text-emerald-600 font-medium"
              v-if="item.pontosObtidos"
            >
              +{{ item.pontosObtidos }} pts
            </span>
          </div>

          <div class="sm:!hidden md:!hidden">
            <ce-context-menu
              v-if="!['CONCLUIDA', 'CANCELADA'].includes(item.status)"
              :items="opcoesMenuExecucao"
              @select="
                executarOpcoesMenuExecucao($event, item.id, dataTarefa?.id)
              "
            >
              <button>
                <svg-icon
                  type="mdi"
                  :path="mdiDotsVertical"
                  class="text-gray-400 cursor-pointer"
                />
              </button>
            </ce-context-menu>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-6" v-if="exibirBtnHistorico">
      <button
        @click="setarQtdExecucao"
        class="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
      >
        {{
          verHisticoCompleto
            ? "Recolher histórico ↑"
            : "Ver histórico completo ↓"
        }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Execucao } from "../../tipagem";
import { useTarefas } from "../../useTarefas";
import { useVisualizarTarefas } from "../useVisualizarTarefa";
import { useUtils } from "@/utils/useUtils";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { CeContextMenu } from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";
import { CeTooltip } from "@comercti/vue-components-hmg";

const { perfilMembro } = useMinhaFamilia();
const { parseFotoPerfil } = useUtils();
const {
  executarOpcoesMenuExecucao,
  setarClasseStatus,
  setarQtdExecucao,
  verHisticoCompleto,
  opcoesMenuExecucao,
  dataTarefa,
} = useVisualizarTarefas();
const { obterClasseExecucaoFormatada, formatarExecucao, obterProximaExecucao } =
  useTarefas();

withDefaults(
  defineProps<{
    execucoesAgrupadas: Execucao[];
    titulo: string;
    qtExecucoes: number;
    exibirBtnHistorico?: boolean;
  }>(),
  {
    qtExecucoes: 4,
    exibirBtnHistorico: false,
  },
);
</script>
