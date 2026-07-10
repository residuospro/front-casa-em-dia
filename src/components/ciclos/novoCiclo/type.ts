type FormCiclo = {
  nome: string;
  descricao: string;
  duracaoDias: number;
  inicio: string;
  ativo: boolean;
  participantes: string[];
  renovacaoAutomatica: boolean;
  revezamentoAutomatico: boolean;
};

interface IResponseCiclos {
  id: string;
  familiaId: string;
  nome: string;
  descricao: string;
  duracaoDias: number;
  ativo: boolean;
  inicio: string;
  renovadoEm: string;
  proximaRenovacao: string;
  participantes: string[];
  renovacaoAutomatica: boolean;
  revezamentoAutomatico: boolean;
  iteracao: number;
  expirado: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export type { FormCiclo, IResponseCiclos };
