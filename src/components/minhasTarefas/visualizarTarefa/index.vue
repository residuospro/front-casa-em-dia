<template>
  <div class="w-full bg-white min-h-screen rounded-xl">
    <div
      class="p-5 flex items-start justify-between border-b sm:flex-col gap-8"
    >
      <div class="flex items-center gap-4">
        <div
          class="rounded-full p-2"
          :style="{
            background: getCategoriaStyle('CASA').background,
          }"
        >
          <svg-icon
            type="mdi"
            :path="setarIconePorCategoria('CASA')"
            :style="{ color: getCategoriaStyle('CASA').cor }"
          />
        </div>

        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-gray-900">
            {{ dataTarefa?.titulo }}
          </h1>
          <span
            v-if="dataTarefa?.ativo"
            class="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full"
          >
            {{ dataTarefa?.ativo && "Ativo" }}
          </span>
        </div>
      </div>

      <Button @click="router.push('/minhas-tarefas')" class="sm:!w-full">
        Visualizar tarefas
      </Button>
    </div>

    <div class="flex flex-row gap-8 p-8 sm:flex-col">
      <!-- Coluna Esquerda -->
      <div class="flex-1 space-y-8">
        <!-- Informações Gerais -->
        <div>
          <h2 class="font-semibold text-lg mb-4">Informações gerais</h2>
          <div
            class="flex flex-row sm:flex-col gap-4 xl:!w-1/2 w-full justify-between"
          >
            <div class="space-y-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Tipo</p>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
                  :style="{
                    color: getTagTarefaStyle(dataTarefa?.tipo).tipo?.cor,
                    background: getTagTarefaStyle(dataTarefa?.tipo).tipo
                      ?.background,
                  }"
                >
                  {{ dataTarefa?.tipo.toLocaleLowerCase() }}
                </span>
              </div>
              <div v-if="dataTarefa?.modoDistribuicao">
                <p class="text-sm text-gray-500 mb-1">Distribuição</p>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
                  :style="{
                    color: getTagTarefaStyle(
                      dataTarefa?.tipo,
                      dataTarefa?.modoDistribuicao,
                    ).modo?.cor,

                    background: getTagTarefaStyle(
                      dataTarefa?.tipo,
                      dataTarefa?.modoDistribuicao,
                    ).modo?.background,
                  }"
                >
                  {{ dataTarefa?.modoDistribuicao.toLocaleLowerCase() }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Categoria</p>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
                  :style="{
                    color: getCategoriaStyle(dataTarefa?.categoria).cor,
                    background: getCategoriaStyle(dataTarefa?.categoria)
                      .background,
                  }"
                >
                  {{ dataTarefa?.categoria.toLocaleLowerCase() }}
                </span>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <p class="text-sm text-gray-500 mb-1">Responsável atual</p>
                <div class="flex items-center gap-3">
                  <img
                    :src="
                      parseFotoPerfil(
                        dataTarefa?.responsavelAtual?.fotoPerfil || '',
                      )
                    "
                    alt="Kallif"
                    class="w-9 h-9 rounded-full"
                  />
                  <div>
                    <p class="font-medium">
                      {{ dataTarefa?.responsavelAtual.nome }}
                    </p>
                    <p class="text-xs text-gray-500">Esta semana</p>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Pontuação</p>
                <p class="font-medium">{{ dataTarefa?.pontos }} pts</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Criada por</p>
                <p class="font-medium">{{ criadoPor }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Criada em</p>
                <p class="font-medium">
                  {{ formatarData(String(dataTarefa?.criadoEm)) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Histórico Recente -->
        <div class="flex flex-col gap-2">
          <h2 class="font-semibold text-lg">Histórico recente</h2>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
              v-for="(item, index) in dataTarefa?.execucoes.slice(
                0,
                qtdExecucao,
              )"
              :key="index"
            >
              <div class="flex items-center gap-4">
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
                        obterClasseExecucaoFormatada(
                          obterProximaExecucao([item]),
                        ).dot
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

              <div class="flex flex-row gap-2">
                <div class="flex items-center gap-3" v-if="item.concluidoPorId">
                  <div class="flex items-center gap-2">
                    <img
                      :src="
                        parseFotoPerfil(
                          perfilConcluidoPor(item.concluidoPorId).foto || '',
                        )
                      "
                      alt=""
                      class="w-6 h-6 rounded-full"
                    />
                    <span
                      :title="perfilConcluidoPor(item.concluidoPorId).nome"
                      class="text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                      >{{ perfilConcluidoPor(item.concluidoPorId).nome }}</span
                    >
                  </div>
                  <span class="text-emerald-600 font-medium">
                    +{{ item.pontosObtidos }} pts
                  </span>
                </div>

                <ce-context-menu
                  v-if="!['CONCLUIDA', 'CANCELADA'].includes(item.status)"
                  :items="opcoesMenuExecucao"
                  @select="executarOpcoesMenuExecucao($event, item.id)"
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

            <div class="text-center mt-6">
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
        </div>
      </div>

      <!-- Coluna Direita -->
      <div class="w-[40%] sm:w-full flex flex-col">
        <div class="flex flex-col gap-4">
          <div class="bg-white border rounded-3xl p-6">
            <h3 class="font-semibold mb-3">Descrição</h3>
            <p class="text-gray-600 leading-relaxed break-words">
              {{ dataTarefa?.descricao }}
            </p>
          </div>

          <!-- Agendamento -->
          <div class="bg-white border rounded-3xl p-6">
            <h3 class="font-semibold mb-4">Agendamento</h3>

            <div class="space-y-3">
              <div
                v-for="item in formatarAgendamento(dataTarefa?.execucoes || [])"
                :key="item.dia"
                class="flex items-center justify-between py-2 sm:text-xs"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold p-1"
                  >
                    <svg-icon
                      type="mdi"
                      :path="mdiClockTimeEightOutline"
                      class="text-emerald-600"
                    />
                  </div>

                  <span>{{ item.dia }}</span>
                </div>

                <span class="font-medium">
                  {{ item.horarios.join(" & ") }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 w-full justify-end flex-col mt-4">
          <Button
            variant="outline"
            @click="
              executarOpcoesMenu(
                'editar',
                dataTarefa?.id || '',
                dataTarefa?.titulo || '',
              )
            "
          >
            Editar tarefa
          </Button>
          <button
            @click="
              executarOpcoesMenu(
                'excluir',
                dataTarefa?.id || '',
                dataTarefa?.titulo || '',
              )
            "
            class="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical, mdiClockTimeEightOutline } from "@mdi/js";
import { useTarefas } from "../useTarefas";
import { useApiVisualizarTarefa } from "./useApiVisualizarTarefa";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVisualizarTarefas } from "./useVisualizarTarefa";
import { useUtils } from "@/utils/useUtils";
import { CeContextMenu } from "@comercti/vue-components-hmg";
import Button from "@/components/botao/index.vue";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";

const {
  getCategoriaStyle,
  setarIconePorCategoria,
  getTagTarefaStyle,
  executarOpcoesMenu,
  obterClasseExecucaoFormatada,
  formatarExecucao,
  obterProximaExecucao,
} = useTarefas();
const { obterTarefaPorId } = useApiVisualizarTarefa();
const {
  dataTarefa,
  opcoesMenuExecucao,
  qtdExecucao,
  verHisticoCompleto,
  execucao,
  formatarAgendamento,
  setarClasseStatus,
  setarQtdExecucao,
  executarOpcoesMenuExecucao,
} = useVisualizarTarefas();
const { parseFotoPerfil, formatarData } = useUtils();
const { opcoesFamiliares } = useMinhaFamilia();

const router = useRouter();

const criadoPor = computed(
  () =>
    opcoesFamiliares.value.find(
      (opcao) => opcao.value === dataTarefa?.value?.criadoPorId,
    )?.text || "",
);

const perfilConcluidoPor = (concludoPorId: string) => {
  const usuario = opcoesFamiliares.value.find(
    (opcao) => opcao.value === concludoPorId,
  );

  return {
    foto: usuario?.fotoPerfil,
    nome: usuario?.text,
  };
};

onMounted(async () => {
  const id = router.currentRoute.value.query.id as string;
  execucao.value.tarefaId = id;
  await obterTarefaPorId(id);
});
</script>
