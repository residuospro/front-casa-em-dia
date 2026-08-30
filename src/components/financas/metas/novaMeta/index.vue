<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/3 sm:w-full"
    close-outside
    @close="() => manipularModalMeta()"
    :is-open="abrirModalMeta"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} meta
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full max-h-[60vh] overflow-y-auto">
      <Input
        required
        label="Título"
        placeholder="Ex: Reserva de emergência"
        v-model="formMeta.titulo"
      />

      <Textarea
        id="descricao"
        label="Descrição"
        placeholder="Detalhe o objetivo da meta (opcional)"
        v-model="formMeta.descricao"
      />

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Tipo"
          placeholder="Selecione"
          required
          :items="opcoesTipoMeta"
          v-model="formMeta.tipo"
          class="!w-full flex-1"
        />

        <Input
          label="Valor objetivo"
          placeholder="R$ 0,00"
          v-model="valorFormatado"
          class="!w-full"
        />
      </div>

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <div class="w-full">
          <label class="block text-sm mb-1 text-black">Data limite</label>
          <input
            type="date"
            v-model="formMeta.dataLimite"
            class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C]"
          />
        </div>

        <Select
          label="Conta destino"
          placeholder="Selecione (opcional)"
          :items="opcoesContas"
          v-model="formMeta.contaDestinoId"
          class="!w-full flex-1"
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
        @click="manipularModalMeta"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="acao === 'criar' ? criarMeta() : atualizarMeta()"
        >{{ acao === "criar" ? "Criar meta" : "Salvar alterações" }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useMetas } from "../useMetas";
import { useNovaMeta } from "./useNovaMeta";
import { useApiNovaMeta } from "./useApiNovaMeta";
import Input from "@/components/input/index.vue";
import Textarea from "@/components/textarea/index.vue";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";
import type { OpcaoConta } from "../tipagem";

const { acao, abrirModalMeta, manipularModalMeta } = useMetas();
const { criarMeta, atualizarMeta } = useApiNovaMeta();
const { opcoesTipoMeta, formMeta, valorFormatado } = useNovaMeta();

const { perfil } = storeToRefs(usePerfil());

const opcoesContas = ref<{ text: string; value: string }[]>([]);

const carregarContas = async () => {
  try {
    const resposta = await useClient.get(
      `/financeiro/${perfil.value.familiaId}/financeiro/contas`,
      { params: { pagina: 1, por_pagina: 999, ativo: true } },
    );

    opcoesContas.value = (resposta.data.data ?? []).map((c: OpcaoConta & { ativo?: boolean }) => ({
      text: c.nome,
      value: c.id,
    }));
  } catch {
    opcoesContas.value = [];
  }
};

onMounted(async () => {
  await carregarContas();
});
</script>