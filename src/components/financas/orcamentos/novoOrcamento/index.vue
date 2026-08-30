<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/3 sm:w-full"
    close-outside
    @close="() => manipularModalOrcamento()"
    :is-open="abrirModalOrcamento"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Novo" : "Editar" }} orçamento
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full max-h-[60vh] overflow-y-auto">
      <div v-if="acao === 'editar'">
        <label class="block text-sm mb-1 text-black">Categoria</label>
        <div
          class="w-full px-4 py-2 rounded-lg border bg-gray-50 text-black border-slate-700 flex items-center gap-2"
        >
          <span
            class="h-6 w-6 rounded-full flex items-center justify-center text-xs text-white shrink-0"
            :style="{ background: categoriaCor }"
          >
            {{ categoriaNome.charAt(0) }}
          </span>
          <span class="font-medium">{{ categoriaNome }}</span>
        </div>
      </div>

      <Select
        v-else
        label="Categoria"
        placeholder="Selecione a categoria"
        required
        :items="opcoesCategorias"
        v-model="formOrcamento.categoriaId"
        class="!w-full"
      />

      <Select
        label="Conta"
        placeholder="Selecione a conta"
        required
        :items="opcoesContas"
        v-model="formOrcamento.contaId"
        class="!w-full"
      />

      <div v-if="acao === 'editar'">
        <label class="block text-sm mb-1 text-black">Período</label>
        <div
          class="w-full px-4 py-2 rounded-lg border bg-gray-50 text-black border-slate-700"
        >
          {{ nomeMes }} / {{ formOrcamento.ano }}
        </div>
      </div>

      <div
        v-else
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Mês"
          placeholder="Selecione"
          required
          :items="opcoesMeses"
          v-model="formOrcamento.mes"
          class="!w-full"
        />
        <Select
          label="Ano"
          placeholder="Selecione"
          required
          :items="opcoesAnos"
          v-model="formOrcamento.ano"
          class="!w-full"
        />
      </div>

      <Input
        label="Valor limite"
        placeholder="R$ 0,00"
        v-model="valorFormatado"
      />
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div
      class="flex items-center gap-2 p-2 sm:flex-col w-full sm:items-stretch justify-end"
    >
      <Button
        variant="outline"
        type="button"
        class="sm:!w-full"
        @click="manipularModalOrcamento"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarOrcamento() : atualizarOrcamento()
        "
        >{{
          acao === "criar" ? "Criar orçamento" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useOrcamentos } from "../useOrcamentos";
import { useNovoOrcamento } from "./useNovoOrcamento";
import { useApiNovoOrcamento } from "./useApiNovoOrcamento";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";
import type { ICategoria } from "../../categoriasFinanceiras/tipagem";
import type { IConta } from "../../contasBancarias/tipagem";
import type { IResponseCategorias } from "../../categoriasFinanceiras/tipagem";
import type { IResponseContas } from "../../contasBancarias/tipagem";

const { acao, abrirModalOrcamento, manipularModalOrcamento, mesesNomes, orcamentoEditando } =
  useOrcamentos();
const { criarOrcamento, atualizarOrcamento } = useApiNovoOrcamento();
const { formOrcamento, valorFormatado, categoriaNome, opcoesMeses, opcoesAnos } =
  useNovoOrcamento();

const { perfil } = storeToRefs(usePerfil());

const opcoesCategorias = ref<{ text: string; value: string }[]>([]);
const opcoesContas = ref<{ text: string; value: string }[]>([]);

const nomeMes = computed(
  () => mesesNomes[Number(formOrcamento.value.mes) - 1] ?? "",
);

const categoriaCor = computed(
  () =>
    orcamentoEditando.value?.categoria?.cor ??
    opcoesCategorias.value.find(
      (c) => c.value === formOrcamento.value.categoriaId,
    )?.value ??
    "#53864C",
);

const carregarCategorias = async () => {
  try {
    const resposta: IResponseCategorias = await useClient
      .get(`/financeiro/${perfil.value.familiaId}/financeiro/categorias`, {
        params: { pagina: 1, por_pagina: 100, incluirArquivadas: false },
      })
      .then((r) => r.data);

    opcoesCategorias.value = (resposta.data ?? [])
      .filter(
        (c: ICategoria) =>
          c.tipo === "DESPESA" || c.tipo === "AMBOS",
      )
      .map((c: ICategoria) => ({ text: c.nome, value: c.id }));
  } catch {
    opcoesCategorias.value = [];
  }
};

const carregarContas = async () => {
  try {
    const resposta: IResponseContas = await useClient
      .get(`/financeiro/${perfil.value.familiaId}/financeiro/contas`, {
        params: { pagina: 1, por_pagina: 100, ativo: true },
      })
      .then((r) => r.data);

    opcoesContas.value = (resposta.data ?? []).map((c: IConta) => ({
      text: c.nome,
      value: c.id,
    }));
  } catch {
    opcoesContas.value = [];
  }
};

onMounted(async () => {
  await Promise.all([carregarCategorias(), carregarContas()]);
});
</script>