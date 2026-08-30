<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar orçamento"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarOrcamento()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar o orçamento de
      {{ orcamentoDeletando?.nome }}?
    </span>
  </ModalDeletar>

  <ModalNovoOrcamento />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#17243a]">Orçamentos</h1>

        <p class="text-sm text-black/50">
          Acompanhe seus orçamentos e controle seus gastos por categoria.
        </p>
      </div>

      <Button
        class="!w-[11rem] sm:!w-full"
        @click="manipularModalOrcamento('criar')"
      >
        + Novo orçamento
      </Button>
    </div>

    <Orcamentos />
  </div>
</template>

<script setup lang="ts">
import Orcamentos from "@/components/financas/orcamentos/index.vue";
import Button from "@/components/botao/index.vue";
import ModalNovoOrcamento from "@/components/financas/orcamentos/novoOrcamento/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { useApiOrcamentos } from "@/components/financas/orcamentos/useApiOrcamentos";
import { useOrcamentos } from "@/components/financas/orcamentos/useOrcamentos";
import { onMounted } from "vue";

const { chamarApi, carregarResumo, carregarCategorias, deletarOrcamento } =
  useApiOrcamentos();
const { manipularModalOrcamento, abrirModalDeletar, orcamentoDeletando } =
  useOrcamentos();

onMounted(async () => {
  await carregarCategorias();
  await Promise.all([chamarApi(), carregarResumo()]);
});
</script>