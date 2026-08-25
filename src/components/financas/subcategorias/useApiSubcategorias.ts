import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useSubcategorias } from "./useSubcategorias";
import type { IResponseSubcategorias } from "./tipagem";

export const useApiSubcategorias = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    subcategoriaSelecionada,
  } = useSubcategorias();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseSubcategorias> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/subcategorias`,
          {
            params: parametros.value,
          },
        );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarSubcategoria = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/subcategorias/${subcategoriaSelecionada.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Subcategoria deletada com sucesso");
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
    deletarSubcategoria,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
