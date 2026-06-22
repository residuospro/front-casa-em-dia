<template>
  <div class="flex flex-col items-start gap-2">
    <h1 class="text-3xl font-semibold">
      Bem vindo, {{ perfil.nome }}! <span>👋</span>
    </h1>
    <span class="text-cinza_363637 text-base font-medium"
      >Que tal organizar sua rotina hoje ?</span
    >
  </div>
</template>

<script setup lang="ts">
import { usePerfil } from "@/composables/usePerfil";

const { perfil } = usePerfil();
</script>
