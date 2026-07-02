interface IResponseCiclos {
  id: string;
  familiaId: string;
  nome: string;
  duracaoDias: number;
  ativo: boolean;
  inicio: string;
  ultimaRotacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export type { IResponseCiclos };
