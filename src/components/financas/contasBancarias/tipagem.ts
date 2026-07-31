import type { Moeda, TipoConta } from "@/utils/tipagem";

interface IConta {
  id: string;
  familiaId: string;
  nome: string;
  instituicao: string | null;
  tipo: TipoConta;
  moeda: Moeda;
  saldoInicial: number;
  saldoAtual: number;
  saldoPrevisto: number;
  cor: string | null;
  icone: string | null;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroContas = {
  ativo: boolean | null;
  busca: string | null;
  tipo: TipoConta | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseContas {
  filtro: FiltroContas;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IConta[];
}

interface ParametrosContas {
  filtro: FiltroContas;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

export type { IConta, IResponseContas, ParametrosContas, FiltroContas };
