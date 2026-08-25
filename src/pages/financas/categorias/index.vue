<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar categoria"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarCategoria()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a categoria
      {{ categoriaSelecionada?.nome }}?
    </span>
  </ModalDeletar>

  <ModalCategoria />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Categorias</h1>

        <p class="text-sm text-black/50">
          Organize suas finanças por categorias
        </p>
      </div>

      <Button
        class="!w-[12rem] sm:!w-full"
        @click="manipularModalCategoria('criar')"
      >
        + Nova categoria
      </Button>
    </div>

    <Categorias />
  </div>
</template>

<script setup lang="ts">
import Categorias from "@/components/financas/categoriasFinanceiras/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiCategorias } from "@/components/financas/categoriasFinanceiras/useApiCategorias";
import { useCategorias } from "@/components/financas/categoriasFinanceiras/useCategorias";
import ModalCategoria from "@/components/financas/categoriasFinanceiras/novaCategoria/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarCategoria, chamarApi } = useApiCategorias();
const { manipularModalCategoria, abrirModalDeletar, categoriaSelecionada } =
  useCategorias();

onMounted(async () => {
  await chamarApi();
});
</script>
