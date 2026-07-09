import type {
  Categorias,
  TipoTarefa,
  ModoDistribuicao,
  StatusExecucao,
} from "@/utils/tipagem";

interface Tarefa {
  id: string;
  familiaId: string;
  cicloId: string | null;
  titulo: string;
  descricao: string | null;
  tipo: TipoTarefa;
  categoria: Categorias;
  modoDistribuicao: ModoDistribuicao | null;
  responsavelAtualId: string | null;
  responsavelAtual: {
    id: string;
    nome: string;
    fotoPerfil: string;
    genero: "MASCULINO" | "FEMININO";
  };
  pontos: number;
  ativo: boolean;
  criadoPorId: string;
  criadoEm: Date;
  atualizadoEm: Date;
  execucoes: Execucao[];
}

type Paginacao = {
  total: number;
  pagina: number;
  por_pagina: number;
  ultima_pagina: number;
};

type Filtro = {
  titulo: string;
  tipo: TipoTarefa | null;
  categoria: Categorias | null;
  modoDistribuicao: ModoDistribuicao | null;
  responsavelAtualId: string;
  dataInicial: string | null;
  dataFinal: string | null;
  ativo: boolean | null;
  status: StatusExecucao[] | null;
  busca: string | null;
  cicloId: string | null;
  dependente: boolean | null;
};

type Direcao = "desc" | "asc";

type Ordenacao = {
  coluna: string;
  direcao: Direcao;
};

interface IResponseTarefa {
  filtro: Filtro;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
  data: Tarefa[];
}

interface ParametrosTarefas {
  filtro: Filtro;
  ordenacao: Ordenacao[];
  paginacao: Paginacao;
}

interface Execucao {
  id: string;
  tarefaId: string;
  data: string | Date;
  status: StatusExecucao;
  pontosObtidos: number | null;
  concluidoPorId: string | null;
  concluidoEm: string | null;
  notificacaoCriada: boolean;
  criadoEm: string | null;
}

export type { IResponseTarefa, Filtro, ParametrosTarefas, Execucao, Tarefa };
