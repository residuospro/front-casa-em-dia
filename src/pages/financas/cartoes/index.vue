<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar cartão"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarCartao()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar o cartão {{ cartaoSelecionado?.nome }}?
    </span>
  </ModalDeletar>

  <ModalCartao />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Cartões</h1>

        <p class="text-sm text-black/50">
          Gerencie seus cartões de crédito e débito
        </p>
      </div>

      <Button
        class="!w-[10rem] sm:!w-full"
        @click="manipularModalCartao('criar')"
      >
        + Novo cartão
      </Button>
    </div>

    <Cartoes />
  </div>
</template>

<script setup lang="ts">
import Cartoes from "@/components/financas/cartoes/index.vue";
import Button from "@/components/botao/index.vue";
import { useApiCartoes } from "@/components/financas/cartoes/useApiCartoes";
import { useCartoes } from "@/components/financas/cartoes/useCartoes";
import { useApiContasBancarias } from "@/components/financas/contasBancarias/useApiContasBancarias";
import ModalCartao from "@/components/financas/cartoes/novoCartao/index.vue";
import ModalDeletar from "@/components/modal/index.vue";
import { onMounted } from "vue";

const { deletarCartao, chamarApi } = useApiCartoes();
const { manipularModalCartao, abrirModalDeletar, cartaoSelecionado } =
  useCartoes();
const { chamarApi: chamarContas } = useApiContasBancarias();

onMounted(async () => {
  await Promise.all([chamarApi(), chamarContas()]);
});
</script>
