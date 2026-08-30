<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/3 sm:w-full"
    close-outside
    @close="fecharModal"
    :is-open="abrirModalExecutar"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">Executar recorrência</h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <p class="text-sm text-gray-700">
        Deseja gerar manualmente a próxima ocorrência da recorrência
        <span class="font-medium">
          {{ recorrenciaExecutar?.titulo ?? "" }}
        </span>
        ?
      </p>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div
      class="flex items-center gap-2 p-2 sm:flex-col w-full sm:items-stretch justify-end"
    >
      <Button
        variant="outline"
        type="button"
        class="sm:!w-full"
        @click="fecharModal"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="executarManual"
      >
        Executar
      </Button>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import Button from "@/components/botao/index.vue";
import { useRecorrencias } from "../useRecorrencias";
import { useApiRecorrencias } from "../useApiRecorrencias";

const { abrirModalExecutar, recorrenciaExecutar } = useRecorrencias();
const { executarManual } = useApiRecorrencias();

const fecharModal = () => {
  abrirModalExecutar.value = false;
};
</script>
