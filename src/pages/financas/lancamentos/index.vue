<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar lançamento"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarLancamento()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar o lançamento
      {{ lancamentoSelecionado?.titulo }}?
    </span>
  </ModalDeletar>

  <ModalLancamento />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Lançamentos</h1>

        <p class="text-sm text-black/50">
          Gerencie seus lançamentos financeiros
        </p>
      </div>

      <Button
        class="!w-[14rem] sm:!w-full"
        @click="manipularModalLancamento('criar')"
      >
        + Novo lançamento
      </Button>
    </div>

    <Lancamentos />
  </div>
</template>

<script setup lang="ts">
import Lancamentos from "@/components/financas/lancamentos/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiLancamentos } from "@/components/financas/lancamentos/useApiLancamentos";
import { useLancamentos } from "@/components/financas/lancamentos/useLancamentos";
import ModalLancamento from "@/components/financas/lancamentos/novoLancamento/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarLancamento, chamarApi } = useApiLancamentos();
const { manipularModalLancamento, abrirModalDeletar, lancamentoSelecionado } =
  useLancamentos();

onMounted(async () => {
  await chamarApi();
});
</script>
