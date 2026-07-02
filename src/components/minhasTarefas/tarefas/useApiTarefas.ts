import { useClient } from "@/client";
import { useTarefas } from "./useTarefas";
import { usePerfil } from "@/composables/usePerfil";
import type { AxiosResponse } from "axios";
import type { IResponseTarefa } from "./tipagem";

export const useApiTarefas = () => {
  const { parametros, manipularResposta, resetarParametros } = useTarefas();
  const { perfil } = usePerfil();

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

  return {
    chamarApi,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
