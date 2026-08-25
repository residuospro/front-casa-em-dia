<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-2/5 sm:w-full"
    close-outside
    @close="() => manipularModalLancamento()"
    :is-open="abriModalLancamento"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Novo" : "Editar" }} lançamento
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-3 p-4 w-full max-h-[60vh] overflow-y-auto">
      <Select
        label="Tipo"
        required
        :items="opcoesTipo"
        v-model="formLancamento.tipo"
      />

      <Input
        required
        label="Título"
        placeholder="Ex: Supermercado"
        v-model="formLancamento.titulo"
      />

      <Input
        label="Descrição"
        placeholder="Descrição opcional"
        v-model="formLancamento.descricao"
      />

      <div class="flex gap-2 sm:flex-col">
        <Input
          required
          label="Valor"
          type="number"
          placeholder="0,00"
          v-model.number="formLancamento.valor"
          class="flex-1"
        />

        <div class="flex-1">
          <label class="block text-sm mb-1 text-black">Data e hora</label>
          <input
            type="datetime-local"
            v-model="formLancamento.dataHora"
            class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C]"
          />
        </div>
      </div>

      <Select
        label="Conta de origem"
        required
        placeholder="Selecione"
        :items="opcoesContas"
        v-model="formLancamento.contaOrigemId"
      />

      <Select
        v-if="mostraContaDestino()"
        label="Conta de destino"
        required
        placeholder="Selecione"
        :items="opcoesContas"
        v-model="formLancamento.contaDestinoId"
      />

      <Select
        v-if="mostraCategoria()"
        label="Categoria"
        placeholder="Selecione"
        :items="opcoesCategorias"
        v-model="formLancamento.categoriaId"
      />

      <Select
        v-if="mostraCategoria() && formLancamento.categoriaId"
        label="Subcategoria"
        placeholder="Selecione"
        :items="opcoesSubcategorias"
        v-model="formLancamento.subcategoriaId"
      />

      <Select
        v-if="mostraCategoria()"
        label="Centro de custo"
        placeholder="Selecione"
        :items="opcoesCentrosCusto"
        v-model="formLancamento.centroCustoId"
      />

      <Select
        label="Forma de pagamento"
        placeholder="Selecione"
        :items="opcoesFormaPagamento"
        v-model="formLancamento.formaPagamento"
      />

      <Select
        v-if="formLancamento.formaPagamento === 'DEBITO' || formLancamento.formaPagamento === 'CREDITO'"
        label="Cartão"
        placeholder="Selecione"
        :items="opcoesCartoes"
        v-model="formLancamento.cartaoId"
      />

      <Select
        label="Responsável"
        required
        placeholder="Selecione"
        :items="opcoesMembros"
        v-model="formLancamento.responsavelId"
      />

      <Select
        label="Tags"
        placeholder="Selecione"
        :items="opcoesTags"
        v-model="formLancamento.tagsIds"
        :multiple="true"
      />

      <div class="w-full">
        <label class="block text-sm mb-1 text-black">Localização</label>
        <div class="flex gap-2">
          <input
            type="text"
            v-model="formLancamento.localizacao"
            placeholder="Ex: Shopping Center, Rua XYZ"
            class="flex-1 px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C]"
          />
          <Button
            type="button"
            variant="outline"
            class="!w-auto whitespace-nowrap"
            :disabled="buscandoLocalizacao"
            @click="capturarLocalizacao"
          >
            {{ buscandoLocalizacao ? "Buscando..." : "Minha localização" }}
          </Button>
        </div>
      </div>

      <div class="w-full">
        <label class="block text-sm mb-1 text-black">Observações</label>
        <textarea
          v-model="formLancamento.observacoes"
          placeholder="Observações opcionais"
          rows="3"
          class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C] resize-none"
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
        @click="manipularModalLancamento"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarLancamento() : atualizarLancamento()
        "
        >{{
          acao === "criar" ? "Criar lançamento" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useLancamentos } from "../useLancamentos";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovoLancamento } from "./useNovoLancamento";
