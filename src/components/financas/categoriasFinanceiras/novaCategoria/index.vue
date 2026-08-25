<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalCategoria()"
    :is-open="abriModalCategoria"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} categoria
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Input
        required
        label="Nome"
        placeholder="Ex: Alimentação"
        v-model="formCategoria.nome"
      />

      <Select
        label="Tipo"
        placeholder="Selecione"
        required
        :items="opcoesTipoCategoria"
        v-model="formCategoria.tipo"
      />

      <div class="flex flex-row sm:flex-col gap-2 items-stretch w-full">
        <div class="w-full">
          <Input
            label="Cor"
            placeholder="#1B7A43"
            v-model="formCategoria.cor"
            type="color"
          />
          <span
            v-if="formCategoria.cor"
            class="text-xs text-gray-400 mt-1 block"
          >
            {{ formCategoria.cor }}
          </span>
        </div>
      </div>

      <div v-if="acao === 'editar'" class="flex items-center gap-2">
        <Toggle v-model="formCategoria.ativo" label="Ativa" />
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
        @click="manipularModalCategoria"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="acao === 'criar' ? criarCategoria() : atualizarCategoria()"
        >{{
          acao === "criar" ? "Criar categoria" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { useCategorias } from "../useCategorias";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Toggle from "@/components/toggle/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovaCategoria } from "./useNovaCategoria";
import { useApiNovaCategoria } from "./useApiNovaCategoria";

const { acao, abriModalCategoria, manipularModalCategoria } = useCategorias();
const { criarCategoria, atualizarCategoria } = useApiNovaCategoria();
const { opcoesTipoCategoria, formCategoria } = useNovaCategoria();
</script>
