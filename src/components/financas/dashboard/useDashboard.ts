import { reactive, ref, computed } from "vue";
import type {
  DashboardFiltros,
  FluxoCaixaResponse,
  EvolucaoPatrimonioResponse,
  EvolucaoMensalItem,
  DespesasPorCategoriaResponse,
  MetasProgressoResponse,
  OrcamentoResumoResponse,
  SaldoContasResponse,
  GastosPorResponsavelResponse,
  KpiData,
} from "./tipagem";

function hojeInicio(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function hojeFim(): string {
  const d = new Date();
  const ultimoDia = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
}

export const useDashboard = () => {
  const filtros = reactive<DashboardFiltros>({
    inicio: hojeInicio(),
    fim: hojeFim(),
    moeda: "BRL",
    granularidade: "MES",
  });

  const fluxoCaixa = ref<FluxoCaixaResponse | null>(null);
  const evolucaoPatrimonio = ref<EvolucaoPatrimonioResponse | null>(null);
  const fluxoEvolucao = ref<FluxoCaixaResponse | null>(null);
  const despesasPorCategoria = ref<DespesasPorCategoriaResponse | null>(null);
  const metas = ref<MetasProgressoResponse | null>(null);
  const orcamentos = ref<OrcamentoResumoResponse | null>(null);
  const saldoContas = ref<SaldoContasResponse | null>(null);
  const gastosPorResponsavel = ref<GastosPorResponsavelResponse | null>(null);

  const loading = ref(false);
  const erro = ref<string | null>(null);

  const kpis = computed<KpiData | null>(() => {
    if (!fluxoCaixa.value) return null;
    const moeda = fluxoCaixa.value.porMoeda.find(
      (m) => m.moeda === filtros.moeda,
    );
    if (!moeda) return null;

    const receitas = moeda.totais.receitas;
    const despesas = moeda.totais.despesas;
    const resultado = receitas - despesas;
    const taxaEconomia = receitas > 0 ? (resultado / receitas) * 100 : 0;

    return {
      receitas,
      despesas,
      resultado,
      taxaEconomia: Math.round(taxaEconomia * 10) / 10,
    };
  });

  const serieFluxo = computed(() => {
    if (!fluxoCaixa.value) return [];
    const moeda = fluxoCaixa.value.porMoeda.find(
      (m) => m.moeda === filtros.moeda,
    );
    return moeda?.serie ?? [];
  });

  const totaisFluxo = computed(() => {
    if (!fluxoCaixa.value) return null;
    const moeda = fluxoCaixa.value.porMoeda.find(
      (m) => m.moeda === filtros.moeda,
    );
    return moeda?.totais ?? null;
  });

  const serieEvolucao = computed<EvolucaoMensalItem[]>(() => {
    if (!evolucaoPatrimonio.value) return [];
    const porPatrimonio = evolucaoPatrimonio.value.porMoeda.find(
      (m) => m.moeda === filtros.moeda,
    );
    if (!porPatrimonio) return [];

    const saldoPorMes = new Map<string, number>();
    for (const item of porPatrimonio.serie) {
      const chave = `${item.ano}-${String(item.mes).padStart(2, "0")}`;
      saldoPorMes.set(chave, item.patrimonio);
    }

    const fluxoMoeda = fluxoEvolucao.value?.porMoeda.find(
      (m) => m.moeda === filtros.moeda,
    );

    return porPatrimonio.serie.map((item) => {
      const chave = `${item.ano}-${String(item.mes).padStart(2, "0")}`;
      const fluxoItem = fluxoMoeda?.serie.find((s) => s.periodo === chave);
      return {
        periodo: chave,
        receitas: fluxoItem?.receitas ?? 0,
        despesas: fluxoItem?.despesas ?? 0,
        saldo: item.patrimonio,
      };
    });
  });

  const categoriasDespesa = computed(() => {
    if (!despesasPorCategoria.value) return [];
    return despesasPorCategoria.value.porCategoria;
  });

  const totalDespesasCategoria = computed(() => {
    if (!despesasPorCategoria.value) return 0;
    const totais = despesasPorCategoria.value.totais.find(
      (t) => t.moeda === filtros.moeda,
    );
    return totais?.total ?? 0;
  });

  const limparDados = () => {
    fluxoCaixa.value = null;
    evolucaoPatrimonio.value = null;
    fluxoEvolucao.value = null;
    despesasPorCategoria.value = null;
    metas.value = null;
    orcamentos.value = null;
    saldoContas.value = null;
    gastosPorResponsavel.value = null;
  };

  return {
    filtros,
    fluxoCaixa,
    evolucaoPatrimonio,
    fluxoEvolucao,
    despesasPorCategoria,
    metas,
    orcamentos,
    saldoContas,
    gastosPorResponsavel,
    loading,
    erro,
    kpis,
    serieFluxo,
    totaisFluxo,
    serieEvolucao,
    categoriasDespesa,
    totalDespesasCategoria,
    limparDados,
  };
};
