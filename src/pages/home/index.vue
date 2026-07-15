<template>
  <div class="flex flex-col justify-center gap-4 px-2">
    <Header />

    <div class="flex flex-row gap-4 w-full sm:flex-col md:!flex-col">
      <div class="grid grid-rows-[auto_auto] gap-4 w-full">
        <Resumo />

        <TarefasUrgentes />
      </div>

      <div class="grid grid-rows-[1fr_auto] gap-4 w-full">
        <NotificacoesNaoLidas />
        <MembrosFamiliares />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/home/header/index.vue";
import Resumo from "@/components/home/resumo/index.vue";
import NotificacoesNaoLidas from "@/components/home/notificacoesNaoLidas/index.vue";
import MembrosFamiliares from "@/components/home/membrosFamiliares/index.vue";
import TarefasUrgentes from "@/components/home/tarefasUrgentes/index.vue";
import { useApiListaMembros } from "@/components/minhaFamilia/lista/useApiListaMembros";
import { useApiNotificacao } from "@/components/notificacao/useApiNotificacao";
import { useTarefasUrgentes } from "@/components/home/tarefasUrgentes/useTarefasUrgentes";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useResumo } from "@/components/minhasTarefas/resumo/useResumo";
import { onMounted } from "vue";

const { obterResumo } = useResumo();
const { listarMembros } = useApiListaMembros();
const { listar: listarNotificacoes } = useApiNotificacao();
const { obterTarefasurgentes } = useTarefasUrgentes();
const { obterOpcoesFamiliares } = useApiMinhaFamilia();

onMounted(async () => {
  await Promise.all([
    listarMembros(),
    listarNotificacoes(),
    obterTarefasurgentes(),
    obterOpcoesFamiliares(),
    obterResumo(),
  ]);
});
</script>
