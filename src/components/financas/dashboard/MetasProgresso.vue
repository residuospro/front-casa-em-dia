<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">Metas financeiras</h2>

    <div v-if="!dados" class="h-[130px] flex items-center justify-center text-sm text-[#667085]">
      Sem dados
    </div>

    <template v-else>
      <div class="flex items-center gap-6 mb-4">
        <div class="relative shrink-0">
          <svg viewBox="0 0 36 36" class="w-[70px] h-[70px] -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#e6e8ea" stroke-width="5" />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#2f8a3b"
              stroke-width="5"
              stroke-linecap="round"
              :stroke-dasharray="`${circunferencia * percentual / 100} ${circunferencia}`"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-bold text-[#2f8a3b]">
              {{ Math.round(percentual) }}%
            </span>
          </div>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#2f8a3b]" />
            <span class="text-[#596273]">Em andamento</span>
            <span class="text-[#17243a] font-medium ml-auto">{{ dados.resumo.emAndamento }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#31aa8d]" />
            <span class="text-[#596273]">Concluídas</span>
            <span class="text-[#17243a] font-medium ml-auto">{{ dados.resumo.concluidas }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#aaa]" />
            <span class="text-[#596273]">Canceladas</span>
            <span class="text-[#17243a] font-medium ml-auto">{{ dados.resumo.canceladas }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { MetasProgressoResponse } from "./tipagem";

const props = defineProps<{
  dados: MetasProgressoResponse | null;
}>();

const CIRCUNFERENCIA = 2 * Math.PI * 14;
const circunferencia = CIRCUNFERENCIA;

const percentual = computed(() => props.dados?.resumo.percentualGlobal ?? 0);
</script>
