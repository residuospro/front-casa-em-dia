<template>
  <div class="flex flex-col justify-center gap-4 px-2">
    <Header />

    <div class="grid xl:!grid-cols-2 gap-5 grid-cols-1">
      <div class="grid grid-rows-[auto_auto] gap-4">
        <Resumo />

        <TarefasUrgentes />
      </div>

      <div class="grid grid-rows-[1fr_auto] gap-4">
        <Calendario />
        <MembrosFamiliares />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/home/header/index.vue";
import Resumo from "@/components/home/resumo/index.vue";
import Calendario from "@/components/home/calendario/index.vue";
import MembrosFamiliares from "@/components/home/membrosFamiliares/index.vue";
import TarefasUrgentes from "@/components/home/tarefasUrgentes/index.vue";
</script>
