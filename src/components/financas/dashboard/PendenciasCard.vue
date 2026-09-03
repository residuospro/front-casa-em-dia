<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">
      Pendências financeiras
    </h2>

    <div
      v-if="!itens.length"
      class="h-[130px] flex items-center justify-center text-sm text-[#667085]"
    >
      Sem pendências
    </div>

    <template v-else>
      <div class="space-y-3">
        <div
          v-for="item in itens"
          :key="item.label"
          class="flex items-center gap-3"
        >
          <div
            class="h-9 w-9 rounded-lg flex items-center justify-center bg-[#fde9e9] shrink-0"
          >
            <svg-icon
              type="mdi"
              :path="mdiAlertCircleOutline"
              class="w-5 h-5 text-[#e53935]"
            />
          </div>
          <div class="flex-1">
            <p class="text-xs text-[#596273]">{{ item.label }}</p>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs text-[#17243a] font-medium">{{
                item.quantidade
              }}</span>
              <span
                class="text-xs text-[#e53935] font-medium whitespace-nowrap"
              >
                {{ formatarReal(item.valor) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAlertCircleOutline } from "@mdi/js";
import { useUtils } from "@/utils/useUtils";

const props = defineProps<{
  itens: { label: string; quantidade: number; valor: number }[];
}>();

const { formatarReal } = useUtils();
</script>
