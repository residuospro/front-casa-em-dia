<template>
  <div>
    <ce-data-table
      :items="dataTarefas.data"
      :headers="headers"
      truncated
      compact
      search
      order-by-server
      @order-by="obterDadosPorOrdenacao"
    >
      <template #title>
        <span class="text-lg font-medium">Tarefas</span>
      </template>

      <template #titulo="{ item }">
        <div class="flex flex-row items-center gap-2">
          <div
            class="rounded-full p-2"
            :style="{
              background: getCategoriaStyle(item.categoria).background,
            }"
          >
            <svg-icon
              type="mdi"
              :path="setarIconePorCategoria(item.categoria)"
              :style="{ color: getCategoriaStyle(item.categoria).cor }"
            />
          </div>

          <div class="flex flex-col justify-center gap-1">
            <span class="font-medium">{{ item.titulo }}</span>
            <span class="text-slate-400 text-sm">{{ item.descricao }}</span>
          </div>
        </div>
      </template>

      <template #categoria="{ item }">
        <span
          class="px-3 py-1 rounded-full text-xs font-medium w-min"
          :style="{
            color: getCategoriaStyle(item.categoria).cor,
            background: getCategoriaStyle(item.categoria).background,
          }"
        >
          {{ item.categoria }}
        </span>
      </template>

      <template #tipo="{ item }">
        <div class="flex flex-col justify-center gap-1">
          <span
            class="px-3 py-1 rounded-full text-xs font-medium w-min"
            :style="{
              color: getTagTarefaStyle(item.tipo).tipo?.cor,
              background: getTagTarefaStyle(item.tipo).tipo?.background,
            }"
          >
            {{ item.tipo }}
          </span>

          <span
            v-if="item.modoDistribuicao"
            class="px-3 py-1 rounded-full text-xs font-medium w-min"
            :style="{
              color: getTagTarefaStyle(item.tipo, item.modoDistribuicao).modo
                ?.cor,

              background: getTagTarefaStyle(item.tipo, item.modoDistribuicao)
                .modo?.background,
            }"
          >
            {{ item.modoDistribuicao }}
          </span>
        </div>
      </template>

      <template #responsavelAtual="{ item }">
        <div class="flex flex-row items-center gap-1">
          <img
            v-if="item.responsavelAtual.fotoPerfil"
            :src="parseFotoPerfil(item.responsavelAtual.fotoPerfil)"
            class="object-cover w-8 h-8 rounded-full"
          />

          <ce-truncated
            :maxLength="12"
            reserveSpaceFeedback
            :text="item.responsavelAtual.nome"
          />
        </div>
      </template>

      <template #pontos="{ item }">
        <span class="font-bold">{{ item.pontos }}pts</span>
      </template>

      <template #ativo="{ item }">
        <div class="rounded-lg p-2 bg-[#E7F2E5] w-min text-sm font-medium">
          <span :class="item.ativo ? 'text-[#4C6749]' : 'text-red-500'">
            {{ item.ativo ? "Ativa" : "Inativa" }}
          </span>
        </div>
      </template>

      <template #agendamentos="{ item }">
        <div
          v-if="obterProximoAgendamento(item.agendamentos)"
          class="flex flex-col gap-1"
        >
          <div
            class="flex items-center gap-2 border w-fit rounded-lg p-2 border-green-700 text-green-700"
            :class="{
              ' border-red-500  text-red-600 ':
                formatarAgendamento(
                  obterProximoAgendamento(item.agendamentos),
                ).split(' ')[0] === 'Hoje',
              ' !border-[#F5A623]  !text-[#F5A623] ':
                formatarAgendamento(
                  obterProximoAgendamento(item.agendamentos),
                ).split(' ')[0] === 'Amanhã',
            }"
          >
            <span class="text-sm font-medium">
              {{
                formatarAgendamento(obterProximoAgendamento(item.agendamentos))
              }}
            </span>
          </div>

          <span
            v-if="item.agendamentos.length > 1"
            class="text-xs text-black/50"
          >
            +{{ item.agendamentos.length - 1 }} agendamento(s) restante(s)
          </span>
        </div>

        <span v-else class="text-sm text-black/50"> Sem agendamento </span>
      </template>

      <template #acoes="{ item }">
        <div class="flex flex-row items-center gap-2">
          <button>
            <svg-icon
              type="mdi"
              :path="mdiEyeOutline"
              class="text-gray-400 cursor-pointer"
            />
          </button>

          <ce-context-menu :items="opcoesMenu">
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
        <div class="flex flex-row items-center justify-end gap-2 w-full">
          <ce-items-per-page
            label="Itens por página"
            v-model="dataTarefas.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />

          <ce-pagination
            :total-pages="dataTarefas.paginacao.total"
            :items-per-page="dataTarefas.paginacao.por_pagina"
            :current-page="dataTarefas.paginacao.pagina"
            @update:model-value="obterDadosPorPagina"
          />
        </div>
      </template>
    </ce-data-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useApiTarefas } from "./useApiTarefas";
import { useTarefas } from "./useTarefas";
import {
  CeDataTable,
  CeTruncated,
  CeContextMenu,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEyeOutline, mdiDotsVertical } from "@mdi/js";
import { useUtils } from "@/utils/useUtils";

const { parseFotoPerfil } = useUtils();

const {
  chamarApi,
  obterDadosPorItensPorPagina,
  obterDadosPorOrdenacao,
  obterDadosPorPagina,
} = useApiTarefas();
const {
  dataTarefas,
  headers,
  opcoesMenu,
  options,
  getCategoriaStyle,
  getTagTarefaStyle,
  setarIconePorCategoria,
  obterProximoAgendamento,
  formatarAgendamento,
} = useTarefas();

onMounted(async () => {
  await chamarApi();
});
</script>
