import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useCategorias } from "./useCategorias";
import type { IResponseCategorias } from "./tipagem";

export const useApiCategorias = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    incluirArquivadas,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    categoriaSelecionada,
  } = useCategorias();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseCategorias> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/categorias`,
        {
          params: {
            ...parametros.value,
            incluirArquivadas: incluirArquivadas.value,
          },
        },
      );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarCategoria = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/categorias/${categoriaSelecionada.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Categoria deletada com sucesso");
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
    deletarCategoria,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
