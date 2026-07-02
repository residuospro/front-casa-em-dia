import type { Categorias, TipoTarefa, ModoDistribuicao } from "@/utils/tipagem";

type Tarefa = {
  id: string;
  familiaId: string;
  cicloId: string | null;
  titulo: string;
  descricao: string | null;
  tipo: TipoTarefa;
  categoria: Categorias;
  modoDistribuicao: ModoDistribuicao | null;
  responsavelAtualId: string | null;
  pontos: number;
  ativo: boolean;
  criadoPorId: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

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
  ativo: boolean | null;
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

interface Agendamento {
  id: string;
  tarefaId: string;
  diaSemana: number;
  horario: string;
}

interface AgendamentoComData extends Agendamento {
  dataAgendamento: Date;
}

export type {
  IResponseTarefa,
  Filtro,
  ParametrosTarefas,
  Agendamento,
  AgendamentoComData,
};
