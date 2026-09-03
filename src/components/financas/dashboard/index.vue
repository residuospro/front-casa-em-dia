<template>
  <div class="w-full flex flex-col gap-4">
    <!-- Cabeçalho + filtros -->
    <div
      class="w-full flex justify-between flex-wrap items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-[#17243a]">Dashboard</h1>
        <p class="text-sm text-[#667085]">
          Visão geral da saúde financeira da sua família.
        </p>
      </div>

      <div class="flex items-end gap-2 flex-wrap">
        <Button @click="router.push('/financas/orcamentos')">Orçamentos</Button>
        <Button @click="router.push('/financas/lancamentos')">
          Laçamentos
        </Button>

        <button
          type="button"
          class="w-auto flex items-center gap-2 px-4 h-11 rounded-lg border border-gray-200 text-sm text-[#263247] hover:bg-gray-50"
          @click="carregarDashboard"
        >
          ⟳ Atualizar
        </button>

        <Select
          label="Moeda"
          :items="opcoesMoedas"
          v-model="filtros.moeda"
          class="w-32"
        />
      </div>
    </div>

    <div
      v-if="erro"
      class="w-full bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-4"
    >
      {{ erro }}
    </div>

    <!-- KPIs -->
    <KpiCards :dados="kpis" />

    <!-- Gráficos principais -->
    <div class="w-full flex items-stretch xl:!flex-row flex-col gap-2">
      <FluxoCaixaChart :serie="serieEvolucao" />
      <DespesasPorCategoria
        :itens="categoriasDespesa"
        :total="totalDespesasCategoria"
      />
    </div>

    <!-- Cards de resumo -->
    <div class="w-full flex items-stretch xl:!flex-row flex-col gap-2">
      <OrcamentosResumo :dados="orcamentos" />
      <MetasProgresso :dados="metas" />
      <SaldoContas :dados="saldoContas" :moeda="filtros.moeda" />
      <PendenciasCard :itens="pendencias" />
      <AlertasCard :itens="alertas" />
    </div>

    <!-- Alertas -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUtils } from "@/utils/useUtils";
import Select from "@/components/select/index.vue";
import KpiCards from "./KpiCards.vue";
import FluxoCaixaChart from "./FluxoCaixaChart.vue";
import DespesasPorCategoria from "./DespesasPorCategoria.vue";
import OrcamentosResumo from "./OrcamentosResumo.vue";
import MetasProgresso from "./MetasProgresso.vue";
import SaldoContas from "./SaldoContas.vue";
import PendenciasCard from "./PendenciasCard.vue";
import AlertasCard, { type AlertaItem } from "./AlertasCard.vue";
import { useApiDashboard } from "./useApiDashboard";
import type { Moeda } from "@/utils/tipagem";
import Button from "@/components/botao/index.vue";
import { useRouter } from "vue-router";

const { formatarReal } = useUtils();
const router = useRouter();
const { dashboard, carregarDashboard } = useApiDashboard();

const {
  filtros,
  kpis,
  metas,
  orcamentos,
  saldoContas,
  serieEvolucao,
  totaisFluxo,
  categoriasDespesa,
  totalDespesasCategoria,
  erro,
} = dashboard;

const opcoesMoedas = [
  { text: "BRL", value: "BRL" as Moeda },
  { text: "USD", value: "USD" as Moeda },
  { text: "EUR", value: "EUR" as Moeda },
];

const pendencias = computed(() => {
  if (!totaisFluxo.value) return [];

  return [
    {
      label: "Despesas pendentes",
      quantidade: totaisFluxo.value.previstoDespesas > 0 ? 1 : 0,
      valor: totaisFluxo.value.previstoDespesas,
    },
  ];
});

const alertas = computed<AlertaItem[]>(() => {
  const itens: AlertaItem[] = [];

  const orc = orcamentos.value;
  if (orc && orc.percentualGlobal >= 100) {
    itens.push({
      tipo: "CRITICO",
      titulo: "Orçamento geral ultrapassado",
      descricao: `Você excedeu o limite total em ${formatarReal(orc.totalRestante < 0 ? -orc.totalRestante : 0)}`,
      badgeStyle: {
        color: "#e53935",
        background: "#fff0f0",
        border: "1px solid #f5c6c6",
      },
    });
  }

  if (orc && orc.porIndicador.PROXIMO > 0) {
    itens.push({
      tipo: "ATENCAO",
      titulo: `${orc.porIndicador.PROXIMO} orçamento(s) próximo(s) do limite`,
      descricao: "Verifique os orçamentos que estão próximos de estourar.",
      badgeStyle: {
        color: "#f59e0b",
        background: "#fff7e8",
        border: "1px solid #f5d68a",
      },
    });
  }

  if (orc && orc.porIndicador.ULTRAPASSADO > 0) {
    itens.push({
      tipo: "CRITICO",
      titulo: `${orc.porIndicador.ULTRAPASSADO} orçamento(s) ultrapassado(s)`,
      descricao: "Você excedeu o limite em algumas categorias.",
      badgeStyle: {
        color: "#e53935",
        background: "#fff0f0",
        border: "1px solid #f5c6c6",
      },
    });
  }

  return itens;
});

onMounted(() => {
  carregarDashboard();
});
</script>
