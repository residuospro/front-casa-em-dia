<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar meta"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarMeta()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a meta {{ metaDeletando?.titulo }}?
    </span>
  </ModalDeletar>

  <ModalNovaMeta />
  <ModalVisualizar />
  <ModalMovimentacao />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Metas financeiras</h1>

        <p class="text-sm text-black/50">
          Defina metas e acompanhe o progresso dos seus objetivos
        </p>
      </div>

      <Button
        class="!w-[9rem] sm:!w-full"
        @click="manipularModalMeta('criar')"
      >
        + Nova meta
      </Button>
    </div>

    <Metas />
  </div>
</template>

<script setup lang="ts">
import Metas from "@/components/financas/metas/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiMetas } from "@/components/financas/metas/useApiMetas";
import { useMetas } from "@/components/financas/metas/useMetas";
import ModalNovaMeta from "@/components/financas/metas/novaMeta/index.vue";
import ModalVisualizar from "@/components/financas/metas/visualizarMeta/index.vue";
import ModalMovimentacao from "@/components/financas/metas/movimentacaoMeta/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted, watch } from "vue";

const { chamarApi, deletarMeta, concluirMeta } = useApiMetas();
const {
  manipularModalMeta,
  abrirModalDeletar,
  metaDeletando,
  metaConcluindo,
} = useMetas();

watch(metaConcluindo, (meta) => {
  if (meta) {
    concluirMeta();
  }
});

onMounted(async () => {
  await chamarApi();
});
</script>