<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar conta"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarConta()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a conta {{ contaSelecionada?.nome }}?
    </span>
  </ModalDeletar>

  <ModalContaBancaria />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Contas</h1>

        <p class="text-sm text-black/50">
          Gerencie suas contas bancárias e carteiras
        </p>
      </div>

      <Button
        class="!w-[8rem] sm:!w-full"
        @click="manipularModalContaBancaria('criar')"
      >
        + Nova conta
      </Button>
    </div>

    <ContasBancarias />
  </div>
</template>

<script setup lang="ts">
import ContasBancarias from "@/components/financas/contasBancarias/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiContasBancarias } from "@/components/financas/contasBancarias/useApiContasBancarias";
import { useContaBancaria } from "@/components/financas/contasBancarias/useContasBancarias";
import { onMounted } from "vue";
import ModalContaBancaria from "@/components/financas/contasBancarias/novaConta/index.vue";
import ModalDeletar from "@/components/modal/index.vue";

const { chamarApi, deletarConta } = useApiContasBancarias();
const { manipularModalContaBancaria, abrirModalDeletar, contaSelecionada } =
  useContaBancaria();

onMounted(async () => {
  await chamarApi();
});
</script>
