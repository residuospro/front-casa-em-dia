import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useRecorrencias } from "./useRecorrencias";
import type { IResponseRecorrencias, IExecucaoManual } from "./tipagem";

export const useApiRecorrencias = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    abrirModalDeletar,
    abrirModalExecutar,
    recorrenciaSelecionada,
    recorrenciaExecutar,
  } = useRecorrencias();

  const serializarParametros = (): Record<string, any> => {
    const params: Record<string, any> = {
      pagina: parametros.value.paginacao.pagina,
      por_pagina: parametros.value.paginacao.por_pagina,
    };

    if (parametros.value.ordenacao.length) {
      params.ordenacao = parametros.value.ordenacao;
    }

    const f = parametros.value.filtro;
    if (f.ativa !== null) params.ativa = f.ativa;
    if (f.frequencia?.length) params.frequencia = f.frequencia.join(",");

    return params;
  };

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseRecorrencias> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias`,
          { params: serializarParametros() },
        );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const deletarRecorrencia = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias/${recorrenciaSelecionada.value?.id}`,
    );

    useRespostaApi(resposta.status, null, "Recorrência deletada com sucesso");
    abrirModalDeletar.value = false;
    await chamarApi();
  };

  const alterarStatus = async (id: string, ativa: boolean) => {
    const resposta: AxiosResponse = await useClient.patch(
      `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias/${id}/status`,
      { ativa },
    );

    if (resposta.status === 200) {
      useRespostaApi(resposta.status, null, "Status atualizado com sucesso");
      await chamarApi();
    }
  };

  const executarManual = async () => {
    if (!recorrenciaExecutar.value) return;

    const resposta: AxiosResponse<IExecucaoManual> = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias/${recorrenciaExecutar.value.id}/executar`,
    );

    if (resposta.status === 200) {
      const gerada = resposta.data.gerada;
      useRespostaApi(
        resposta.status,
        null,
        gerada
          ? "Ocorrência gerada com sucesso"
          : "Ocorrência já existia, apenas avançou o ciclo",
      );
      abrirModalExecutar.value = false;
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
    deletarRecorrencia,
    alterarStatus,
    executarManual,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
