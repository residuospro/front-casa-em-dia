<template>
  <EditarPerfil />
</template>

<route lang="json">
{
  "meta": {
    "title": "Editar Perfil",
    "layout": "Default",
    "auth": true
  }
}
</route>

<script setup lang="ts">
import EditarPerfil from "@/components/perfil/index.vue";
</script>
