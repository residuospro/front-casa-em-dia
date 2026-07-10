<template>
  <NovoCiclo />
</template>

<route lang="json">
{
  "name": "novo-ciclo",
  "meta": {
    "title": "Novo Ciclo",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import NovoCiclo from "@/components/ciclos/novoCiclo/index.vue";
</script>
