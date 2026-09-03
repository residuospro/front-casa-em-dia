<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">
      Evolução financeira
      <span class="text-xs font-normal text-[#667085]">(últimos meses)</span>
    </h2>

    <div
      v-if="!serie.length"
      class="h-[280px] flex items-center justify-center text-sm text-[#667085]"
    >
      Sem dados para o período
    </div>

    <div v-else style="position: relative; height: 280px; width: 100%">
      <canvas ref="canvasRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
import Chart, { type ChartConfiguration } from "chart.js/auto";
import { useUtils } from "@/utils/useUtils";
import { formatarPeriodoLabel } from "./helpers";
import type { EvolucaoMensalItem } from "./tipagem";

const props = defineProps<{
  serie: EvolucaoMensalItem[];
}>();

const { formatarReal } = useUtils();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const desenhar = () => {
  if (!canvasRef.value) return;

  chart?.destroy();

  const labels = props.serie.map((i) =>
    formatarPeriodoLabel(i.periodo, "MES"),
  );

  const config: ChartConfiguration = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Receitas",
          data: props.serie.map((i) => i.receitas),
          backgroundColor: "rgba(47, 138, 59, 0.15)",
          borderColor: "#2f8a3b",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#2f8a3b",
        },
        {
          label: "Despesas",
          data: props.serie.map((i) => i.despesas),
          backgroundColor: "rgba(229, 36, 36, 0.12)",
          borderColor: "#e52424",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 3,
          pointBackgroundColor: "#e52424",
        },
        {
          label: "Saldo",
          data: props.serie.map((i) => i.saldo),
          borderColor: "#253b6e",
          borderWidth: 2.5,
          tension: 0.3,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: "#253b6e",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#9D9797",
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) =>
              `${ctx.dataset.label}: ${formatarReal(Number(ctx.raw ?? 0))}`,
          },
        },
      },
      scales: {
        y: {
          ticks: {
            color: "#9D9797",
            callback: (value) => formatarReal(Number(value)),
          },
          grid: { color: "#eef0f2" },
        },
        x: {
          ticks: { color: "#9D9797" },
          grid: { display: false },
        },
      },
    },
  };

  chart = new Chart(canvasRef.value, config);
};

onMounted(() => nextTick(desenhar));
onBeforeUnmount(() => chart?.destroy());

watch(
  () => props.serie,
  () => nextTick(desenhar),
  { deep: true },
);
</script>

<style scoped>
canvas {
  width: 100% !important;
}
</style>
