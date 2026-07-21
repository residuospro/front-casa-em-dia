<template>
  <div
    class="flex xl:!flex-row gap-2 items-center w-full justify-around flex-col"
  >
    <div
      v-for="(item, index) in resumo"
      :key="index"
      class="bg-white rounded-xl shadow border py-2 px-3 flex flex-row w-full justify-between"
    >
      <div class="flex items-center gap-1">
        <svg-icon
          type="mdi"
          :path="item.icone"
          :class="
            item.slug === 'tarefas-atrasadas'
              ? 'text-red-500'
              : 'text-[#16742F]'
          "
          size="24"
        />
        <span
          class="font-medium"
          :class="
            item.slug === 'tarefas-atrasadas'
              ? 'text-red-500'
              : 'text-[#16742F]'
          "
          >{{ item.label }}</span
        >

        <span
          v-if="item.restantesCount && item.restantesCount > 0"
          class="px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium"
        >
          +{{ item.restantesCount }}
        </span>
      </div>

      <div class="flex flex-row">
        <span
          class="text-lg font-bold"
          :class="
            item.slug === 'tarefas-atrasadas'
              ? 'text-red-500'
              : 'text-[#16742F]'
          "
        >
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { onMounted } from "vue";
import { useResumo } from "./useResumo";

const { obterResumo, resumo } = useResumo();

onMounted(async () => {
  await obterResumo();
});
</script>
