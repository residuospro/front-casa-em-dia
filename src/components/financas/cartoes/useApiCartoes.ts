import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useCartoes } from "./useCartoes";
import type { IResponseCartoes } from "./tipagem";

export const useApiCartoes = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    cartaoSelecionado,
  } = useCartoes();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseCartoes> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/cartoes`,
        {
          params: parametros.value,
        },
      );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarCartao = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/cartoes/${cartaoSelecionado.value?.id}`,
    );

    useRespostaApi(resposta.status);
    abrirModalDeletar.value = false;
    await chamarApi();
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
    deletarCartao,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
