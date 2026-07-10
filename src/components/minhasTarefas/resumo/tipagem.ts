interface IResumo {
  totalTarefas: number;
  execucoesConcluidas: number;
  execucoesAtrasadas: number;
  diasRestantes: number;
  ciclo: {
    id: string;
    nome: string;
    inicio: string;
    duracaoDias: number;
  };
}

export type { IResumo };
