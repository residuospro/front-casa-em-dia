<template>
  <ce-data-table
    :items="dataCartoes.data"
    :headers="headers"
    truncated
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
    hide-id
  >
    <template #conta="{ item }">
      <span class="font-medium">{{ getNomeConta(item.contaId) }}</span>
    </template>

    <template #tipo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getTipoCartaoStyle(item.tipo).cor,
          background: getTipoCartaoStyle(item.tipo).background,
        }"
      >
        {{ getTipoCartaoStyle(item.tipo).label }}
      </span>
    </template>

    <template #limite="{ item }">
      <span>{{
        formatarReal(Number(item.limite), getMoedaDaConta(item.contaId))
      }}</span>
    </template>

    <template #fechamentoDia="{ item }">
      <span>{{ item.fechamentoDia ?? "----" }}</span>
    </template>

    <template #vencimentoDia="{ item }">
      <span>{{ item.vencimentoDia ?? "----" }}</span>
    </template>

    <template #melhorDiaCompra="{ item }">
      <span>{{ item.melhorDiaCompra ?? "----" }}</span>
    </template>

    <template #ativo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusCartaoStyle(item.ativo).cor,
          background: getStatusCartaoStyle(item.ativo).background,
        }"
      >
        {{ getStatusCartaoStyle(item.ativo).label }}
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
            v-model="dataCartoes.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataCartoes.paginacao.total"
          :items-per-page="dataCartoes.paginacao.por_pagina"
          :current-page="dataCartoes.paginacao.pagina"
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
import { useCartoes } from "./useCartoes";
import { useApiCartoes } from "./useApiCartoes";
import { useUtils } from "@/utils/useUtils";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical } from "@mdi/js";

const { formatarReal } = useUtils();
const {
  headers,
  options,
  dataCartoes,
  opcoesMenu,
  executarOpcoesMenu,
  getTipoCartaoStyle,
  getStatusCartaoStyle,
  getNomeConta,
  getMoedaDaConta,
} = useCartoes();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiCartoes();
</script>
