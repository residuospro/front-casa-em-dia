<template>
  <NovaTarefa :acao="'editar'" />
</template>

<route lang="json">
{
  "name": "minhas-tarefas.editar-tarefa",
  "meta": {
    "title": "Ciclos",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import NovaTarefa from "@/components/minhasTarefas/novaTarefa/index.vue";
</script>
