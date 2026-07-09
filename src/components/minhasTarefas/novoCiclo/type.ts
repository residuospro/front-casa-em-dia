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
  duracaoDias: number;
  ativo: boolean;
  inicio: string;
  ultimaRotacao: string | null;
  criadoEm: string;
  atualizadoEm: string;
  participantes: string[];
  descricao: string;
}

export type { FormCiclo, IResponseCiclos };
