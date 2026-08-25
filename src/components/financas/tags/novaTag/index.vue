<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalTag()"
    :is-open="abriModalTag"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Nova" : "Editar" }} tag
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Input
        required
        label="Nome"
        placeholder="Ex: Urgente"
        v-model="formTag.nome"
      />

      <div class="w-full">
        <label class="block text-sm mb-1 text-black">Cor</label>
        <div class="flex items-center gap-2">
          <Input
            type="color"
            v-model="formTag.cor"
            class="flex-1"
          />
          <span class="text-sm text-black/60 uppercase">
            {{ formTag.cor }}
          </span>
        </div>
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
        @click="manipularModalTag"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarTag() : atualizarTag()
        "
        >{{
          acao === "criar" ? "Criar tag" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { useTags } from "../useTags";
import Input from "@/components/input/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovaTag } from "./useNovaTag";
import { useApiNovaTag } from "./useApiNovaTag";

const {
  acao,
  abriModalTag,
  manipularModalTag,
} = useTags();
const { criarTag, atualizarTag } = useApiNovaTag();
const { formTag } = useNovaTag();
</script>
