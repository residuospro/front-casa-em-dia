import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useMetas } from "../useMetas";
import type { IHistoricoMetaFinanceira, IResponseHistoricos, IMetaFinanceira } from "../tipagem";

const dataMeta = ref<IMetaFinanceira | null>(null);
const dataHistoricos = ref<IResponseHistoricos>({
  data: [],
  paginacao: { total: 0, pagina: 1, por_pagina: 10, ultima_pagina: 0 },
  ordenacao: [],
  filtro: {},
});
const carregando = ref(false);

export const useApiVisualizarMeta = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { metaVisualizando } = useMetas();

  const chamarApi = async (pagina = 1, porPagina = 10) => {
    const metaId = metaVisualizando.value?.id;
    if (!metaId) return;

    carregando.value = true;

    try {
      const [metaResposta, historicoResposta] = await Promise.all([
        useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/metas/${metaId}`,
        ) as Promise<AxiosResponse<IMetaFinanceira>>,
        useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/metas/${metaId}/historicos`,
          { params: { pagina, por_pagina: porPagina } },
        ) as Promise<AxiosResponse<IResponseHistoricos>>,
      ]);

      dataMeta.value = metaResposta.data;
      dataHistoricos.value = {
        ...historicoResposta.data,
        data: historicoResposta.data.data.map((h) => ({
          ...h,
          valor: Number(h.valor),
          saldoAnterior: Number(h.saldoAnterior),
          saldoNovo: Number(h.saldoNovo),
        })) as IHistoricoMetaFinanceira[],
      };
    } catch {
      dataMeta.value = null;
      dataHistoricos.value = {
        data: [],
        paginacao: { total: 0, pagina: 1, por_pagina: 10, ultima_pagina: 0 },
        ordenacao: [],
        filtro: {},
      };
    } finally {
      carregando.value = false;
    }
  };

  const obterDadosPorPagina = async (pagina: number) => {
    await chamarApi(pagina, dataHistoricos.value.paginacao.por_pagina);
  };

  const obterDadosPorItensPorPagina = async (itens: number) => {
    await chamarApi(1, itens);
  };

  return {
    dataMeta,
    dataHistoricos,
    carregando,
    chamarApi,
    obterDadosPorPagina,
    obterDadosPorItensPorPagina,
  };
};