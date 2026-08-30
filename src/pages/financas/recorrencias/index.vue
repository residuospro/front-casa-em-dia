<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar recorrência"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarRecorrencia()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a recorrência
      {{ recorrenciaSelecionada?.titulo }}?
    </span>
  </ModalDeletar>

  <ModalRecorrencia />
  <ModalOcorrencias />
  <ModalExecutar />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Recorrências</h1>

        <p class="text-sm text-black/50">
          Gerencie lançamentos financeiros recorrentes
        </p>
      </div>

      <Button
        class="!w-[12rem] sm:!w-full"
        @click="manipularModalRecorrencia('criar')"
      >
        + Nova recorrência
      </Button>
    </div>

    <Recorrencias />
  </div>
</template>

<script setup lang="ts">
import Recorrencias from "@/components/financas/recorrencias/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiRecorrencias } from "@/components/financas/recorrencias/useApiRecorrencias";
import { useRecorrencias } from "@/components/financas/recorrencias/useRecorrencias";
import ModalRecorrencia from "@/components/financas/recorrencias/novaRecorrencia/index.vue";
import ModalOcorrencias from "@/components/financas/recorrencias/ocorrencias/index.vue";
import ModalExecutar from "@/components/financas/recorrencias/executar/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { chamarApi, deletarRecorrencia } = useApiRecorrencias();
const { manipularModalRecorrencia, abrirModalDeletar, recorrenciaSelecionada } =
  useRecorrencias();

onMounted(async () => {
  await chamarApi();
});
</script>
