<template>
  <div class="flex flex-col justify-center gap-4 px-2">
    <Header />

    <div class="flex gap-4 w-full flex-col">
      <Resumo />

      <div class="flex xl:!flex-row gap-2 flex-col">
        <TarefasUrgentes />
        <MembrosFamiliares />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/home/header/index.vue";
import Resumo from "@/components/resumo/index.vue";
import MembrosFamiliares from "@/components/home/membrosFamiliares/index.vue";
import TarefasUrgentes from "@/components/home/tarefasUrgentes/index.vue";
import { useApiListaMembros } from "@/components/minhaFamilia/lista/useApiListaMembros";
import { useApiNotificacao } from "@/components/notificacao/useApiNotificacao";
import { useTarefasUrgentes } from "@/components/home/tarefasUrgentes/useTarefasUrgentes";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useResumo } from "@/components/resumo/useResumo";
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
