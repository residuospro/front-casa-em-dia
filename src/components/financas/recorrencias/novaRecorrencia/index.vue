<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/3 sm:w-full"
    close-outside
    @close="() => manipularModalRecorrencia()"
    :is-open="abriModalRecorrencia"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} recorrência
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full max-h-[60vh] overflow-y-auto">
      <div v-if="acao === 'criar'">
        <Select
          label="Lançamento modelo"
          required
          placeholder="Selecione"
          :items="opcoesLancamentos"
          v-model="formRecorrencia.lancamentoModeloId"
        />

        <p class="text-xs text-gray-500 mt-1">
          Selecione um lançamento existente a ser repetido.
        </p>
      </div>

      <div v-else class="flex flex-col gap-1">
        <span class="text-sm font-medium !text-black">Lançamento modelo</span>
        <span class="text-sm text-gray-600">
          {{ recorrenciaEditando?.lancamentoModelo?.titulo ?? "----" }}
        </span>
      </div>

      <Input
        required
        label="Título"
        placeholder="Ex: Aluguel mensal"
        v-model="formRecorrencia.titulo"
      />

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Frequência"
          placeholder="Selecione"
          required
          :items="opcoesFrequencia"
          v-model="formRecorrencia.frequencia"
          class="!w-full flex-1"
        />

        <Input
          label="Intervalo"
          type="number"
          min="1"
          v-model.number="formRecorrencia.intervalo"
          class="!w-full"
        />
      </div>

      <div class="w-full">
        <label class="block text-sm mb-1 text-black">Próxima execução</label>
        <input
          type="datetime-local"
          v-model="formRecorrencia.proximaExecucao"
          class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C]"
        />
      </div>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div
      class="flex items-center gap-2 p-2 sm:flex-col w-full sm:items-stretch justify-end"
    >
      <Button
        variant="outline"
        type="button"
        class="sm:!w-full"
        @click="manipularModalRecorrencia"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarRecorrencia() : atualizarRecorrencia()
        "
        >{{
          acao === "criar" ? "Criar recorrência" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useRecorrencias } from "../useRecorrencias";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovaRecorrencia } from "./useNovaRecorrencia";
import { useApiNovaRecorrencia } from "./useApiNovaRecorrencia";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";

const {
  acao,
  abriModalRecorrencia,
  manipularModalRecorrencia,
  recorrenciaEditando,
} = useRecorrencias();
const { criarRecorrencia, atualizarRecorrencia } = useApiNovaRecorrencia();
const { opcoesFrequencia, formRecorrencia } = useNovaRecorrencia();

const { perfil } = storeToRefs(usePerfil());

const opcoesLancamentos = ref<{ text: string; value: string }[]>([]);

const carregarLancamentos = async () => {
  try {
    const resposta = await useClient.get(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos`,
      { params: { paginacao: { pagina: 1, por_pagina: 999 } } },
    );

    opcoesLancamentos.value = (resposta.data.data ?? []).map((l: any) => ({
      text: `${l.titulo} (${l.valor})`,
      value: l.id,
    }));
  } catch {
    opcoesLancamentos.value = [];
  }
};

onMounted(async () => {
  await carregarLancamentos();
});
</script>
