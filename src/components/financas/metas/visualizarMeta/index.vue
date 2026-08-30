<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-2/4 sm:w-full"
    close-outside
    @close="fechar"
    :is-open="abrirModalVisualizar"
    show-close-button
    variant="secondary"
  >
    <div class="flex items-center justify-between w-full p-4">
      <h2 class="text-xl font-semibold text-black">Detalhes da meta</h2>
    </div>

    <div v-if="dataMeta" class="flex flex-col gap-4 w-full px-4 pb-4">
      <div class="flex items-center gap-3">
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{
            color: getTipoMetaStyle(dataMeta.tipo).cor,
            background: getTipoMetaStyle(dataMeta.tipo).background,
          }"
        >
          {{ getTipoMetaStyle(dataMeta.tipo).label }}
        </span>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{
            color: getStatusMetaStyle(dataMeta.status).cor,
            background: getStatusMetaStyle(dataMeta.status).background,
          }"
        >
          {{ getStatusMetaStyle(dataMeta.status).label }}
        </span>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-black">{{ dataMeta.titulo }}</h3>
        <p v-if="dataMeta.descricao" class="text-sm text-black/60 mt-1">
          {{ dataMeta.descricao }}
        </p>
      </div>

      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <span class="text-sm text-black/50">Progresso</span>
          <span class="text-sm font-medium">
            {{ dataMeta.percentualConcluido }}%
          </span>
        </div>
        <div class="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
          <div
            class="h-full rounded-full"
            :style="{
              width: `${dataMeta.percentualConcluido}%`,
              background: dataMeta.percentualConcluido >= 100 ? '#166534' : '#53864C',
            }"
          />
        </div>
        <p class="text-xs text-black/50 mt-1">
          {{ formatarReal(Number(dataMeta.valorAtual)) }} de
          {{ formatarReal(Number(dataMeta.valorObjetivo)) }} acumulados
        </p>
      </div>

      <hr class="w-full h-px bg-gray-200" />

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
        <div>
          <span class="text-xs text-black/50">Valor objetivo</span>
          <p class="text-sm font-medium text-black">
            {{ formatarReal(Number(dataMeta.valorObjetivo)) }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Valor atual</span>
          <p class="text-sm font-medium text-black">
            {{ formatarReal(Number(dataMeta.valorAtual)) }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Falta para concluir</span>
          <p class="text-sm font-medium text-black">
            {{ formatarReal(Number(dataMeta.valorRestante)) }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Data limite</span>
          <p class="text-sm font-medium text-black">
            {{ dataMeta.dataLimite ? formatarDataCompleta(dataMeta.dataLimite) : "----" }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Conta destino</span>
          <p class="text-sm font-medium text-black">
            {{ dataMeta.contaDestino?.nome ?? "----" }}
          </p>
        </div>
      </div>

      <hr class="w-full h-px bg-gray-200" />

      <div>
        <h4 class="text-sm font-semibold text-black mb-2">
          Histórico de entradas e saídas
        </h4>

        <div v-if="carregando" class="text-sm text-gray-500">Carregando...</div>

        <div
          v-else-if="!dataHistoricos.data.length"
          class="text-sm text-gray-500"
        >
          Nenhuma movimentação registrada ainda.
        </div>

        <div v-else class="flex flex-col divide-y divide-gray-100 w-full">
          <div
            v-for="historico in dataHistoricos.data"
            :key="historico.id"
            class="flex items-center justify-between py-2 gap-2"
          >
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-medium"
                  :style="{
                    color: getMovimentacaoStyle(historico.tipo).cor,
                    background: getMovimentacaoStyle(historico.tipo).background,
                  }"
                >
                  {{ getMovimentacaoStyle(historico.tipo).label }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ historico.usuario?.nome ?? "----" }} ·
                  {{ formatarDataCompleta(historico.criadoEm) }}
                </span>
              </div>
              <span class="text-xs text-gray-500 mt-1">
                Saldo: {{ formatarReal(Number(historico.saldoAnterior)) }} →
                {{ formatarReal(Number(historico.saldoNovo)) }}
              </span>
              <span
                v-if="historico.observacao"
                class="text-xs text-gray-500 mt-1"
              >
                {{ historico.observacao }}
              </span>
            </div>

            <span
              class="text-sm font-medium whitespace-nowrap"
              :class="historico.tipo === 'SAIDA' ? 'text-red-600' : 'text-green-600'"
            >
              {{ historico.tipo === "SAIDA" ? "-" : "+"
              }}{{ formatarReal(Number(historico.valor)) }}
            </span>
          </div>
        </div>

        <div
          v-if="dataHistoricos.data.length"
          class="flex flex-row items-center justify-end gap-2 w-full pt-3"
        >
          <div class="sm:hidden">
            <ce-items-per-page
              label="Itens por página"
              v-model="dataHistoricos.paginacao.por_pagina"
              :options="options"
              @update:model-value="obterDadosPorItensPorPagina"
            />
          </div>

          <ce-pagination
            :total-pages="dataHistoricos.paginacao.total"
            :items-per-page="dataHistoricos.paginacao.por_pagina"
            :current-page="dataHistoricos.paginacao.pagina"
            @update:model-value="obterDadosPorPagina"
          />
        </div>
      </div>

      <hr class="w-full h-px bg-gray-200" />

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
        <span class="text-xs text-black/40">
          Criado em: {{ formatarDataCompleta(dataMeta.criadoEm) }}
        </span>
        <span class="text-xs text-black/40">
          Atualizado em: {{ formatarDataCompleta(dataMeta.atualizadoEm) }}
        </span>
      </div>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { CeModal, CePagination, CeItemsPerPage } from "@comercti/vue-components-hmg";
import { useMetas } from "../useMetas";
import { useApiVisualizarMeta } from "./useApiVisualizarMeta";
import { useUtils } from "@/utils/useUtils";

const { formatarReal } = useUtils();
const { abrirModalVisualizar, getTipoMetaStyle, getStatusMetaStyle, getMovimentacaoStyle } =
  useMetas();
const {
  dataMeta,
  dataHistoricos,
  carregando,
  chamarApi,
  obterDadosPorPagina,
  obterDadosPorItensPorPagina,
} = useApiVisualizarMeta();

const options = [5, 10, 25, 50, 100];

const fechar = () => {
  abrirModalVisualizar.value = false;
};

watch(abrirModalVisualizar, (aberto) => {
  if (!aberto) return;
  chamarApi();
});

const formatarDataCompleta = (data: Date) => {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>