<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-2/5 sm:w-full"
    close-outside
    @close="fecharModalStatus"
    :is-open="abrirModalStatus"
    show-close-button
    variant="secondary"
  >
    <div class="flex items-center justify-between w-full p-4">
      <h2 class="text-xl font-semibold text-black">Alterar status</h2>
    </div>

    <div
      v-if="lancamentoStatusAlteracao"
      class="flex flex-col gap-4 w-full px-4 pb-4 sm:px-2"
    >
      <div class="flex flex-col gap-2">
        <span class="text-xs text-black/50">Lançamento</span>
        <p class="text-sm font-medium text-black">
          {{ lancamentoStatusAlteracao.titulo }}
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs text-black/50">Status atual</span>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium w-min"
          :style="{
            color: getStatusStyle(lancamentoStatusAlteracao.status).cor,
            background: getStatusStyle(lancamentoStatusAlteracao.status).background,
          }"
        >
          {{ getStatusStyle(lancamentoStatusAlteracao.status).label }}
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <Select
          v-model="novoStatus"
          label="Novo status"
          placeholder="Selecione o novo status"
          :items="opcoesStatus"
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
        @click="fecharModalStatus"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        :disabled="!podeSalvar"
        @click="salvarAlterarStatus"
      >
        Salvar
      </Button>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import Button from "@/components/botao/index.vue";
import Select from "@/components/select/index.vue";
import type { StatusLancamento } from "@/utils/tipagem";
import { useLancamentos } from "../useLancamentos";
import { useApiLancamentos } from "../useApiLancamentos";

const {
  abrirModalStatus,
  lancamentoStatusAlteracao,
  novoStatus,
  fecharModalStatus,
  statusPermitidos,
  getStatusStyle,
} = useLancamentos();
const { salvarAlterarStatus } = useApiLancamentos();

const labelStatus: Record<StatusLancamento, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  RECEBIDO: "Recebido",
  CANCELADO: "Cancelado",
  IGNORADO: "Ignorado",
};

const opcoesStatus = computed(() => {
  if (!lancamentoStatusAlteracao.value) return [];
  const isReceita = lancamentoStatusAlteracao.value.tipo === "RECEITA";
  return statusPermitidos(lancamentoStatusAlteracao.value.status)
    .filter((status) => status !== "RECEBIDO" || isReceita)
    .map((status) => ({
      text: labelStatus[status],
      value: status,
    }));
});

const podeSalvar = computed(() => {
  return (
    !!lancamentoStatusAlteracao.value &&
    !!novoStatus.value &&
    novoStatus.value !== lancamentoStatusAlteracao.value.status
  );
});
</script>
