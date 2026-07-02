<template>
  <div class="mb-4">
    <p class="text-sm text-black/50">
      {{ label }}
    </p>

    <p class="text-sm font-medium mt-1">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>
