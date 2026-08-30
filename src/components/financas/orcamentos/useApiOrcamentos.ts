import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useOrcamentos } from "./useOrcamentos";
import type { IResponseOrcamentos, IResumoOrcamentos } from "./tipagem";

export const useApiOrcamentos = () => {
  const { perfil } = storeToRefs(usePerfil());
  const {
    parametros,
    manipularResposta,
    resetarParametros,
    serializarParametros,
    abrirModalDeletar,
    orcamentoDeletando,
    mesSelecionado,
    anoSelecionado,
    resumo,
    opcoesCategorias,
  } = useOrcamentos();

  const carregarCategorias = async () => {
    try {
      const resposta: AxiosResponse<{
        data: { id: string; nome: string; tipo: string }[];
      }> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/categorias`,
        { params: { pagina: 1, por_pagina: 100, incluirArquivadas: false } },
      );

      opcoesCategorias.value = (resposta.data.data ?? [])
        .filter((c) => c.tipo === "DESPESA" || c.tipo === "AMBOS")
        .map((c) => ({ text: c.nome, value: c.id }));
    } catch {
      opcoesCategorias.value = [];
    }
  };

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseOrcamentos> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/orcamentos`,
        { params: serializarParametros() },
      );

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  const carregarResumo = async () => {
    try {
      const resposta: AxiosResponse<IResumoOrcamentos> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/orcamentos/resumo`,
        {
          params: {
            mes: Number(mesSelecionado.value),
            ano: Number(anoSelecionado.value),
          },
        },
      );

      resumo.value = resposta.data;
    } catch {
      // resumo nao carregado
    }
  };

  const buscar = async () => {
    parametros.value.paginacao.pagina = 1;
    await Promise.all([chamarApi(), carregarResumo()]);
  };

  const navegarMes = async (delta: -1 | 1) => {
    const atual = new Date(
      Number(anoSelecionado.value),
      Number(mesSelecionado.value) - 1 + delta,
      1,
    );

    mesSelecionado.value = String(atual.getMonth() + 1);
    anoSelecionado.value = String(atual.getFullYear());

    await buscar();
  };

  const deletarOrcamento = async () => {
    const id = orcamentoDeletando.value?.id;
    if (!id) return;

    const resposta: AxiosResponse = await useClient.delete(
      `/financeiro/${perfil.value.familiaId}/financeiro/orcamentos/${id}`,
    );

    useRespostaApi(resposta.status, null, "Orçamento deletado com sucesso");
    abrirModalDeletar.value = false;
    await buscar();
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
    carregarResumo,
    carregarCategorias,
    buscar,
    navegarMes,
    deletarOrcamento,
    obterDadosPorOrdenacao,
    obterDadosPorItensPorPagina,
    obterDadosPorPagina,
  };
};
