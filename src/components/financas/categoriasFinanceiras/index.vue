<template>
  <ce-data-table
    :items="dataCategorias.data"
    :headers="headers"
    truncated
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
          color: getTipoCategoriaStyle(item.tipo).cor,
          background: getTipoCategoriaStyle(item.tipo).background,
        }"
      >
        {{ getTipoCategoriaStyle(item.tipo).label }}
      </span>
    </template>

    <template #cor="{ item }">
      <div
        class="p-1 rounded-full text-xs font-medium w-5 h-5"
        :style="{
          color: item.cor,
          background: item.cor,
        }"
      />
    </template>

    <template #status="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusCategoriaStyle(item.status).cor,
          background: getStatusCategoriaStyle(item.status).background,
        }"
      >
        {{ getStatusCategoriaStyle(item.status).label }}
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
            v-model="dataCategorias.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataCategorias.paginacao.total"
          :items-per-page="dataCategorias.paginacao.por_pagina"
          :current-page="dataCategorias.paginacao.pagina"
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
import { useCategorias } from "./useCategorias";
import { useApiCategorias } from "./useApiCategorias";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const {
  headers,
  options,
  dataCategorias,
  opcoesMenu,
  executarOpcoesMenu,
  getTipoCategoriaStyle,
  getStatusCategoriaStyle,
} = useCategorias();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiCategorias();
</script>
