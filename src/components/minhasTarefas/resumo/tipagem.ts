interface IResumo {
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasAtrasadas: number;
  diasRestantes: number;
  ciclo: {
    id: string;
    nome: string;
    inicio: string;
    duracaoDias: number;
  };
}

export type { IResumo };
