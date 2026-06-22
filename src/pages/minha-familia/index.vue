<template>
  <div class="flex flex-col gap-4 px-2 w-full h-full">
    <Header />

    <div
      class="grid grid-cols-3 sm:grid-cols-1 sm:grid-rows-3 gap-2 sm:gap-4 md:!grid-cols-1 md:!grid-rows-3 md:!gap-4 flex-1 w-full"
    >
      <MinhaFamilia />

      <Lista v-if="dataFamilia.length > 0" />

      <div
        class="flex flex-col justify-center gap-3"
        v-if="dataFamilia.length > 0"
      >
        <Tabs v-model="abaAtiva" :tabs="tabs" />

        <CadastrarDependente v-if="abaAtiva === 'criar-dependente'" />

        <ConvidarMembro v-if="abaAtiva === 'convidar-membro'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/minhaFamilia/header/index.vue";
import Lista from "@/components/minhaFamilia/lista/index.vue";
import CadastrarDependente from "@/components/minhaFamilia/cadastrarDependente/index.vue";
import MinhaFamilia from "@/components/minhaFamilia/index.vue";
import ConvidarMembro from "@/components/minhaFamilia/convidarMembro/index.vue";
import Tabs from "@/components/tab/index.vue";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";

const { abaAtiva, tabs, dataFamilia } = useMinhaFamilia();
</script>
