import type {
  IndicadorOrcamento,
  TipoCategoriaFinanceira,
} from "@/utils/tipagem";

interface ICategoriaResumo {
  id: string;
  nome: string;
  cor: string | null;
  icone: string | null;
  tipo?: TipoCategoriaFinanceira;
}

interface IContaResumo {
  id: string;
  nome: string;
  cor: string | null;
  icone: string | null;
}

interface IOrcamento {
  id: string;
  familiaId: string;
  categoriaId: string;
  contaId: string;
  mes: number;
  ano: number;
  valorLimite: number;
  valorAtual: number;
  criadoEm: Date;
  atualizadoEm: Date;
  categoria?: ICategoriaResumo | null;
  conta?: IContaResumo | null;
  valorRestante: number;
  percentualUtilizado: number;
  indicador: IndicadorOrcamento;
}

interface IResumoOrcamentos {
  mes: number;
  ano: number;
  quantidadeOrcamentos: number;
  totalOrcado: number;
  totalConsumido: number;
  totalRestante: number;
  percentualGlobal: number;
  porIndicador: Record<IndicadorOrcamento, number>;
  orcamentos: IOrcamento[];
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroOrcamentos = {
  mes: number | null;
  ano: number | null;
  status: IndicadorOrcamento[] | null;
  busca: string | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseOrcamentos {
  filtro: FiltroOrcamentos;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IOrcamento[];
}

interface ParametrosOrcamentos {
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

type CriarOrcamentoDTO = {
  categoriaId: string;
  contaId: string;
  mes: number;
  ano: number;
  valorLimite: number;
};

type AtualizarOrcamentoDTO = {
  valorLimite?: number;
  contaId?: string;
};

export type {
  ICategoriaResumo,
  IContaResumo,
  IOrcamento,
  IResumoOrcamentos,
  FiltroOrcamentos,
  IResponseOrcamentos,
  ParametrosOrcamentos,
  CriarOrcamentoDTO,
  AtualizarOrcamentoDTO,
};