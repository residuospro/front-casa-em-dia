<template>
  <ce-data-table
    :items="dataContas.data"
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
          color: getTipoContaStyle(item.tipo).cor,
          background: getTipoContaStyle(item.tipo).background,
        }"
      >
        {{ getTipoContaStyle(item.tipo).label }}
      </span>
    </template>

    <template #moeda="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getMoedaStyle(item.moeda).cor,
          background: getMoedaStyle(item.moeda).background,
        }"
      >
        {{ item.moeda }}
      </span>
    </template>

    <template #ativo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusContaStyle(item.ativo).cor,
          background: getStatusContaStyle(item.ativo).background,
        }"
      >
        {{ getStatusContaStyle(item.ativo).label }}
      </span>
    </template>

    <template #saldoInicial="{ item }">
      <span>{{ formatarReal(Number(item.saldoInicial), item.moeda) }}</span>
    </template>

    <template #saldoAtual="{ item }">
      <span>{{ formatarReal(Number(item.saldoAtual), item.moeda) }}</span>
    </template>

    <template #saldoPrevisto="{ item }">
      <span>{{ formatarReal(Number(item.saldoPrevisto), item.moeda) }}</span>
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
            v-model="dataContas.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataContas.paginacao.total"
          :items-per-page="dataContas.paginacao.por_pagina"
          :current-page="dataContas.paginacao.pagina"
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
import { useContaBancaria } from "./useContasBancarias";
import { useApiContasBancarias } from "./useApiContasBancarias";
import { useUtils } from "@/utils/useUtils";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const { formatarReal } = useUtils();
const {
  headers,
  options,
  dataContas,
  getTipoContaStyle,
  getMoedaStyle,
  getStatusContaStyle,
  opcoesMenu,
  executarOpcoesMenu,
} = useContaBancaria();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiContasBancarias();
</script>
