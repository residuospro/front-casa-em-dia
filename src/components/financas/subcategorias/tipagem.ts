interface ISubcategoria {
  id: string;
  categoriaId: string;
  nome: string;
  ativo: boolean;
  criadoEm: Date;
  categoria?: {
    id: string;
    nome: string;
  };
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroSubcategorias = {
  ativo: boolean | null;
  busca: string | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseSubcategorias {
  filtro: FiltroSubcategorias;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ISubcategoria[];
}

interface ParametrosSubcategorias {
  filtro: FiltroSubcategorias;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

export type {
  ISubcategoria,
  IResponseSubcategorias,
  ParametrosSubcategorias,
  FiltroSubcategorias,
};
