const StatusExecucaoValues = {
  AGENDADA: "AGENDADA",
  CONCLUIDA: "CONCLUIDA",
  ATRASADA: "ATRASADA",
  CANCELADA: "CANCELADA",
} as const;

type StatusExecucao =
  (typeof StatusExecucaoValues)[keyof typeof StatusExecucaoValues];

type Execucao = {
  data: string;
  status: StatusExecucao;
  pontosObtidos: number | null;
};

type FormNovaTarefa = {
  titulo: string;
  descricao: string;
  tipo: string;
  categoria: string;
  modoDistribuicao: string;
  responsavelAtualId: string | null;
  pontos: number | null;
  cicloId: string | null;
  agendamentos: Execucao[];
};

export type { FormNovaTarefa, Execucao, StatusExecucao };
