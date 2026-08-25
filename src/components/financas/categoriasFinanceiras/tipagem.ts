import type { StatusCategoria, TipoCategoriaFinanceira } from "@/utils/tipagem";

interface ICategoria {
  id: string;
  familiaId: string;
  nome: string;
  icone: string | null;
  cor: string | null;
  tipo: TipoCategoriaFinanceira;
  status: StatusCategoria;
  criadoEm: Date;
  atualizadoEm: Date;
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroCategorias = {
  ativo: boolean | null;
  busca: string | null;
  tipo: TipoCategoriaFinanceira | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseCategorias {
  filtro: FiltroCategorias;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ICategoria[];
}

interface ParametrosCategorias {
  filtro: FiltroCategorias;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

export type {
  ICategoria,
  IResponseCategorias,
  ParametrosCategorias,
  FiltroCategorias,
};
