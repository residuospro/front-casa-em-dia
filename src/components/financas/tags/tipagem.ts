interface ITag {
  id: string;
  familiaId: string;
  nome: string;
  cor: string | null;
  criadoEm: Date;
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroTag = {
  busca: string | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseTag {
  filtro: FiltroTag;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ITag[];
}

type ParametrosTag = {
  filtro: FiltroTag;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
};

export type {
  ITag,
  IResponseTag,
  ParametrosTag,
  FiltroTag,
};
