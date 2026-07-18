<template>
  <Modal
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar tarefa"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="
      async () => {
        await deleteTarefa();
        router.push('/minhas-tarefas');
      }
    "
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a tarefa {{ tarefaSelecionada?.titulo }}?
    </span>
  </Modal>

  <Modal
    :abrir-modal="abrirModalCancelar"
    titulo="Cancelar execução"
    subtitulo=""
    texto-botao="Sim"
    @fechar-modal="() => (abrirModalCancelar = false)"
    :salvar="
      async () => {
        cancelarExecucao(execucao.execucaoId, execucao.tarefaId);
      }
    "
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja cancelar essa execução?
    </span>
  </Modal>

  <Modal
    :abrir-modal="abrirModalConcluir"
    titulo="Concluir execução"
    subtitulo="Selecione um responsável e conclua!"
    texto-botao="Concluir"
    @fechar-modal="() => (abrirModalConcluir = false)"
    :salvar="
      () =>
        concluirExecucao(
          execucao.execucaoId,
          execucao.tarefaId,
          execucao.concluidoPorId,
        )
    "
  >
    <Select
      label="Responsável"
      placeholder="Selecione um membro"
      v-model="execucao.concluidoPorId"
      :items="opcoesFamiliares"
    />
  </Modal>

  <Modal
    :abrir-modal="abrirModalEditar"
    titulo="Editar execução"
    subtitulo=""
    texto-botao="Atualizar"
    @fechar-modal="() => (abrirModalEditar = false)"
    :salvar="
      () =>
        atualizarExecucao(
          execucao.execucaoId,
          execucao.tarefaId,
          execucao.executorId,
        )
    "
  >
    <div class="flex flex-col gap-2">
      <ce-date-picker
        modal
        id="periodo-atualizar-execucao"
        label="Período"
        format="yyyy-MM-dd"
        v-model="dataInicio"
      />

      <div class="-mt-2 mb-2">
        <Input label="Horário" type="time" v-model="horario" />
      </div>

      <Select
        label="Executor"
        placeholder="Selecione um membro"
        v-model="execucao.executorId"
        :items="opcoesFamiliares"
      />
    </div>
  </Modal>

  <Visualizar />
</template>

<route lang="json">
{
  "name": "minhas-tarefas.visualizar-tarefa",
  "meta": {
    "title": "Ciclos",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import Visualizar from "@/components/minhasTarefas/visualizarTarefa/index.vue";
import { useTarefas } from "@/components/minhasTarefas/useTarefas";
import { useApiTarefas } from "@/components/minhasTarefas/useApiTarefas";
import Modal from "@/components/modal/index.vue";
import { useRouter } from "vue-router";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { onMounted } from "vue";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useVisualizarTarefas } from "@/components/minhasTarefas/visualizarTarefa/useVisualizarTarefa";
import { useApiVisualizarTarefa } from "@/components/minhasTarefas/visualizarTarefa/useApiVisualizarTarefa";
import Select from "@/components/select/index.vue";
import Input from "@/components/input/index.vue";
import { CeDatePicker } from "@comercti/vue-components-hmg";

const { opcoesFamiliares } = useMinhaFamilia();
const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const router = useRouter();
const { abrirModalDeletar, tarefaSelecionada } = useTarefas();
const { deleteTarefa } = useApiTarefas();
const {
  abrirModalConcluir,
  execucao,
  abrirModalCancelar,
  abrirModalEditar,
  dataInicio,
  horario,
} = useVisualizarTarefas();
const { concluirExecucao, cancelarExecucao, atualizarExecucao } =
  useApiVisualizarTarefa();

onMounted(async () => {
  await obterOpcoesFamiliares();
});
</script>
