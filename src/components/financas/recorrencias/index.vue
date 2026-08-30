<template>
  <ce-data-table
    :items="dataRecorrencias.data"
    :headers="headers"
    compact
    search
    hide-id
  >
    <template #titulo="{ item }">
      <div class="flex flex-col">
        <span class="text-sm font-medium">{{ item.titulo }}</span>
        <span v-if="item.lancamentoModelo" class="text-xs text-gray-500">
          {{ item.lancamentoModelo.titulo }}
        </span>
      </div>
    </template>

    <template #frequencia="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getFrequenciaStyle(item.frequencia).cor,
          background: getFrequenciaStyle(item.frequencia).background,
        }"
      >
        {{ getFrequenciaStyle(item.frequencia).label }}
      </span>
    </template>

    <template #intervalo="{ item }">
      <span class="text-sm">{{ item.intervalo }}</span>
    </template>

    <template #proximaExecucao="{ item }">
      <span class="text-sm whitespace-nowrap">
        {{ formatarData(item.proximaExecucao) }}
      </span>
    </template>

    <template #ocorrencias="{ item }">
      <span class="text-sm">{{ item._count?.lancamentos ?? 0 }}</span>
    </template>

    <template #ativa="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusRecorrenciaStyle(item.ativa).cor,
          background: getStatusRecorrenciaStyle(item.ativa).background,
        }"
      >
        {{ getStatusRecorrenciaStyle(item.ativa).label }}
      </span>
    </template>

    <template #acoes="{ item }">
      <div class="flex flex-row items-center gap-2">
        <ce-context-menu
          :items="opcoesMenu"
          @select="executarOpcoesMenu($event, item)"
        >
          <button>
            <svg-icon
              type="mdi"
              :path="mdiDotsVertical"
              class="text-gray-400 cursor-pointer"
            />
          </button>
        </ce-context-menu>
      </div>
    </template>

    <template #pagination>
      <div class="flex flex-row items-center justify-end gap-2 w-full sm:p-2">
        <div class="sm:hidden">
          <ce-items-per-page
            label="Itens por página"
            v-model="dataRecorrencias.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataRecorrencias.paginacao.total"
          :items-per-page="dataRecorrencias.paginacao.por_pagina"
          :current-page="dataRecorrencias.paginacao.pagina"
          @update:model-value="obterDadosPorPagina"
        />
      </div>
    </template>
  </ce-data-table>
</template>

<script setup lang="ts">
import {
  CeDataTable,
  CeContextMenu,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
import { useRecorrencias } from "./useRecorrencias";
import { useApiRecorrencias } from "./useApiRecorrencias";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const {
  headers,
  options,
  dataRecorrencias,
  opcoesMenu,
  executarOpcoesMenu,
  getFrequenciaStyle,
  getStatusRecorrenciaStyle,
} = useRecorrencias();
const { obterDadosPorItensPorPagina, obterDadosPorPagina } =
  useApiRecorrencias();

const formatarData = (data: Date) => {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>
