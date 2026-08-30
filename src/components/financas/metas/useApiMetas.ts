import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useMetas } from "./useMetas";
import type { IResponseMetas } from "./tipagem";

export const useApiMetas = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    metaDeletando,
    metaConcluindo,
  } = useMetas();

  const serializarParametros = (): Record<string, any> => {
    const params: Record<string, any> = {
      pagina: parametros.value.paginacao.pagina,
      por_pagina: parametros.value.paginacao.por_pagina,
    };

    if (parametros.value.ordenacao.length) {
      params.ordenacao = parametros.value.ordenacao;
    }

    const f = parametros.value.filtro;
    if (f.busca) params.busca = f.busca;
    if (f.status?.length) params.status = f.status.join(",");
    if (f.tipo?.length) params.tipo = f.tipo.join(",");

    return params;
  };

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseMetas> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/metas`,
        { params: serializarParametros() },
      );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarMeta = async () => {
    const id = metaDeletando.value?.id;
    if (!id) return;

    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/metas/${id}`,
    );

    useRespostaApi(resposta.status, null, "Meta deletada com sucesso");
    abrirModalDeletar.value = false;
    await chamarApi();
  };

  const concluirMeta = async () => {
    const id = metaConcluindo.value?.id;
    if (!id) return;

    try {
      const resposta: AxiosResponse = await useClient.patch(
        `/financeiro/${perfil.value.familiaId}/financeiro/metas/${id}/concluir`,
      );

      if (resposta.status === 200) {
        useRespostaApi(resposta.status, null, "Meta concluída com sucesso");
        await chamarApi();
      }
    } finally {
      metaConcluindo.value = null;
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
    deletarMeta,
    concluirMeta,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};