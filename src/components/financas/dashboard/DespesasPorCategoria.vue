<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">
      Gastos por categoria
    </h2>

    <div
      v-if="!itens.length"
      class="h-[280px] flex items-center justify-center text-sm text-[#667085]"
    >
      Sem dados para o período
    </div>

    <div v-else class="flex items-start gap-6">
      <div style="position: relative; width: 180px; height: 180px">
        <canvas ref="canvasRef" />
      </div>

      <div class="flex-1 min-w-0 space-y-2">
        <div
          v-for="(item, idx) in itens.slice(0, 7)"
          :key="item.categoria?.id ?? 'sem-' + idx"
          class="flex items-center justify-between text-xs"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ background: cores[idx] }"
            />
            <span class="text-[#17243a] truncate">
              {{ item.categoria?.nome ?? "Sem categoria" }}
            </span>
          </div>
          <div class="flex items-center gap-3 shrink-0 ml-2">
            <span class="text-[#17243a] whitespace-nowrap">{{
              formatarReal(item.valor)
            }}</span>
            <span class="text-[#667085] w-10 text-right whitespace-nowrap">
              {{ item.percentual.toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  nextTick,
  computed,
} from "vue";
import Chart, { type ChartConfiguration } from "chart.js/auto";
import { useUtils } from "@/utils/useUtils";
import { getCoresDespesasPorCategoria } from "./helpers";
import type { DespesaPorCategoriaItem } from "./tipagem";

Chart.register({
  id: "centerText",
  afterDraw(chart) {
    const { ctx, width, height } = chart;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data.length) return;

    const arc = meta.data[0] as any;
    if (!arc) return;

    const cx = arc.x;
    const cy = arc.y;
    const valor = (chart as any).$centerTextValor ?? 0;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#667085";
    ctx.font = "10px Inter, Arial, sans-serif";
    ctx.fillText("Total", cx, cy - 8);
    ctx.fillStyle = "#17243a";
    ctx.font = "bold 12px Inter, Arial, sans-serif";
    ctx.fillText(valor, cx, cy + 8);
    ctx.restore();
  },
});

const props = defineProps<{
  itens: DespesaPorCategoriaItem[];
  total: number;
}>();

const { formatarReal } = useUtils();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const cores = computed(() => {
  const mapa = getCoresDespesasPorCategoria(props.itens);
  return props.itens.map(
    (i) => mapa.get(i.categoria?.id ?? "__sem__") ?? "#aaa",
  );
});

const desenhar = () => {
  if (!canvasRef.value) return;

  chart?.destroy();

  const config: ChartConfiguration = {
    type: "doughnut",
    data: {
      labels: props.itens.map((i) => i.categoria?.nome ?? "Sem categoria"),
      datasets: [
        {
          data: props.itens.map((i) => i.valor),
          backgroundColor: cores.value,
          borderColor: "#fff",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const item = props.itens[ctx.dataIndex];
              return ` ${formatarReal(Number(ctx.raw ?? 0))} (${item?.percentual.toFixed(1) ?? 0}%)`;
            },
          },
        },
      },
    },
  };

  chart = new Chart(canvasRef.value, config);
  (chart as any).$centerTextValor = formatarReal(props.total);
};

onMounted(() => nextTick(desenhar));
onBeforeUnmount(() => chart?.destroy());

watch(
  () => props.itens,
  () => nextTick(desenhar),
  { deep: true },
);

watch(
  () => props.total,
  (v) => {
    if (chart) (chart as any).$centerTextValor = formatarReal(v);
  },
);
</script>

<style scoped>
canvas {
  width: 100% !important;
}
</style>
