import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { usePerfil } from "@/store/usePerfil";
import type { Tarefa } from "../tipagem";
import { useVisualizarTarefas } from "./useVisualizarTarefa";

export const useApiVisualizarTarefa = () => {
  const { perfil } = usePerfil();
  const {
    dataTarefa,
    abrirModalConcluir,
    abrirModalCancelar,
    abrirModalEditar,
    setarDataAtualizar,
  } = useVisualizarTarefas();

  const obterTarefaPorId = async (id: string) => {
    const resposta: AxiosResponse<Tarefa> = await useClient.get(
      `/tarefas/${perfil.familiaId}/tarefas/${id}`,
    );

    if (resposta.status === 200) {
      dataTarefa.value = resposta.data;
    }
  };

  const concluirExecucao = async (
    execucaoId: string,
    tarefaId: string,
    concluidoPorId: string,
  ) => {
    const resposta: AxiosResponse<Tarefa> = await useClient.post(
      `/tarefas/${perfil.familiaId}/execucoes/${execucaoId}/concluir`,
      { concluidoPorId },
    );

    if (resposta.status === 200) {
      await obterTarefaPorId(tarefaId);
      abrirModalConcluir.value = false;
    }
  };

  const cancelarExecucao = async (execucaoId: string, tarefaId: string) => {
    const resposta: AxiosResponse<Tarefa> = await useClient.post(
      `/tarefas/${perfil.familiaId}/execucoes/${execucaoId}/cancelar`,
    );

    if (resposta.status === 200) {
      await obterTarefaPorId(tarefaId);
      abrirModalCancelar.value = false;
    }
  };

  const atualizarExecucao = async (execucaoId: string, tarefaId: string) => {
    const data = setarDataAtualizar()[0]?.data;

    const resposta: AxiosResponse<Tarefa> = await useClient.put(
      `/tarefas/${perfil.familiaId}/execucoes/${execucaoId}`,
      { data },
    );

    if (resposta.status === 200) {
      await obterTarefaPorId(tarefaId);
      abrirModalEditar.value = false;
    }
  };

  return {
    obterTarefaPorId,
    concluirExecucao,
    cancelarExecucao,
    atualizarExecucao,
  };
};
