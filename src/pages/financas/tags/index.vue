<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar tag"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarTag()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a tag
      {{ tagSelecionada?.nome }}?
    </span>
  </ModalDeletar>

  <ModalTag />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Tags</h1>

        <p class="text-sm text-black/50">
          Organize seus lançamentos com tags
        </p>
      </div>

      <Button
        class="!w-[10rem] sm:!w-full"
        @click="manipularModalTag('criar')"
      >
        + Nova tag
      </Button>
    </div>

    <Tags />
  </div>
</template>

<script setup lang="ts">
import Tags from "@/components/financas/tags/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiTags } from "@/components/financas/tags/useApiTags";
import { useTags } from "@/components/financas/tags/useTags";
import ModalTag from "@/components/financas/tags/novaTag/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarTag, chamarApi } = useApiTags();
const { manipularModalTag, abrirModalDeletar, tagSelecionada } =
  useTags();

onMounted(async () => {
  await chamarApi();
});
</script>
