<template>
  <VisualizarLancamento />
  <AlterarStatus />
  <FiltroLancamento />

  <ce-data-table
    :items="dataLancamentos.data"
    :headers="headers"
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
    hide-id
  >
    <template #groupButton>
      <button
        type="button"
        @click="abrirModalFiltro = true"
        class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
      >
        <svg-icon type="mdi" :path="mdiFilterVariant" />
        Filtrar
      </button>
    </template>

    <template #dataHora="{ item }">
      <span class="text-sm whitespace-nowrap">
        {{ formatarData(item.dataHora) }}
      </span>
    </template>

    <template #tipo="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getTipoStyle(item.tipo).cor,
          background: getTipoStyle(item.tipo).background,
        }"
      >
        {{ getTipoStyle(item.tipo).label }}
      </span>
    </template>

    <template #valor="{ item }">
      <span
        class="font-medium"
        :class="
          item.tipo === 'DESPESA'
            ? 'text-red-600'
            : item.tipo === 'RECEITA'
              ? 'text-green-600'
              : ''
        "
      >
        {{ item.tipo === "DESPESA" ? "-" : ""
        }}{{ formatarReal(Number(item.valor), item.moeda) }}
      </span>
    </template>

    <template #contaOrigem="{ item }">
      <span class="text-sm">{{ item.contaOrigem?.nome ?? "----" }}</span>
    </template>

    <template #status="{ item }">
      <span
        class="px-3 py-1 rounded-full text-xs font-medium w-min"
        :style="{
          color: getStatusStyle(item.status).cor,
          background: getStatusStyle(item.status).background,
        }"
      >
        {{ getStatusStyle(item.status).label }}
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
            v-model="dataLancamentos.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataLancamentos.paginacao.total"
          :items-per-page="dataLancamentos.paginacao.por_pagina"
          :current-page="dataLancamentos.paginacao.pagina"
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
import { useLancamentos } from "./useLancamentos";
import { useApiLancamentos } from "./useApiLancamentos";
import VisualizarLancamento from "./visualizarLancamento/index.vue";
import AlterarStatus from "./alterarStatus/index.vue";
import FiltroLancamento from "./filtroLancamento/index.vue";
import { useUtils } from "@/utils/useUtils";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDotsVertical, mdiFilterVariant } from "@mdi/js";

const {
  headers,
  options,
  dataLancamentos,
  opcoesMenu,
  abrirModalFiltro,
  executarOpcoesMenu,
  getTipoStyle,
  getStatusStyle,
} = useLancamentos();
const {
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiLancamentos();
const { formatarReal } = useUtils();

const formatarData = (data: Date) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>
