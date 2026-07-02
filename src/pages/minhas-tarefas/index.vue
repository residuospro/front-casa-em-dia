<template>
  <Tarefas />
</template>

<route lang="json">
{
  "meta": {
    "title": "Minhas tarefas",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import Tarefas from "@/components/minhasTarefas/tarefas/index.vue";
</script>
