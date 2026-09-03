import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";
import { useDashboard } from "./useDashboard";
import type {
  FluxoCaixaResponse,
  EvolucaoPatrimonioResponse,
  DespesasPorCategoriaResponse,
  MetasProgressoResponse,
  OrcamentoResumoResponse,
  SaldoContasResponse,
  GastosPorResponsavelResponse,
} from "./tipagem";

export const useApiDashboard = () => {
  const { perfil } = storeToRefs(usePerfil());
  const dashboard = useDashboard();
  const client = useClient;

  const carregarFluxoCaixa = async () => {
    const { inicio, fim, granularidade } = dashboard.filtros;
    const res = await client.get<FluxoCaixaResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/fluxo-caixa`,
      { params: { inicio, fim, granularidade } },
    );
    dashboard.fluxoCaixa.value = res.data;
  };

  const carregarEvolucao = async () => {
    const meses = 12;
    const agora = new Date();
    const inicioData = new Date(agora.getFullYear(), agora.getMonth() - (meses - 1), 1);
    const inicio = `${inicioData.getFullYear()}-${String(inicioData.getMonth() + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getDate();
    const fim = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    const [patrimonio, fluxo] = await Promise.all([
      client.get<EvolucaoPatrimonioResponse>(
        `/financeiro/${perfil.value.familiaId}/financeiro/graficos/evolucao-patrimonio`,
        { params: { meses } },
      ),
      client.get<FluxoCaixaResponse>(
        `/financeiro/${perfil.value.familiaId}/financeiro/graficos/fluxo-caixa`,
        {
          params: {
            inicio,
            fim,
            granularidade: "MES",
          },
        },
      ),
    ]);
    dashboard.evolucaoPatrimonio.value = patrimonio.data;
    dashboard.fluxoEvolucao.value = fluxo.data;
  };

  const carregarDespesasPorCategoria = async () => {
    const { inicio, fim } = dashboard.filtros;
    const res = await client.get<DespesasPorCategoriaResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/despesas-por-categoria`,
      { params: { inicio, fim } },
    );
    dashboard.despesasPorCategoria.value = res.data;
  };

  const carregarMetas = async () => {
    const res = await client.get<MetasProgressoResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/metas-progresso`,
    );
    dashboard.metas.value = res.data;
  };

  const carregarOrcamentos = async () => {
    const agora = new Date();
    const mes = dashboard.filtros.inicio
      ? Number(dashboard.filtros.inicio.split("-")[1])
      : agora.getMonth() + 1;
    const ano = dashboard.filtros.inicio
      ? Number(dashboard.filtros.inicio.split("-")[0])
      : agora.getFullYear();
    const res = await client.get<OrcamentoResumoResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/orcamentos-resumo`,
      { params: { mes, ano } },
    );
    dashboard.orcamentos.value = res.data;
  };

  const carregarSaldoContas = async () => {
    const res = await client.get<SaldoContasResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/saldo-contas`,
    );
    dashboard.saldoContas.value = res.data;
  };

  const carregarGastosPorResponsavel = async () => {
    const { inicio, fim } = dashboard.filtros;
    const res = await client.get<GastosPorResponsavelResponse>(
      `/financeiro/${perfil.value.familiaId}/financeiro/graficos/gastos-por-responsavel`,
      { params: { inicio, fim } },
    );
    dashboard.gastosPorResponsavel.value = res.data;
  };

  const carregarDashboard = async () => {
    dashboard.loading.value = true;
    dashboard.erro.value = null;
    try {
      await Promise.all([
        carregarFluxoCaixa(),
        carregarEvolucao(),
        carregarDespesasPorCategoria(),
        carregarMetas(),
        carregarOrcamentos(),
        carregarSaldoContas(),
        carregarGastosPorResponsavel(),
      ]);
    } catch {
      dashboard.erro.value = "Erro ao carregar dashboard";
    } finally {
      dashboard.loading.value = false;
    }
  };

  return {
    dashboard,
    carregarDashboard,
    carregarFluxoCaixa,
    carregarEvolucao,
    carregarDespesasPorCategoria,
    carregarMetas,
    carregarOrcamentos,
    carregarSaldoContas,
    carregarGastosPorResponsavel,
  };
};
