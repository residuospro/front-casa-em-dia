import type { TipoCartao } from "@/utils/tipagem";

interface ICartao {
  id: string;
  familiaId: string;
  contaId: string;
  nome: string;
  tipo: TipoCartao;
  bandeira: string | null;
  limite: number | null;
  fechamentoDia: number | null;
  vencimentoDia: number | null;
  melhorDiaCompra: number | null;
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

type FiltroCartoes = {
  ativo: boolean | null;
  busca: string | null;
  tipo: TipoCartao | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseCartoes {
  filtro: FiltroCartoes;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ICartao[];
}

interface ParametrosCartoes {
  filtro: FiltroCartoes;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

export type {
  ICartao,
  IResponseCartoes,
  ParametrosCartoes,
  FiltroCartoes,
};
