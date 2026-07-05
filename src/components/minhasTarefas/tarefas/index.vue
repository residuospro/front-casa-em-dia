<template>
  <ce-data-table
    :items="dataTarefas.data"
    :headers="headers"
    truncated
    compact
    search
    order-by-server
    @order-by="obterDadosPorOrdenacao"
  >
    <template #groupButton>
      <div class="flex flex-row gap-2 sm: justify-between sm:w-full">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-lg shadow-lg border">
            <button
              @click="setModoExibicao('calendario')"
              class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
            >
              <svg-icon type="mdi" :path="mdiCalendarMonthOutline" />
            </button>
          </div>
        </div>

        <button
          @click="abrirModalFiltro = true"
          class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
        >
          <svg-icon type="mdi" :path="mdiFilterVariant" />
          Filtrar
        </button>

        <Button
          variant="outline"
          @click="
            async () => {
              resetarParametros();
              await chamarApi();
            }
          "
          v-if="filtrado"
        >
          Limpar filtro
        </Button>
      </div>
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

            background: getTagTarefaStyle(item.tipo, item.modoDistribuicao).modo
              ?.background,
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

        <span
          class="text-sm font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
          :title="item.responsavelAtual.nome"
        >
          {{ item.responsavelAtual.nome }}
        </span>
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

    <template #execucoes="{ item }">
      <div
        v-if="obterProximaExecucao(item.execucoes)"
        class="flex flex-col gap-1"
      >
        <div
          class="flex items-start gap-2"
          :class="
            obterClasseExecucaoFormatada(obterProximaExecucao(item.execucoes))
              .text
          "
        >
          <span
            class="mt-[6px] h-2.5 w-2.5 rounded-full shrink-0"
            :class="
              obterClasseExecucaoFormatada(obterProximaExecucao(item.execucoes))
                .dot
            "
          />

          <div class="flex flex-col">
            <span class="text-sm font-medium leading-5">
              {{
                formatarExecucao(obterProximaExecucao(item.execucoes)).titulo
              }}
            </span>

            <span
              class="text-xs opacity-80"
              v-if="
                formatarExecucao(obterProximaExecucao(item.execucoes))
                  .subtitulo !== 'Agendada'
              "
            >
              {{
                formatarExecucao(obterProximaExecucao(item.execucoes)).subtitulo
              }}
            </span>
          </div>
        </div>

        <span
          v-if="
            item.execucoes.filter((e: Execucao) => e.status === 'AGENDADA')
              .length > 1
          "
          class="text-xs text-black/50 pl-4"
        >
          +{{
            item.execucoes.filter((e: Execucao) => e.status === "AGENDADA")
              .length - 1
          }}
          execuções
        </span>
      </div>

      <span v-else class="text-sm text-black/50">
        Nenhuma execução futura
      </span>
    </template>

    <template #acoes="{ item }">
      <div class="flex flex-row items-center gap-2">
        <button>
          <svg-icon
            type="mdi"
            size="20"
            :path="mdiEyeOutline"
            class="text-gray-400 cursor-pointer"
          />
        </button>

        <ce-context-menu
          :items="opcoesMenu"
          @select="executarOpcoesMenu($event, item.id, item.titulo)"
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
            v-model="dataTarefas.paginacao.por_pagina"
            :options="options"
            @update:model-value="obterDadosPorItensPorPagina"
          />
        </div>

        <ce-pagination
          :total-pages="dataTarefas.paginacao.total"
          :items-per-page="dataTarefas.paginacao.por_pagina"
          :current-page="dataTarefas.paginacao.pagina"
          @update:model-value="obterDadosPorPagina"
        />
      </div>
    </template>
  </ce-data-table>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useApiTarefas } from "./useApiTarefas";
import { useTarefas } from "./useTarefas";
import {
  CeDataTable,
  CeContextMenu,
  CePagination,
  CeItemsPerPage,
} from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiEyeOutline,
  mdiDotsVertical,
  mdiFilterVariant,
  mdiCalendarMonthOutline,
} from "@mdi/js";
import { useUtils } from "@/utils/useUtils";
import type { Execucao } from "./tipagem";
import Button from "@/components/botao/index.vue";

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
  abrirModalFiltro,
  filtrado,
  setModoExibicao,
  resetarParametros,
  executarOpcoesMenu,
  getCategoriaStyle,
  getTagTarefaStyle,
  setarIconePorCategoria,
  obterProximaExecucao,
  formatarExecucao,
  obterClasseExecucao,
} = useTarefas();

const obterClasseExecucaoFormatada = (execucao: Execucao | null) => {
  const classe = obterClasseExecucao(execucao);
  return typeof classe === "string"
    ? { text: "", border: "", dot: "" }
    : classe;
};

onMounted(async () => {
  await chamarApi();
});
</script>
