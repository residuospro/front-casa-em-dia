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

const FrequenciaRecorrenciaValues = {
  DIARIO: "DIARIO",
  DIA_SIM_DIA_NAO: "DIA_SIM_DIA_NAO",
  DIAS_IMPARES: "DIAS_IMPARES",
  DIAS_PARES: "DIAS_PARES",
} as const;

const TipoContaValues = {
  CONTA_CORRENTE: "CONTA_CORRENTE",
  POUPANCA: "POUPANCA",
  DINHEIRO: "DINHEIRO",
  INVESTIMENTO: "INVESTIMENTO",
  CARTEIRA: "CARTEIRA",
} as const;

const MoedaValues = {
  BRL: "BRL",
  USD: "USD",
  EUR: "EUR",
} as const;

const TipoCartaoValues = {
  CREDITO: "CREDITO",
  DEBITO: "DEBITO",
  AMBOS: "AMBOS",
} as const;

const TipoCategoriaFinanceiraValues = {
  RECEITA: "RECEITA",
  DESPESA: "DESPESA",
} as const;

const StatusCategoriaValues = {
  ATIVA: "ATIVA",
  ARQUIVADA: "ARQUIVADA",
} as const;

type TipoConta = (typeof TipoContaValues)[keyof typeof TipoContaValues];
type Moeda = (typeof MoedaValues)[keyof typeof MoedaValues];
type TipoCartao = (typeof TipoCartaoValues)[keyof typeof TipoCartaoValues];
type TipoCategoriaFinanceira =
  (typeof TipoCategoriaFinanceiraValues)[keyof typeof TipoCategoriaFinanceiraValues];
type StatusCategoria =
  (typeof StatusCategoriaValues)[keyof typeof StatusCategoriaValues];
type TipoNotificacao =
  (typeof TipoNotificacaoValues)[keyof typeof TipoNotificacaoValues];

type StatusExecucao =
  (typeof StatusExecucaoValues)[keyof typeof StatusExecucaoValues];
type FrequenciasRecorrencia =
  (typeof FrequenciaRecorrenciaValues)[keyof typeof FrequenciaRecorrenciaValues];
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
  FrequenciaRecorrenciaValues,
  MoedaValues,
  TipoContaValues,
  TipoCartaoValues,
  TipoCategoriaFinanceiraValues,
  StatusCategoriaValues,
  type Moeda,
  type TipoConta,
  type TipoCartao,
  type TipoCategoriaFinanceira,
  type StatusCategoria,
  type FrequenciasRecorrencia,
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
