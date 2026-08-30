<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-1/3 sm:w-full"
    close-outside
    @close="fechar"
    :is-open="abrirModalMovimentacao"
    show-close-button
    variant="secondary"
  >
    <div class="p-4">
      <h1 class="text-lg font-medium">
        Movimentar {{ metaMovimentando?.titulo ?? "" }}
      </h1>
    </div>

    <hr class="w-full h-0.5 bg-gray-100" />

    <div class="flex flex-col gap-2 p-4 w-full">
      <Select
        label="Tipo de movimentação"
        placeholder="Selecione"
        required
        :items="opcoesMovimentacao"
        v-model="formMovimentacao.tipo"
      />

      <Input
        label="Valor"
        placeholder="R$ 0,00"
        v-model="valorFormatado"
      />

      <Textarea
        id="observacao"
        label="Observação"
        placeholder="Comentário sobre a movimentação (opcional)"
        v-model="formMovimentacao.observacao"
      />

      <p class="text-xs text-gray-500">
        Entradas e saídas ajustam o valor acumulado da meta e, quando há conta
        vinculada, o saldo dela também é atualizado.
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
        @click="fechar"
      >
        Cancelar
      </Button>

      <Button
        variant="primary"
        type="button"
        class="sm:!w-full"
        @click="registrarMovimentacao"
      >
        Registrar
      </Button>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal } from "@comercti/vue-components-hmg";
import { watch } from "vue";
import { useMetas } from "../useMetas";
import { useMovimentacaoMeta } from "./useMovimentacaoMeta";
import { useApiMovimentacaoMeta } from "./useApiMovimentacaoMeta";
import Select from "@/components/select/index.vue";
import Input from "@/components/input/index.vue";
import Textarea from "@/components/textarea/index.vue";
import Button from "@/components/botao/index.vue";

const { abrirModalMovimentacao, metaMovimentando } = useMetas();
const { registrarMovimentacao } = useApiMovimentacaoMeta();
const { opcoesMovimentacao, formMovimentacao, valorFormatado, resetar } =
  useMovimentacaoMeta();

const fechar = () => {
  abrirModalMovimentacao.value = false;
};

watch(abrirModalMovimentacao, (aberto) => {
  if (!aberto) return;
  resetar();
});
</script>