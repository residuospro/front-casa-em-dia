import type {
  StatusMetaFinanceira,
  TipoMetaFinanceira,
  TipoMovimentacaoMeta,
} from "@/utils/tipagem";

interface IContaResumo {
  id: string;
  nome: string;
  cor: string | null;
  icone: string | null;
}

interface IHistoricoMetaFinanceira {
  id: string;
  metaFinanceiraId: string;
  usuarioId: string;
  tipo: TipoMovimentacaoMeta;
  valor: number;
  saldoAnterior: number;
  saldoNovo: number;
  observacao: string | null;
  criadoEm: Date;
  usuario?: { id: string; nome: string; fotoPerfil: string | null } | null;
}

interface IMetaFinanceira {
  id: string;
  familiaId: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoMetaFinanceira;
  valorObjetivo: number;
  valorAtual: number;
  dataLimite: Date | null;
  contaDestinoId: string | null;
  status: StatusMetaFinanceira;
  imagem: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  contaDestino?: IContaResumo | null;
  percentualConcluido: number;
  valorRestante: number;
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroMetas = {
  busca: string | null;
  status: StatusMetaFinanceira[] | null;
  tipo: TipoMetaFinanceira[] | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseMetas {
  filtro: FiltroMetas;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IMetaFinanceira[];
}

interface IResponseHistoricos {
  filtro: Record<string, unknown>;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IHistoricoMetaFinanceira[];
}

type ParametrosMetas = {
  filtro: FiltroMetas;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
};

type CriarMetaDTO = {
  titulo: string;
  descricao?: string | null;
  tipo: TipoMetaFinanceira;
  valorObjetivo: number;
  dataLimite?: string | null;
  contaDestinoId?: string | null;
  imagem?: string | null;
};

type AtualizarMetaDTO = Partial<CriarMetaDTO>;

type MovimentacaoMetaDTO = {
  valor: number;
  tipo: TipoMovimentacaoMeta;
  observacao?: string | null;
};

type OpcaoConta = {
  id: string;
  nome: string;
};

export type {
  IMetaFinanceira,
  IHistoricoMetaFinanceira,
  IResponseMetas,
  IResponseHistoricos,
  ParametrosMetas,
  FiltroMetas,
  CriarMetaDTO,
  AtualizarMetaDTO,
  MovimentacaoMetaDTO,
  OpcaoConta,
};