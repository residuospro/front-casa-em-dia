interface ICicloResumo {
  id: string;
  nome: string;
  inicio: string;
  duracaoDias: number;
  diasRestantes: number;
}

interface IResumo {
  totalTarefas: number;
  execucoesConcluidas: number;
  execucoesAtrasadas: number;
  diasRestantes: number;
  ciclos: ICicloResumo[];
}

type Items = {
  label: string;
  value: number;
  slug: string;
  icone: string;
  isCiclo?: boolean;
  duracaoDias?: number;
  restantesCount?: number;
};

export type { IResumo, Items };
