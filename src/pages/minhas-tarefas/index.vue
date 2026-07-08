<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar tarefa"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deleteTarefa()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a tarefa {{ tarefaSelecionada?.titulo }}?
    </span>
  </ModalDeletar>

  <FiltroTarefa />

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Tarefas</h1>

        <p class="text-sm text-black/50">
          Organize e distribua tarefas para sua família.
        </p>
      </div>

      <Button
        @click="router.push('/minhas-tarefas/nova-tarefa')"
        class="!w-[8rem] sm:!w-full"
      >
        + Nova tarefa
      </Button>
    </div>

    <Resumo />

    <Tarefas v-if="modoExibicao === 'tabela'" />
    <Calendario v-if="modoExibicao === 'calendario'" />

    <div class="w-full flex flex-row justify-center gap-3 sm:flex-wrap">
      <div
        v-for="(item, index) in opcoesStatusTarefa"
        :key="index"
        class="flex flex-row items-center gap-3"
      >
        <div class="p-2 rounded-xl h-10" :style="{ background: item.bg }">
          <div
            class="h-full w-3 rounded-xl"
            :style="{ background: item.cor }"
          />
        </div>
        <span class="font-medium">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tarefas from "@/components/minhasTarefas/index.vue";
import Calendario from "@/components/minhasTarefas/calendario/index.vue";
import { useTarefas } from "@/components/minhasTarefas/useTarefas";
import { onMounted } from "vue";
import ModalDeletar from "@/components/modal/index.vue";
import FiltroTarefa from "@/components/minhasTarefas/filtroTarefa/index.vue";
import Resumo from "@/components/minhasTarefas/resumo/index.vue";
import { useApiTarefas } from "@/components/minhasTarefas/useApiTarefas";
import { useRouter } from "vue-router";
import Button from "@/components/botao/index.vue";

const {
  modoExibicao,
  abrirModalDeletar,
  tarefaSelecionada,
  opcoesStatusTarefa,
  carregarModoExibicao,
} = useTarefas();
const { deleteTarefa } = useApiTarefas();
const router = useRouter();

onMounted(() => {
  carregarModoExibicao();
});
</script>
