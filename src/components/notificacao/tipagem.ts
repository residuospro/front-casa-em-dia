interface INotificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lido: boolean;
  criadoEm: string;
  dados: any;
  remetente: {
    nome: string;
    fotoPerfil: string;
  } | null;
}

type TipoFiltro = "todas" | "nao-lidas" | "lidas";

export type { INotificacao, TipoFiltro };
