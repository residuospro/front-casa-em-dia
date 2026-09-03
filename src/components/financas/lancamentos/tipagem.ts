import type { TipoLancamento, StatusLancamento, FormaPagamento } from "@/utils/tipagem";

interface ILancamento {
  id: string;
  familiaId: string;
  criadoPorId: string;
  responsavelId: string;
  tipo: TipoLancamento;
  titulo: string;
  descricao: string | null;
  valor: number;
  moeda: string;
  categoriaId: string | null;
  subcategoriaId: string | null;
  centroCustoId: string | null;
  contaOrigemId: string;
  contaDestinoId: string | null;
  cartaoId: string | null;
  formaPagamento: FormaPagamento | null;
  dataHora: Date;
  observacoes: string | null;
  status: StatusLancamento;
  origem: string;
  localizacao: string | null;
  criadoEm: Date;
  atualizadoEm: Date;
  categoria?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  subcategoria?: { id: string; nome: string } | null;
  centroCusto?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  contaOrigem?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  contaDestino?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  cartao?: { id: string; nome: string } | null;
  responsavel?: {
    id: string;
    nome: string;
    fotoPerfil: string | null;
    usuario: { id: string; nome: string; fotoPerfil: string | null };
  } | null;
  tags?: { tag: { id: string; nome: string; cor: string | null } }[];
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroLancamento = {
  busca: string | null;
  tipo: TipoLancamento[] | null;
  status: StatusLancamento[] | null;
  contaId: string | null;
  inicio: string | null;
  fim: string | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseLancamentos {
  filtro: FiltroLancamento;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: ILancamento[];
}

type ParametrosLancamento = {
  filtro: FiltroLancamento;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
};

export type {
  ILancamento,
  IResponseLancamentos,
  ParametrosLancamento,
  FiltroLancamento,
};
