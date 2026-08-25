<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar subcategoria"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarSubcategoria()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a subcategoria
      {{ subcategoriaSelecionada?.nome }}?
    </span>
  </ModalDeletar>

  <ModalSubcategoria />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Subcategorias</h1>

        <p class="text-sm text-black/50">
          Organize suas categorias em subcategorias
        </p>
      </div>

      <Button
        class="!w-[14rem] sm:!w-full"
        @click="manipularModalSubcategoria('criar')"
      >
        + Nova subcategoria
      </Button>
    </div>

    <Subcategorias />
  </div>
</template>

<script setup lang="ts">
import Subcategorias from "@/components/financas/subcategorias/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiSubcategorias } from "@/components/financas/subcategorias/useApiSubcategorias";
import { useSubcategorias } from "@/components/financas/subcategorias/useSubcategorias";
import { useApiCategorias } from "@/components/financas/categoriasFinanceiras/useApiCategorias";
import ModalSubcategoria from "@/components/financas/subcategorias/novaSubcategoria/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarSubcategoria, chamarApi } = useApiSubcategorias();
const { manipularModalSubcategoria, abrirModalDeletar, subcategoriaSelecionada } =
  useSubcategorias();
const { chamarApi: chamarCategorias } = useApiCategorias();

onMounted(async () => {
  await Promise.all([chamarApi(), chamarCategorias()]);
});
</script>
