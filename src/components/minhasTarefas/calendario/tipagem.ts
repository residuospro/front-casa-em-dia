import type { Tarefa, Execucao } from "../tipagem";

type ModoCalendario = "DIA" | "SEMANA" | "MES";
type TarefaComExecucao = Omit<Tarefa, "id" | "criadoEm" | "execucoes"> &
  Execucao;

export type { TarefaComExecucao, ModoCalendario };
