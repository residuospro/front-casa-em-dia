<template>
  <ce-data-table
    :items="dataCentrosCusto.data"
    :headers="headers"
    truncated
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
    hide-id
  >
    <template #cor="{ item }">
      <div
        class="p-1 rounded-full text-xs font-medium w-5 h-5"
        :style="{
          color: item.cor ?? '#000000',
          background: item.cor ?? '#000000',
        }"
      />
    </template>

    <template #ativo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getAtivoStyle(item.ativo).cor,
          background: getAtivoStyle(item.ativo).background,
        }"
      >
        {{ getAtivoStyle(item.ativo).label }}
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
            v-model="dataCentrosCusto.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataCentrosCusto.paginacao.total"
          :items-per-page="dataCentrosCusto.paginacao.por_pagina"
          :current-page="dataCentrosCusto.paginacao.pagina"
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
import { useCentroCustos } from "./useCentroCustos";
import { useApiCentroCustos } from "./useApiCentroCustos";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const {
  headers,
  options,
  dataCentrosCusto,
  opcoesMenu,
  executarOpcoesMenu,
  getAtivoStyle,
} = useCentroCustos();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiCentroCustos();
</script>
