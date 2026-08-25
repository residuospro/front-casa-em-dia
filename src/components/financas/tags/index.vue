<template>
  <ce-data-table
    :items="dataTags.data"
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
            v-model="dataTags.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataTags.paginacao.total"
          :items-per-page="dataTags.paginacao.por_pagina"
          :current-page="dataTags.paginacao.pagina"
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
import { useTags } from "./useTags";
import { useApiTags } from "./useApiTags";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const {
  headers,
  options,
  dataTags,
  opcoesMenu,
  executarOpcoesMenu,
} = useTags();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiTags();
</script>
