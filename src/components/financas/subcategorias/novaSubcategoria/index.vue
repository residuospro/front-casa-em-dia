<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalSubcategoria()"
    :is-open="abriModalSubcategoria"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} subcategoria
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Select
        v-if="acao === 'criar'"
        label="Categoria"
        placeholder="Selecione"
        required
        :items="opcoesCategorias"
        v-model="formSubcategoria.categoriaId"
      />

      <div v-else class="flex flex-col gap-1">
        <label class="block text-sm mb-1 !text-black">Categoria</label>
        <span class="text-sm text-black/60">
          {{ nomeCategoriaAtual }}
        </span>
      </div>

      <Input
        required
        label="Nome"
        placeholder="Ex: Alimentação"
        v-model="formSubcategoria.nome"
      />

      <div v-if="acao === 'editar'" class="flex items-center gap-2">
        <Toggle v-model="formSubcategoria.ativo" label="Ativa" />
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
        @click="manipularModalSubcategoria"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarSubcategoria() : atualizarSubcategoria()
        "
        >{{
          acao === "criar" ? "Criar subcategoria" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useSubcategorias } from "../useSubcategorias";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Toggle from "@/components/toggle/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovaSubcategoria } from "./useNovaSubcategoria";
import { useApiNovaSubcategoria } from "./useApiNovaSubcategoria";
import { useCategorias } from "../../categoriasFinanceiras/useCategorias";

const {
  acao,
  abriModalSubcategoria,
  manipularModalSubcategoria,
  subcategoriaEditando,
} = useSubcategorias();
const { criarSubcategoria, atualizarSubcategoria } = useApiNovaSubcategoria();
const { formSubcategoria, opcoesCategorias } = useNovaSubcategoria();
const { dataCategorias } = useCategorias();

const nomeCategoriaAtual = computed(() => {
  if (!subcategoriaEditando.value) return "";
  const cat = dataCategorias.value.data.find(
    (c) => c.id === subcategoriaEditando.value?.categoriaId,
  );
  return cat?.nome ?? "----";
});
</script>
