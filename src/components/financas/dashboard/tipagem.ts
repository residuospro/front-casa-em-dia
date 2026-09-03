import type { Moeda, IndicadorOrcamento } from "@/utils/tipagem";

export type GranularidadePeriodo = "DIA" | "SEMANA" | "MES";

export interface DashboardFiltros {
  inicio: string;
  fim: string;
  moeda: Moeda;
  granularidade: GranularidadePeriodo;
}

export interface FluxoCaixaSerieItem {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
  quantidade: number;
  realizado: { receitas: number; despesas: number };
  previsto: { receitas: number; despesas: number };
}

export interface FluxoCaixaTotais {
  receitas: number;
  despesas: number;
  saldo: number;
  realizadoReceitas: number;
  realizadoDespesas: number;
  previstoReceitas: number;
  previstoDespesas: number;
}

export interface FluxoCaixaMoeda {
  moeda: Moeda;
  serie: FluxoCaixaSerieItem[];
  totais: FluxoCaixaTotais;
}

export interface FluxoCaixaResponse {
  inicio: string;
  fim: string;
  granularidade: GranularidadePeriodo;
  porMoeda: FluxoCaixaMoeda[];
}

export interface EvolucaoPatrimonioSerieItem {
  ano: number;
  mes: number;
  patrimonio: number;
}

export interface EvolucaoPatrimonioMoeda {
  moeda: Moeda;
  serie: EvolucaoPatrimonioSerieItem[];
  patrimonioAtual: number;
}

export interface EvolucaoPatrimonioResponse {
  inicio: string;
  fim: string;
  meses: number;
  porMoeda: EvolucaoPatrimonioMoeda[];
}

export interface EvolucaoMensalItem {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface CategoriaDespesa {
  id: string;
  nome: string;
  cor: string | null;
  icone: string | null;
}

export interface DespesaPorCategoriaItem {
  categoria: CategoriaDespesa | null;
  moeda: Moeda;
  valor: number;
  percentual: number;
  quantidade: number;
}

export interface DespesasPorCategoriaResponse {
  inicio: string;
  fim: string;
  totais: { moeda: Moeda; total: number }[];
  porCategoria: DespesaPorCategoriaItem[];
}

export interface MetaFinanceiraResumo {
  total: number;
  emAndamento: number;
  concluidas: number;
  canceladas: number;
  valorObjetivo: number;
  valorAtual: number;
  percentualGlobal: number;
}

export interface MetaFinanceiraItem {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  valorObjetivo: number;
  valorAtual: number;
  dataLimite: string | null;
  status: string;
  percentualConcluido: number;
  valorRestante: number;
  contaDestino: { id: string; nome: string; cor: string | null; icone: string | null } | null;
}

export interface MetasProgressoResponse {
  resumo: MetaFinanceiraResumo;
  metas: MetaFinanceiraItem[];
}

export interface OrcamentoResumoResponse {
  mes: number;
  ano: number;
  quantidadeOrcamentos: number;
  totalOrcado: number;
  totalConsumido: number;
  totalRestante: number;
  percentualGlobal: number;
  porIndicador: Record<IndicadorOrcamento, number>;
}

export interface ContaSaldo {
  id: string;
  nome: string;
  instituicao: string | null;
  tipo: string;
  moeda: Moeda;
  cor: string | null;
  icone: string | null;
  saldoAtual: number;
  saldoPrevisto: number;
  previsao: number;
}

export interface SaldoContasResponse {
  contas: ContaSaldo[];
  totaisPorMoeda: {
    moeda: Moeda;
    saldoAtual: number;
    saldoPrevisto: number;
    previsao: number;
  }[];
}

export interface GastosPorResponsavelItem {
  responsavel: { id: string; nome: string | null };
  moeda: Moeda;
  total: number;
  quantidade: number;
  percentual: number;
}

export interface GastosPorResponsavelResponse {
  inicio: string;
  fim: string;
  porResponsavel: GastosPorResponsavelItem[];
  totais: { moeda: Moeda; total: number }[];
}

export interface KpiData {
  receitas: number;
  despesas: number;
  resultado: number;
  taxaEconomia: number;
}
