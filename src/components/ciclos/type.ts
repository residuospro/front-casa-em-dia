interface IResponseCiclos {
  id: string;
  familiaId: string;
  nome: string;
  descricao: string | null;
  duracaoDias: number;
  ativo: boolean;
  inicio: string;
  proximaRenovacao: string | null;
  renovadoEm: string | null;
  participantes: string[];
  renovacaoAutomatica: boolean;
  revezamentoAutomatico: boolean;
  iteracao: number;
  expirado: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type { IResponseCiclos };
