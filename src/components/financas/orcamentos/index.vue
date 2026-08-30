<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Filtros -->
    <div
      class="w-full flex justify-between flex-wrap items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
    >
      <div class="flex items-end gap-2 sm:flex-col sm:w-full">
        <Select
          label="Mês"
          placeholder="Selecione"
          :items="opcoesMeses"
          v-model="mesSelecionado"
          class="w-40 sm:w-full"
          @update:model-value="buscar"
        />

        <Select
          label="Ano"
          placeholder="Selecione"
          :items="opcoesAnos"
          v-model="anoSelecionado"
          class="w-28 sm:w-full"
          @update:model-value="buscar"
        />
      </div>

      <div class="flex items-end gap-2 sm:flex-col sm:w-full">
        <Select
          label="Categoria"
          placeholder="Selecione"
          :items="opcoesCategoriasFiltro"
          v-model="categoriaSelecionada"
          class="w-52 sm:w-full"
          @update:model-value="buscar"
        />

        <Select
          label="Status"
          placeholder="Todos os status"
          :items="opcoesStatus"
          v-model="statusSelecionado"
          class="w-48 sm:w-full"
          @update:model-value="buscar"
        />

        <button
          type="button"
          class="w-auto sm:w-full flex items-center gap-2 px-4 h-11 rounded-lg border border-gray-200 text-sm text-[#263247] hover:bg-gray-50"
          @click="buscar"
        >
          ⟳ Atualizar
        </button>
      </div>
    </div>

    <!-- Cards de resumo -->
    <div
      class="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:grid-cols-1 sm:grid-rows-5"
    >
      <div
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div
          class="h-11 w-11 rounded-lg flex items-center justify-center bg-[#edf8ef]"
        >
          <svg-icon type="mdi" :path="mdiPurseOutline" class="text-[#438b4d]" />
        </div>
        <div>
          <p class="text-xs text-[#596273]">Total de orçamentos</p>
          <p class="text-2xl font-bold text-[#17243a]">
            {{ resumo.quantidadeOrcamentos }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div
          class="h-11 w-11 rounded-lg flex items-center justify-center bg-[#edf8ef]"
        >
          <svg-icon
            type="mdi"
            :path="mdiCheckCircleOutline"
            class="text-[#438b4d]"
          />
        </div>
        <div>
          <p class="text-xs text-[#596273]">Dentro do limite</p>
          <p class="text-2xl font-bold text-[#438b4d]">
            {{ resumo.porIndicador.NORMAL }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div
          class="h-11 w-11 rounded-lg flex items-center justify-center bg-[#fff7e8]"
        >
          <svg-icon
            type="mdi"
            :path="mdiAlertCircleOutline"
            class="text-[#f59e0b]"
          />
        </div>
        <div>
          <p class="text-xs text-[#596273]">Próximos do limite</p>
          <p class="text-2xl font-bold text-[#f59e0b]">
            {{ resumo.porIndicador.PROXIMO }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div
          class="h-11 w-11 rounded-lg flex items-center justify-center bg-[#fff0f0]"
        >
          <svg-icon
            type="mdi"
            :path="mdiAlertOctagonOutline"
            class="text-[#e53935]"
          />
        </div>
        <div>
          <p class="text-xs text-[#596273]">Ultrapassados</p>
          <p class="text-2xl font-bold text-[#e53935]">
            {{ resumo.porIndicador.ULTRAPASSADO }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
      >
        <div>
          <p class="text-xs text-[#596273]">Utilizado (geral)</p>
          <p class="text-2xl font-bold" :style="{ color: corProgressoGlobal }">
            {{ resumo.percentualGlobal }}%
          </p>
          <p class="text-xs text-[#667085]">
            {{ formatarReal(resumo.totalConsumido) }} de
            {{ formatarReal(resumo.totalOrcado) }}
          </p>
        </div>

        <svg viewBox="0 0 36 36" class="h-16 w-16 ml-auto -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#e6e8ea"
            stroke-width="4"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            :stroke="corProgressoGlobal"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="`${circunferenciaAnel} ${circunferenciaAnel}`"
            :stroke-dashoffset="offsetAnel"
          />
        </svg>
      </div>
    </div>

    <!-- Tabela de orçamentos -->
    <div
      class="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
    >
      <h2 class="text-lg font-bold text-[#17243a] mb-4">
        Orçamentos por categoria
      </h2>

      <ce-data-table
        :items="dataOrcamentos.data"
        :headers="headers"
        compact
        order-by-server
        @order-by="obterDadosPorOrdenacao"
        hide-id
      >
        <template #categoria="{ item }">
          <div class="flex items-center gap-3 min-w-[10rem]">
            <span
              class="h-9 w-9 rounded-full flex items-center justify-center text-sm text-white font-bold shrink-0"
              :style="{ background: item.categoria?.cor || '#9ba0a5' }"
            >
              {{ (item.categoria?.nome || "?").charAt(0) }}
            </span>
            <div class="flex flex-col">
              <span class="font-medium text-[#17243a]">
                {{ item.categoria?.nome }}
              </span>
              <span v-if="item.conta" class="text-xs text-gray-400">
                {{ item.conta.nome }}
              </span>
            </div>
          </div>
        </template>

        <template #valorLimite="{ item }">
          <span class="text-sm whitespace-nowrap">
            {{ formatarReal(Number(item.valorLimite)) }}
          </span>
        </template>

        <template #valorAtual="{ item }">
          <span
            class="text-sm whitespace-nowrap"
            :style="{ color: getIndicadorStyle(item.indicador).cor }"
          >
            {{ formatarReal(Number(item.valorAtual)) }}
          </span>
        </template>

        <template #valorRestante="{ item }">
          <span
            class="text-sm whitespace-nowrap"
            :class="Number(item.valorRestante) < 0 ? 'text-[#e53935]' : ''"
          >
            {{ formatarReal(Number(item.valorRestante)) }}
          </span>
        </template>

        <template #percentualUtilizado="{ item }">
          <div class="flex items-center gap-3 min-w-[9rem]">
            <div
              class="w-[6.5rem] h-1.5 rounded-full bg-gray-200 overflow-hidden"
            >
              <div
                class="h-full rounded-full"
                :style="{
                  width: `${Math.min(Number(item.percentualUtilizado), 100)}%`,
                  background: getIndicadorStyle(item.indicador).cor,
                }"
              />
            </div>
            <span class="text-sm">{{ item.percentualUtilizado }}%</span>
          </div>
        </template>

        <template #indicador="{ item }">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium w-min whitespace-nowrap"
            :style="{
              color: getIndicadorStyle(item.indicador).cor,
              background: getIndicadorStyle(item.indicador).background,
              border: `1px solid ${getIndicadorStyle(item.indicador).border}`,
            }"
          >
            {{ getIndicadorStyle(item.indicador).label }}
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
          <div
            class="flex flex-row items-center justify-end gap-2 w-full sm:p-2"
          >
            <div class="sm:hidden">
              <ce-items-per-page
                label="Itens por página"
                v-model="dataOrcamentos.paginacao.por_pagina"
                :options="options"
                @update:model-value="obterDadosPorItensPorPagina"
              />
            </div>

            <ce-pagination
              :total-pages="dataOrcamentos.paginacao.total"
              :items-per-page="dataOrcamentos.paginacao.por_pagina"
              :current-page="dataOrcamentos.paginacao.pagina"
              @update:model-value="obterDadosPorPagina"
            />
          </div>
        </template>
      </ce-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CeDataTable,
  CeContextMenu,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiDotsVertical,
  mdiPurseOutline,
  mdiCheckCircleOutline,
  mdiAlertCircleOutline,
  mdiAlertOctagonOutline,
} from "@mdi/js";
import { useOrcamentos } from "./useOrcamentos";
import { useApiOrcamentos } from "./useApiOrcamentos";
import { useUtils } from "@/utils/useUtils";
import Select from "@/components/select/index.vue";

const { formatarReal } = useUtils();

const {
  headers,
  options,
  dataOrcamentos,
  resumo,
  opcoesMenu,
  opcoesStatus,
  opcoesMeses,
  opcoesAnos,
  opcoesCategoriasFiltro,
  mesSelecionado,
  anoSelecionado,
  statusSelecionado,
  categoriaSelecionada,
  executarOpcoesMenu,
  getIndicadorStyle,
} = useOrcamentos();

const {
  buscar,
  obterDadosPorOrdenacao,
  obterDadosPorItensPorPagina,
  obterDadosPorPagina,
} = useApiOrcamentos();

const CORES_PROGRESSO = {
  NORMAL: "#438b4d",
  PROXIMO: "#f59e0b",
  ULTRAPASSADO: "#e53935",
};

const getProgressoGlobal = () => {
  const percentual = resumo.value.percentualGlobal;

  if (percentual >= 100) return CORES_PROGRESSO.ULTRAPASSADO;
  if (percentual >= 80) return CORES_PROGRESSO.PROXIMO;
  return CORES_PROGRESSO.NORMAL;
};

const corProgressoGlobal = computed(() => getProgressoGlobal());

const CIRCUNFERENCIA = 2 * Math.PI * 15.9155;
const circunferenciaAnel = CIRCUNFERENCIA;
const offsetAnel = computed(
  () =>
    CIRCUNFERENCIA *
    (1 - Math.min(Number(resumo.value.percentualGlobal), 100) / 100),
);
</script>
