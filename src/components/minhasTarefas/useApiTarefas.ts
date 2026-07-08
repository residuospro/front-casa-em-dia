import { useClient } from "@/client";
import { useTarefas } from "./useTarefas";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import type { IResponseTarefa } from "./tipagem";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";

export const useApiTarefas = () => {
  const {
    parametros,
    tarefaSelecionada,
    abrirModalDeletar,
    abrirModalFiltro,
    filtrado,
    manipularResposta,
    resetarParametros,
  } = useTarefas();
  const { perfil } = storeToRefs(usePerfil());

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseTarefa> = await useClient.get(
        `/tarefas/${perfil.value.familiaId}/tarefas`,
        {
          params: parametros.value,
        },
      );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const obterPorFiltro = async () => {
    await chamarApi();
    abrirModalFiltro.value = false;
    filtrado.value = true;
  };

  const obterDadosPorOrdenacao = async (ordenacao: {
    key: string;
    order: "asc" | "desc";
  }) => {
    parametros.value.ordenacao = [
      { coluna: ordenacao.key, direcao: ordenacao.order },
    ];
    await chamarApi();
  };

  const obterDadosPorItensPorPagina = async (itens: number) => {
    parametros.value.paginacao.por_pagina = itens;
    parametros.value.paginacao.pagina = 1;
    await chamarApi();
  };

  const obterDadosPorPagina = async (pagina: number) => {
    parametros.value.paginacao.pagina = pagina;
    await chamarApi();
  };

  const deleteTarefa = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/tarefas/${perfil.value.familiaId}/tarefas/${tarefaSelecionada.value?.id}`,
    );

    useRespostaApi(resposta.status);
    abrirModalDeletar.value = false;
    await chamarApi();
  };

  return {
    chamarApi,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
    deleteTarefa,
    obterPorFiltro,
  };
};
