<template>
  <div class="flex items-stretch gap-2 w-full xl:!flex-row flex-col">
    <div
      v-for="kpi in kpis"
      :key="kpi.label"
      class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 w-full"
    >
      <div
        class="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        :style="{ background: kpi.bgCor }"
      >
        <svg-icon
          type="mdi"
          :path="kpi.icone"
          class="w-6 h-6"
          :style="{ color: kpi.cor }"
        />
      </div>
      <div class="min-w-0">
        <p class="text-xs text-[#596273] truncate">{{ kpi.label }}</p>
        <p class="text-xl font-bold" :style="{ color: kpi.cor }">
          {{ formatarValor(kpi.valor, kpi.formato) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTrendingUp, mdiTrendingDown, mdiCash, mdiPercent } from "@mdi/js";
import { computed } from "vue";
import { useUtils } from "@/utils/useUtils";
import type { KpiData } from "./tipagem";

const props = defineProps<{
  dados: KpiData | null;
}>();

const { formatarReal } = useUtils();

const formatarValor = (valor: number, formato: "moeda" | "percentual") => {
  if (formato === "moeda") return formatarReal(valor);
  return `${valor.toFixed(1)}%`;
};

const kpis = computed(() => {
  if (!props.dados) {
    return [
      {
        label: "Receitas",
        valor: 0,
        icone: mdiTrendingUp,
        cor: "#2f8a3b",
        bgCor: "#eaf5eb",
        formato: "moeda" as const,
      },
      {
        label: "Despesas",
        valor: 0,
        icone: mdiTrendingDown,
        cor: "#e52424",
        bgCor: "#fde9e9",
        formato: "moeda" as const,
      },
      {
        label: "Resultado",
        valor: 0,
        icone: mdiCash,
        cor: "#2f8a3b",
        bgCor: "#eaf5eb",
        formato: "moeda" as const,
      },
      {
        label: "Taxa de economia",
        valor: 0,
        icone: mdiPercent,
        cor: "#f59e0b",
        bgCor: "#fff3df",
        formato: "percentual" as const,
      },
    ];
  }

  return [
    {
      label: "Receitas",
      valor: props.dados.receitas,
      icone: mdiTrendingUp,
      cor: "#2f8a3b",
      bgCor: "#eaf5eb",
      formato: "moeda" as const,
    },
    {
      label: "Despesas",
      valor: props.dados.despesas,
      icone: mdiTrendingDown,
      cor: "#e52424",
      bgCor: "#fde9e9",
      formato: "moeda" as const,
    },
    {
      label: "Resultado",
      valor: props.dados.resultado,
      icone: mdiCash,
      cor: props.dados.resultado >= 0 ? "#2f8a3b" : "#e52424",
      bgCor: props.dados.resultado >= 0 ? "#eaf5eb" : "#fde9e9",
      formato: "moeda" as const,
    },
    {
      label: "Taxa de economia",
      valor: props.dados.taxaEconomia,
      icone: mdiPercent,
      cor: "#f59e0b",
      bgCor: "#fff3df",
      formato: "percentual" as const,
    },
  ];
});
</script>
