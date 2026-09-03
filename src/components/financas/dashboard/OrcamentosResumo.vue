<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">
      Orçamentos
      <span class="text-xs font-normal text-[#667085]">- {{ mesAtual }}</span>
    </h2>

    <div
      v-if="!dados"
      class="h-[130px] flex items-center justify-center text-sm text-[#667085]"
    >
      Sem dados
    </div>

    <template v-else>
      <div class="flex items-center gap-6 mb-4">
        <div class="relative shrink-0">
          <svg viewBox="0 0 36 36" class="w-[70px] h-[70px] -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#e6e8ea"
              stroke-width="5"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              :stroke="corPercentual"
              stroke-width="5"
              stroke-linecap="round"
              :stroke-dasharray="`${(circunferencia * percentual) / 100} ${circunferencia}`"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-bold" :style="{ color: corPercentual }">
              {{ Math.round(percentual) }}%
            </span>
          </div>
        </div>

        <div class="space-y-1.5 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#438b4d]" />
            <span class="text-[#596273]">Dentro do limite</span>
            <span class="text-[#17243a] font-medium ml-auto">{{
              dados.porIndicador.NORMAL
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span class="text-[#596273]">Próximos do limite</span>
            <span class="text-[#17243a] font-medium ml-auto">{{
              dados.porIndicador.PROXIMO
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#e53935]" />
            <span class="text-[#596273]">Ultrapassados</span>
            <span class="text-[#17243a] font-medium ml-auto">{{
              dados.porIndicador.ULTRAPASSADO
            }}</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-[#667085]">
        {{ formatarReal(dados.totalConsumido) }} de
        {{ formatarReal(dados.totalOrcado) }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUtils } from "@/utils/useUtils";
import type { OrcamentoResumoResponse } from "./tipagem";

const props = defineProps<{
  dados: OrcamentoResumoResponse | null;
}>();

const { formatarReal } = useUtils();

const CIRCUNFERENCIA = 2 * Math.PI * 14;
const circunferencia = CIRCUNFERENCIA;

const percentual = computed(() => props.dados?.percentualGlobal ?? 0);

const corPercentual = computed(() => {
  const p = percentual.value;
  if (p >= 100) return "#e53935";
  if (p >= 80) return "#f59e0b";
  return "#438b4d";
});

const mesAtual = computed(() => {
  const d = new Date();
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${meses[d.getMonth()]}/${d.getFullYear()}`;
});
</script>
