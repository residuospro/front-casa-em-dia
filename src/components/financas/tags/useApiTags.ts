import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useTags } from "./useTags";
import type { IResponseTag } from "./tipagem";

export const useApiTags = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    tagSelecionada,
  } = useTags();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseTag> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/tags`,
          {
            params: parametros.value,
          },
        );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarTag = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/tags/${tagSelecionada.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Tag deletada com sucesso");
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
    deletarTag,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
