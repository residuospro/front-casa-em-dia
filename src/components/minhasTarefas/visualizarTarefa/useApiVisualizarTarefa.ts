import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { usePerfil } from "@/store/usePerfil";
import type { Tarefa, IResponseExecucoes } from "../tipagem";
import { useVisualizarTarefas } from "./useVisualizarTarefa";

export const useApiVisualizarTarefa = () => {
  const { perfil } = usePerfil();
  const {
    dataTarefa,
    abrirModalConcluir,
    abrirModalCancelar,
    abrirModalEditar,
    setarDataAtualizar,
    POR_PAGINA_EXECUCOES,
    execucoesListadas,
    paginaExecucoes,
    ultimaPaginaExecucoes,
    totalExecucoes,
    carregandoExecucoes,
  } = useVisualizarTarefas();

  const urlExecucoes = (tarefaId: string) =>
    `/tarefas/${perfil.familiaId}/tarefas/${tarefaId}/execucoes`;

  const obterExecucoesPorPagina = async (tarefaId: string, pagina: number) => {
    carregandoExecucoes.value = true;

    try {
      const resposta: AxiosResponse<IResponseExecucoes> = await useClient.get(
        urlExecucoes(tarefaId),
        {
          params: { pagina, por_pagina: POR_PAGINA_EXECUCOES },
        },
      );

      if (resposta.status === 200) {
        execucoesListadas.value = resposta.data.data;
        totalExecucoes.value = resposta.data.paginacao.total;
        ultimaPaginaExecucoes.value = resposta.data.paginacao.ultima_pagina;
        paginaExecucoes.value = resposta.data.paginacao.pagina;
      }
    } finally {
      carregandoExecucoes.value = false;
    }
  };

  const obterExecucoes = (tarefaId: string) =>
    obterExecucoesPorPagina(tarefaId, 1);

  const obterTarefaPorId = async (id: string) => {
    const resposta: AxiosResponse<Tarefa> = await useClient.get(
      `/tarefas/${perfil.familiaId}/tarefas/${id}`,
    );

    if (resposta.status === 200) {
      dataTarefa.value = resposta.data;
      console.log("res", resposta);
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
      await Promise.all([
        obterTarefaPorId(tarefaId),
        obterExecucoesPorPagina(tarefaId, paginaExecucoes.value || 1),
      ]);
      abrirModalConcluir.value = false;
    }
  };

  const cancelarExecucao = async (execucaoId: string, tarefaId: string) => {
    const resposta: AxiosResponse<Tarefa> = await useClient.post(
      `/tarefas/${perfil.familiaId}/execucoes/${execucaoId}/cancelar`,
    );

    if (resposta.status === 200) {
      await Promise.all([
        obterTarefaPorId(tarefaId),
        obterExecucoesPorPagina(tarefaId, paginaExecucoes.value || 1),
      ]);
      abrirModalCancelar.value = false;
    }
  };

  const atualizarExecucao = async (
    execucaoId: string,
    tarefaId: string,
    executorId: string | null,
  ) => {
    const data = setarDataAtualizar()[0]?.data;

    const resposta: AxiosResponse<Tarefa> = await useClient.put(
      `/tarefas/${perfil.familiaId}/execucoes/${execucaoId}`,
      { data, executorId },
    );

    if (resposta.status === 200) {
      await Promise.all([
        obterTarefaPorId(tarefaId),
        obterExecucoesPorPagina(tarefaId, paginaExecucoes.value || 1),
      ]);
      abrirModalEditar.value = false;
    }
  };

  return {
    obterTarefaPorId,
    obterExecucoes,
    obterExecucoesPorPagina,
    concluirExecucao,
    cancelarExecucao,
    atualizarExecucao,
  };
};
