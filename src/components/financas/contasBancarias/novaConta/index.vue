<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalContaBancaria()"
    :is-open="abriModalContaBancaria"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} conta bancária
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Input
        required
        label="Nome"
        placeholder="Ex: Conta corrente"
        v-model="formConta.nome"
      />

      <Input
        label="Instituição"
        placeholder="Ex: Itaú"
        v-model="formConta.instituicao"
      />

      <div
        class="flex flex-row sm:flex-col gap-2 items-center sm:items-stretch w-full"
      >
        <Select
          label="Tipo"
          placeholder="Selecione"
          required
          :items="opcoesTipoConta"
          v-model="formConta.tipo"
          class="!w-full"
        />
        <Select
          label="Moeda"
          placeholder="Selecione"
          required
          :items="opcoesMoedas"
          v-model="formConta.moeda"
          class="!w-full"
        />
      </div>

      <Input
        label="Saldo inicial"
        placeholder="R$ 0,00"
        v-model="valorFormatado"
      />

      <div v-if="acao === 'editar'" class="flex items-center gap-2">
        <Toggle v-model="formConta.ativo" label="Ativa" />
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
        @click="manipularModalContaBancaria"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarContaBancaria() : atualizarContaBancaria()
        "
        >{{
          acao === "criar" ? "Criar nova conta" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { useContaBancaria } from "../useContasBancarias";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useNovaConta } from "./useNovaConta";
import Button from "@/components/botao/index.vue";
import Toggle from "@/components/toggle/index.vue";
import { useApiNovaConta } from "./useApiNovaConta";

const { acao, abriModalContaBancaria, manipularModalContaBancaria } =
  useContaBancaria();
const { criarContaBancaria, atualizarContaBancaria } = useApiNovaConta();
const { opcoesMoedas, opcoesTipoConta, formConta, valorFormatado } =
  useNovaConta();
</script>
