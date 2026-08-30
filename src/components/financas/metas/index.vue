<template>
  <ce-data-table
    :items="dataMetas.data"
    :headers="headers"
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
    hide-id
  >
    <template #tipo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getTipoMetaStyle(item.tipo).cor,
          background: getTipoMetaStyle(item.tipo).background,
        }"
      >
        {{ getTipoMetaStyle(item.tipo).label }}
      </span>
    </template>

    <template #valorObjetivo="{ item }">
      <span>{{ formatarReal(Number(item.valorObjetivo)) }}</span>
    </template>

    <template #valorAtual="{ item }">
      <div class="flex flex-col gap-1 min-w-[8rem]">
        <span class="text-sm">
          {{ formatarReal(Number(item.valorAtual)) }} /
          {{ formatarReal(Number(item.valorObjetivo)) }}
        </span>
        <div class="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{
              width: `${item.percentualConcluido}%`,
              background: getProgressoCor(item.percentualConcluido),
            }"
          />
        </div>
        <span class="text-xs text-gray-500">
          {{ item.percentualConcluido }}%
        </span>
      </div>
    </template>

    <template #status="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusMetaStyle(item.status).cor,
          background: getStatusMetaStyle(item.status).background,
        }"
      >
        {{ getStatusMetaStyle(item.status).label }}
      </span>
    </template>

    <template #dataLimite="{ item }">
      <span class="text-sm whitespace-nowrap">
        {{ item.dataLimite ? formatarData(item.dataLimite) : "----" }}
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
            v-model="dataMetas.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataMetas.paginacao.total"
          :items-per-page="dataMetas.paginacao.por_pagina"
          :current-page="dataMetas.paginacao.pagina"
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
import { useMetas } from "./useMetas";
import { useApiMetas } from "./useApiMetas";
import { useUtils } from "@/utils/useUtils";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const { formatarReal } = useUtils();
const {
  headers,
  options,
  dataMetas,
  opcoesMenu,
  executarOpcoesMenu,
  getTipoMetaStyle,
  getStatusMetaStyle,
} = useMetas();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiMetas();

const getProgressoCor = (percentual: number) => {
  if (percentual >= 100) return "#166534";
  if (percentual >= 50) return "#53864C";
  return "#F59E0B";
};

const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString("pt-BR");
};
</script>
