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
  renovadoEm: string | null;
  expirado: boolean;
}

export type { IResponseCiclos };
