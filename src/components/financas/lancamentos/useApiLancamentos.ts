import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useLancamentos } from "./useLancamentos";
import type { IResponseLancamentos } from "./tipagem";

export const useApiLancamentos = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    lancamentoSelecionado,
  } = useLancamentos();

  const chamarApi = async () => {
    try {
      const params: Record<string, any> = {
        paginacao: parametros.value.paginacao,
        ordenacao: parametros.value.ordenacao,
      };

      const f = parametros.value.filtro;
      if (f.busca) params.busca = f.busca;
      if (f.tipo?.length) params.tipo = f.tipo.join(",");
      if (f.status?.length) params.status = f.status.join(",");
      if (f.inicio) params.inicio = f.inicio;
      if (f.fim) params.fim = f.fim;

      const resposta: AxiosResponse<IResponseLancamentos> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos`,
          { params },
        );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarLancamento = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos/${lancamentoSelecionado.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Lançamento deletado com sucesso");
    abrirModalDeletar.value = false;
    await chamarApi();
  };

  const alterarStatus = async (id: string, status: string) => {
    const resposta: AxiosResponse = await useClient.patch(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos/${id}/status`,
      { status },
    );

    if (resposta.status === 200) {
      useRespostaApi(resposta.status, null, "Status atualizado com sucesso");
      await chamarApi();
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
    deletarLancamento,
    alterarStatus,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
