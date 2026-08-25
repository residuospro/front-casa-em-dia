<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar centro de custo"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarCentroCusto()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar o centro de custo
      {{ centroCustoSelecionado?.nome }}?
    </span>
  </ModalDeletar>

  <ModalCentroCusto />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Centros de Custo</h1>

        <p class="text-sm text-black/50">
          Gerencie seus centros de custo para organizar as finanças
        </p>
      </div>

      <Button
        class="!w-[14rem] sm:!w-full"
        @click="manipularModalCentroCusto('criar')"
      >
        + Novo centro de custo
      </Button>
    </div>

    <CentrosCusto />
  </div>
</template>

<script setup lang="ts">
import CentrosCusto from "@/components/financas/centrosCusto/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiCentroCustos } from "@/components/financas/centrosCusto/useApiCentroCustos";
import { useCentroCustos } from "@/components/financas/centrosCusto/useCentroCustos";
import ModalCentroCusto from "@/components/financas/centrosCusto/novoCentroCusto/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarCentroCusto, chamarApi } = useApiCentroCustos();
const { manipularModalCentroCusto, abrirModalDeletar, centroCustoSelecionado } =
  useCentroCustos();

onMounted(async () => {
  await chamarApi();
});
</script>
