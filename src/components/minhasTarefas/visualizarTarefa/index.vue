<template>
  <div class="w-full bg-white min-h-screen rounded-xl">
    <Header />

    <div class="flex flex-row gap-8 p-8 sm:flex-col">
      <!-- Coluna Esquerda -->
      <div class="flex-1 space-y-8">
        <InfoGerais />

        <div class="flex flex-col gap-4">
          <h2 class="font-semibold text-lg">Histórico recente</h2>

          <Execucoes
            :execucoes-agrupadas="execucoesAgrupadas.atuais"
            titulo="Execuções atuais"
            :qt-execucoes="dataTarefa?.execucoes.length || 4"
          />

          <Execucoes
            :execucoes-agrupadas="execucoesAgrupadas.passadas"
            titulo="Execuções passadas"
            :qt-execucoes="qtdExecucao"
            :exibir-btn-historico="execucoesAgrupadas.passadas.length > 4"
          />
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

          <Agendamentos />
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
import { useTarefas } from "../useTarefas";
import { useApiVisualizarTarefa } from "./useApiVisualizarTarefa";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVisualizarTarefas } from "./useVisualizarTarefa";
import Button from "@/components/botao/index.vue";
import Execucoes from "./execucoes/index.vue";
import InfoGerais from "./infoGerais/index.vue";
import Agendamentos from "./agendamento/index.vue";
import Header from "./header/index.vue";

const { executarOpcoesMenu } = useTarefas();
const { obterTarefaPorId } = useApiVisualizarTarefa();
const { dataTarefa, execucoesAgrupadas, qtdExecucao, execucao } =
  useVisualizarTarefas();

const router = useRouter();

onMounted(async () => {
  const id = router.currentRoute.value.query.id as string;
  execucao.value.tarefaId = id;
  await obterTarefaPorId(id);
});
</script>
