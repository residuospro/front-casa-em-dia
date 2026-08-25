<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/4 sm:w-full"
    close-outside
    @close="() => manipularModalCentroCusto()"
    :is-open="abriModalCentroCusto"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        {{ acao === "criar" ? "Novo" : "Editar" }} centro de custo
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Input
        required
        label="Nome"
        placeholder="Ex: Moradia"
        v-model="formCentroCusto.nome"
      />

      <div class="w-full">
        <label class="block text-sm mb-1 text-black">Cor</label>
        <div class="flex items-center gap-2">
          <Input
            type="color"
            v-model="formCentroCusto.cor"
            class="flex-1"
          />
          <span class="text-sm text-black/60 uppercase">
            {{ formCentroCusto.cor }}
          </span>
        </div>
      </div>

      <div v-if="acao === 'editar'" class="flex items-center gap-2">
        <Toggle v-model="formCentroCusto.ativo" label="Ativo" />
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
        @click="manipularModalCentroCusto"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="
          acao === 'criar' ? criarCentroCusto() : atualizarCentroCusto()
        "
        >{{
          acao === "criar" ? "Criar centro de custo" : "Salvar alterações"
        }}</Button
      >
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { useCentroCustos } from "../useCentroCustos";
import Input from "@/components/input/index.vue";
import Toggle from "@/components/toggle/index.vue";
import Button from "@/components/botao/index.vue";
import { useNovoCentroCusto } from "./useNovoCentroCusto";
import { useApiNovoCentroCusto } from "./useApiNovoCentroCusto";

const {
  acao,
  abriModalCentroCusto,
  manipularModalCentroCusto,
} = useCentroCustos();
const { criarCentroCusto, atualizarCentroCusto } = useApiNovoCentroCusto();
const { formCentroCusto } = useNovoCentroCusto();
</script>
