<template>
  <div class="grid grid-cols-4 gap-3 sm:grid-cols-2 xs:grid-cols-1">
    <div
      class="flex items-start gap-2 flex-col rounded-lg shadow-lg border p-4"
      v-for="(item, index) in resumo"
      :key="index"
    >
      <div class="flex items-center gap-2">
        <svg-icon
          type="mdi"
          :path="item.icone"
          :class="
            item.slug === 'tarefas-atrasadas'
              ? 'text-red-500'
              : '!text-[#53864C]'
          "
          size="20"
        />
        <span
          class="font-medium text-sm"
          :class="
            item.slug === 'tarefas-atrasadas'
              ? 'text-red-500'
              : '   !text-[#53864C]'
          "
          >{{ item.label }}</span
        >
      </div>

      <span
        v-if="item.slug !== 'ciclo-ativo'"
        class="text-2xl font-bold"
        :class="
          item.slug === 'tarefas-atrasadas' ? 'text-red-500' : '!text-[#53864C]'
        "
        >{{ item.value }}</span
      >

      <span v-else class="text-2xl font-bold text-[#53864C]"
        >{{ item.value }} <span class="text-sm">dias restantes</span></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { onMounted } from "vue";
import { useResumo } from "./useResumo";

const { obterCiclos, resumo } = useResumo();

onMounted(async () => {
  await obterCiclos();
});
</script>