import { useApiNovoLancamento } from "./useApiNovoLancamento";
import { useApiContasBancarias } from "@/components/financas/contasBancarias/useApiContasBancarias";
import { useApiCategorias } from "@/components/financas/categoriasFinanceiras/useApiCategorias";
import { useApiCentroCustos } from "@/components/financas/centrosCusto/useApiCentroCustos";
import { useApiCartoes } from "@/components/financas/cartoes/useApiCartoes";
import { useApiTags } from "@/components/financas/tags/useApiTags";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";

const {
  acao,
  abriModalLancamento,
  manipularModalLancamento,
} = useLancamentos();
const { criarLancamento, atualizarLancamento } = useApiNovoLancamento();
const {
  formLancamento,
  opcoesContas,
  opcoesCategorias,
  opcoesCentrosCusto,
  opcoesCartoes,
  opcoesTags,
  opcoesFormaPagamento,
  opcoesTipo,
  mostraContaDestino,
  mostraCategoria,
} = useNovoLancamento();

const { chamarApi: carregarContas } = useApiContasBancarias();
const { chamarApi: carregarCategorias } = useApiCategorias();
const { chamarApi: carregarCentrosCusto } = useApiCentroCustos();
const { chamarApi: carregarCartoes } = useApiCartoes();
const { chamarApi: carregarTags } = useApiTags();

const { perfil } = storeToRefs(usePerfil());

const opcoesMembros = ref<{ text: string; value: string }[]>([]);

const carregarMembros = async () => {
  try {
    const resposta = await useClient.get(
      `/families/${perfil.value.familiaId}/membros/opcoes`,
    );
    opcoesMembros.value = resposta.data.map((m: any) => ({
      text: m.text,
      value: m.value,
    }));
  } catch {
    opcoesMembros.value = [];
  }
};

const opcoesSubcategorias = computed(() => {
  const categoriaId = formLancamento.value.categoriaId;
  if (!categoriaId) return [];
  return subcategorias.value
    .filter((s) => s.categoriaId === categoriaId)
    .map((s) => ({ text: s.nome, value: s.id }));
});

const subcategorias = ref<{ id: string; nome: string; categoriaId: string }[]>([]);

const carregarSubcategorias = async () => {
  try {
    const resposta = await useClient.get(
      `/financeiro/${perfil.value.familiaId}/financeiro/subcategorias`,
      { params: { paginacao: { pagina: 1, por_pagina: 999 } } },
    );
    subcategorias.value = resposta.data.data;
  } catch {
    subcategorias.value = [];
  }
};

const buscandoLocalizacao = ref(false);

const capturarLocalizacao = () => {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada pelo navegador.");
    return;
  }

  buscandoLocalizacao.value = true;

  navigator.geolocation.getCurrentPosition(
    async (posicao) => {
      try {
        const { latitude, longitude } = posicao.coords;
        const resposta = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`,
        );
        const dados = await resposta.json();
        formLancamento.value.localizacao =
          dados.display_name ?? `${latitude}, ${longitude}`;
      } catch {
        formLancamento.value.localizacao =
          `${posicao.coords.latitude}, ${posicao.coords.longitude}`;
      } finally {
        buscandoLocalizacao.value = false;
      }
    },
    () => {
      alert("Não foi possível obter a localização. Verifique as permissões do navegador.");
      buscandoLocalizacao.value = false;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
  );
};

onMounted(async () => {
  await Promise.all([
    carregarContas(),
    carregarCategorias(),
    carregarCentrosCusto(),
    carregarCartoes(),
    carregarTags(),
    carregarMembros(),
    carregarSubcategorias(),
  ]);

  if (!formLancamento.value.responsavelId) {
    formLancamento.value.responsavelId = perfil.value.id;
  }
});
</script>
