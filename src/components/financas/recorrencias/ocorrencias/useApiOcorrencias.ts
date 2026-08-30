import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useRecorrencias } from "../useRecorrencias";
import type { IResponseOcorrencias } from "../tipagem";

const dataOcorrencias = ref<IResponseOcorrencias>({
  data: [],
  paginacao: { total: 0, pagina: 1, por_pagina: 10, ultima_pagina: 0 },
  ordenacao: [],
  filtro: {},
});

const carregando = ref(false);

export const useApiOcorrencias = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { recorrenciaOcorrencia } = useRecorrencias();

  const chamarApi = async (pagina = 1, porPagina = 10) => {
    if (!recorrenciaOcorrencia.value) return;

    carregando.value = true;

    try {
      const resposta: AxiosResponse<IResponseOcorrencias> =
        await useClient.get(
          `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias/${recorrenciaOcorrencia.value.id}/ocorrencias`,
          { params: { pagina, por_pagina: porPagina } },
        );

      dataOcorrencias.value = resposta.data;
    } catch {
      dataOcorrencias.value = {
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
    await chamarApi(pagina, dataOcorrencias.value.paginacao.por_pagina);
  };

  const obterDadosPorItensPorPagina = async (itens: number) => {
    await chamarApi(1, itens);
  };

  return {
    dataOcorrencias,
    carregando,
    chamarApi,
    obterDadosPorPagina,
    obterDadosPorItensPorPagina,
  };
};
