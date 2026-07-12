import type { StatusExecucao } from "@/utils/tipagem";

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
  execucoes: Execucao[];
  atribuirAutomaticamente: boolean;
};

export type { FormNovaTarefa, Execucao };
