interface ICentroCusto {
  id: string;
  familiaId: string;
  nome: string;
  icone: string | null;
  cor: string | null;
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

type FiltroCentroCusto = {
  ativo: boolean | null;
  busca: string | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseCentroCusto {
  filtro: FiltroCentroCusto;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ICentroCusto[];
}

type ParametrosCentroCusto = {
  filtro: FiltroCentroCusto;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
};

export type {
  ICentroCusto,
  IResponseCentroCusto,
  ParametrosCentroCusto,
  FiltroCentroCusto,
};
