import type { FrequenciasRecorrencia, StatusExecucao } from "@/utils/tipagem";

type Execucao = {
  data: string;
  status: StatusExecucao;
  pontosObtidos: number | null;
};

type Recorrencia = {
  frequencia: FrequenciasRecorrencia | null;
  horarios: string[];
  dataInicio?: string;
  dataFim?: string | null;
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
  execucoes: Execucao[];
  atribuirAutomaticamente: boolean;
  recorrencia: Recorrencia | null;
};

export type { FormNovaTarefa, Execucao, Recorrencia };
