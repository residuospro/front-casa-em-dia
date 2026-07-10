const TipoPessoaValues = {
  MARIDO: "MARIDO",
  ESPOSA: "ESPOSA",
  FILHO: "FILHO",
  FILHA: "FILHA",
  OUTRO: "OUTRO",
} as const;

const CategoriaValues = {
  CASA: "CASA",
  ESTUDO: "ESTUDO",
  SAUDE: "SAUDE",
  FINANCEIRO: "FINANCEIRO",
  OUTROS: "OUTROS",
} as const;

const TipoTarefaValues = {
  PESSOAL: "PESSOAL",
  FAMILIAR: "FAMILIAR",
} as const;

const ModoDistribuicaoValues = {
  FIXA: "FIXA",
  REVEZAMENTO: "REVEZAMENTO",
} as const;

const StatusExecucaoValues = {
  AGENDADA: "AGENDADA",
  CONCLUIDA: "CONCLUIDA",
  ATRASADA: "ATRASADA",
  CANCELADA: "CANCELADA",
} as const;

const TipoNotificacaoValues = {
  CONVITE_FAMILIA: "CONVITE_FAMILIA",
  CICLO_VENCIDO: "CICLO_VENCIDO",
  EXECUCAO_TAREFA: "EXECUCAO_TAREFA",
  TAREFA_ATRIBUIDA: "TAREFA_ATRIBUIDA",
} as const;

type TipoNotificacao =
  (typeof TipoNotificacaoValues)[keyof typeof TipoNotificacaoValues];

type StatusExecucao =
  (typeof StatusExecucaoValues)[keyof typeof StatusExecucaoValues];

type TipoPessoa = (typeof TipoPessoaValues)[keyof typeof TipoPessoaValues];
type Categorias = (typeof CategoriaValues)[keyof typeof CategoriaValues];
type TipoTarefa = (typeof TipoTarefaValues)[keyof typeof TipoTarefaValues];
type ModoDistribuicao =
  (typeof ModoDistribuicaoValues)[keyof typeof ModoDistribuicaoValues];

type Genero = "MASCULINO" | "FEMININO" | "OUTRO" | null;

interface Perfil {
  id: string;
  usuarioId: string;
  nome: string;
  email: string;
  celular: string | null;
  genero: Genero;
  fotoPerfil: string | null;
  familiaId: string;
  permissao: "ADMIN" | "USUARIO";
  familia: string;
  totalMembros: number;
  tipoPessoa: TipoPessoa | null;
}

interface UsuarioEdit {
  nome: string;
  email: string;
  celular: string | null;
  senha: string;
  confirmarSenha: string;
  genero: Genero;
  tipoPessoa: TipoPessoa | null;
  fotoPerfil: string | File | null;
}

export {
  CategoriaValues,
  TipoPessoaValues,
  TipoTarefaValues,
  ModoDistribuicaoValues,
  StatusExecucaoValues,
  TipoNotificacaoValues,
  type TipoNotificacao,
  type ModoDistribuicao,
  type TipoPessoa,
  type Categorias,
  type TipoTarefa,
  type StatusExecucao,
  type Perfil,
  type UsuarioEdit,
  type Genero,
};
