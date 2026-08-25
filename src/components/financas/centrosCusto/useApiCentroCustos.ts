import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useCentroCustos } from "./useCentroCustos";
import type { IResponseCentroCusto } from "./tipagem";

export const useApiCentroCustos = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    centroCustoSelecionado,
  } = useCentroCustos();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseCentroCusto> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/centros-custo`,
          {
            params: parametros.value,
          },
        );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarCentroCusto = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/centros-custo/${centroCustoSelecionado.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Centro de custo deletado com sucesso");
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
    deletarCentroCusto,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
