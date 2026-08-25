<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalCartao()"
    :is-open="abriModalCartao"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Novo" : "Editar" }} cartão
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Input
        required
        label="Nome"
        placeholder="Ex: Cartão Nubank"
        v-model="formCartao.nome"
      />

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Conta"
          placeholder="Selecione"
          required
          :items="opcoesContas"
          v-model="formCartao.contaId"
          class="!w-full"
        />
        <Select
          label="Tipo"
          placeholder="Selecione"
          :items="opcoesTipoCartao"
          v-model="formCartao.tipo"
          class="!w-full"
        />
      </div>

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Input
          label="Bandeira"
          placeholder="Ex: Mastercard"
          v-model="formCartao.bandeira"
        />
        <Input
          label="Limite"
          placeholder="R$ 0,00"
          v-model="valorFormatado"
        />
      </div>

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Fechamento"
          placeholder="Dia"
          :items="opcoesDias"
          v-model="formCartao.fechamentoDia"
          class="!w-full"
        />
        <Select
          label="Vencimento"
          placeholder="Dia"
          :items="opcoesDias"
          v-model="formCartao.vencimentoDia"
          class="!w-full"
        />
      </div>

      <Select
        label="Melhor dia de compra"
        placeholder="Dia"
        :items="opcoesDias"
        v-model="formCartao.melhorDiaCompra"
      />

      <div v-if="acao === 'editar'" class="flex items-center gap-2">
        <Toggle v-model="formCartao.ativo" label="Ativa" />
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
        @click="manipularModalCartao"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="acao === 'criar' ? criarCartao() : atualizarCartao()"
        >{{
          acao === "criar" ? "Criar novo cartão" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { useCartoes } from "../useCartoes";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Toggle from "@/components/toggle/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovoCartao } from "./useNovoCartao";
import { useApiNovoCartao } from "./useApiNovoCartao";

const { acao, abriModalCartao, manipularModalCartao } = useCartoes();
const { criarCartao, atualizarCartao } = useApiNovoCartao();
const { opcoesContas, opcoesTipoCartao, opcoesDias, formCartao, valorFormatado } =
  useNovoCartao();
</script>
