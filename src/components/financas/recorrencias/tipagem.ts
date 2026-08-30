import type {
  FrequenciaRecorrenciaFinanceira,
  StatusLancamento,
  TipoLancamento,
  FormaPagamento,
  Moeda,
} from "@/utils/tipagem";

interface ModeloLancamento {
  id: string;
  tipo: TipoLancamento;
  titulo: string;
  descricao: string | null;
  valor: number;
  moeda: Moeda;
  categoriaId: string | null;
  subcategoriaId: string | null;
  centroCustoId: string | null;
  contaOrigemId: string;
  contaDestinoId: string | null;
  cartaoId: string | null;
  formaPagamento: FormaPagamento | null;
  observacoes: string | null;
  localizacao: string | null;
  responsavelId: string;
  criadoPorId: string;
  categoria?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  subcategoria?: { id: string; nome: string } | null;
  centroCusto?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  contaOrigem?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  contaDestino?: { id: string; nome: string; cor: string | null; icone: string | null } | null;
  cartao?: { id: string; nome: string } | null;
  responsavel?: { id: string; nome: string; fotoPerfil: string | null } | null;
}

interface IRecorrencia {
  id: string;
  familiaId: string;
  lancamentoModeloId: string;
  titulo: string;
  frequencia: FrequenciaRecorrenciaFinanceira;
  intervalo: number;
  proximaExecucao: Date;
  ultimaExecucao: Date | null;
  ativa: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  lancamentoModelo?: ModeloLancamento | null;
  _count?: { lancamentos: number };
  ocorrenciasRecentes?: IOcorrencia[];
}

interface IOcorrencia {
  id: string;
  titulo: string;
  valor: number;
  moeda: Moeda;
  status: StatusLancamento;
  dataHora: Date;
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type FiltroRecorrencia = {
  busca: string | null;
  ativa: boolean | null;
  frequencia: FrequenciaRecorrenciaFinanceira[] | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseRecorrencias {
  filtro: FiltroRecorrencia;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IRecorrencia[];
}

interface IResponseOcorrencias {
  filtro: Record<string, unknown>;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: IOcorrencia[];
}

type ParametrosRecorrencia = {
  filtro: FiltroRecorrencia;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
};

interface IExecucaoManual {
  recorrenciaId: string;
  gerada: boolean;
  proximaExecucao: string;
}

export type {
  IRecorrencia,
  IOcorrencia,
  IResponseRecorrencias,
  IResponseOcorrencias,
  ParametrosRecorrencia,
  FiltroRecorrencia,
  IExecucaoManual,
};
