<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-2/4 sm:w-full"
    close-outside
    @close="fecharModal"
    :is-open="abrirModalOcorrencias"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        Ocorrências de {{ recorrenciaOcorrencia?.titulo ?? "" }}
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full max-h-[60vh] overflow-y-auto">
      <div v-if="carregando" class="text-sm text-gray-500">Carregando...</div>

      <div
        v-else-if="!dataOcorrencias.data.length"
        class="text-sm text-gray-500"
      >
        Nenhuma ocorrência gerada ainda.
      </div>

      <div
        v-else
        class="flex flex-col divide-y divide-gray-100 w-full"
      >
        <div
          v-for="ocorrencia in dataOcorrencias.data"
          :key="ocorrencia.id"
          class="flex items-center justify-between py-2"
        >
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ ocorrencia.titulo }}</span>
            <span class="text-xs text-gray-500">
              {{ formatarData(ocorrencia.dataHora) }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="text-sm font-medium"
              :class="getStatusOcorrencia(ocorrencia.status) === 'Pago' ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatarReal(Number(ocorrencia.valor), ocorrencia.moeda) }}
            </span>

            <span
              class="px-3 py-1 rounded-full text-xs font-medium w-min"
              :style="{
                color: getStatusStyle(ocorrencia.status).cor,
                background: getStatusStyle(ocorrencia.status).background,
              }"
            >
              {{ getStatusStyle(ocorrencia.status).label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <div
        v-if="dataOcorrencias.data.length"
        class="flex flex-row items-center justify-end gap-2 w-full sm:p-2"
      >
        <div class="sm:hidden">
          <ce-items-per-page
            label="Itens por página"
            v-model="dataOcorrencias.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataOcorrencias.paginacao.total"
          :items-per-page="dataOcorrencias.paginacao.por_pagina"
          :current-page="dataOcorrencias.paginacao.pagina"
          @update:model-value="obterDadosPorPagina"
        />
      </div>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import {
  CeModal,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
import { watch } from "vue";
import { useRecorrencias } from "../useRecorrencias";
import { useApiOcorrencias } from "./useApiOcorrencias";
import { useUtils } from "@/utils/useUtils";
import type { StatusLancamento } from "@/utils/tipagem";

const { formatarReal } = useUtils();

const { abrirModalOcorrencias, recorrenciaOcorrencia } = useRecorrencias();
const {
  dataOcorrencias,
  carregando,
  chamarApi,
  obterDadosPorPagina,
  obterDadosPorItensPorPagina,
} = useApiOcorrencias();

const options = [5, 10, 25, 50, 100];

const fecharModal = () => {
  abrirModalOcorrencias.value = false;
};

const formatarData = (data: Date) => {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusStyle = (status: StatusLancamento) => {
  const map: Record<
    StatusLancamento,
    { label: string; cor: string; background: string }
  > = {
    PENDENTE: { label: "Pendente", cor: "#92400E", background: "#FEF3C7" },
    PAGO: { label: "Pago", cor: "#166534", background: "#DCFCE7" },
    RECEBIDO: { label: "Recebido", cor: "#0F766E", background: "#CCFBF1" },
    CANCELADO: { label: "Cancelado", cor: "#991B1B", background: "#FEE2E2" },
    IGNORADO: { label: "Ignorado", cor: "#6B7280", background: "#F3F4F6" },
  };
  return map[status] ?? { label: status, cor: "#000", background: "#F3F4F6" };
};

const getStatusOcorrencia = (status: StatusLancamento) => {
  return getStatusStyle(status).label;
};

watch(abrirModalOcorrencias, (aberto) => {
  if (aberto) {
    chamarApi();
  }
});
</script>
