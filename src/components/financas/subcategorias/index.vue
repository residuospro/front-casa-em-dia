<template>
  <ce-data-table
    :items="dataSubcategorias.data"
    :headers="headers"
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
    hide-id
  >
    <template #categoria="{ item }">
      <span class="font-medium">{{ item.categoria?.nome ?? "----" }}</span>
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
            v-model="dataSubcategorias.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataSubcategorias.paginacao.total"
          :items-per-page="dataSubcategorias.paginacao.por_pagina"
          :current-page="dataSubcategorias.paginacao.pagina"
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
import { useSubcategorias } from "./useSubcategorias";
import { useApiSubcategorias } from "./useApiSubcategorias";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const {
  headers,
  options,
  dataSubcategorias,
  opcoesMenu,
  executarOpcoesMenu,
  getAtivoStyle,
} = useSubcategorias();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiSubcategorias();
</script>
