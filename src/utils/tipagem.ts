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

const FrequenciaRecorrenciaFinanceiraValues = {
  DIARIA: "DIARIA",
  SEMANAL: "SEMANAL",
  MENSAL: "MENSAL",
  ANUAL: "ANUAL",
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
  AMBOS: "AMBOS",
} as const;

const StatusCategoriaValues = {
  ATIVA: "ATIVA",
  ARQUIVADA: "ARQUIVADA",
} as const;

const TipoLancamentoValues = {
  RECEITA: "RECEITA",
  DESPESA: "DESPESA",
  TRANSFERENCIA: "TRANSFERENCIA",
  AJUSTE: "AJUSTE",
} as const;

const StatusLancamentoValues = {
  PENDENTE: "PENDENTE",
  PAGO: "PAGO",
  CANCELADO: "CANCELADO",
  IGNORADO: "IGNORADO",
} as const;

const FormaPagamentoValues = {
  PIX: "PIX",
  DINHEIRO: "DINHEIRO",
  DEBITO: "DEBITO",
  CREDITO: "CREDITO",
  BOLETO: "BOLETO",
  TRANSFERENCIA: "TRANSFERENCIA",
  OUTRO: "OUTRO",
} as const;

const TipoMetaFinanceiraValues = {
  ECONOMIA: "ECONOMIA",
  QUITAR_DIVIDA: "QUITAR_DIVIDA",
  INVESTIMENTO: "INVESTIMENTO",
  OBJETIVO: "OBJETIVO",
} as const;

const StatusMetaFinanceiraValues = {
  EM_ANDAMENTO: "EM_ANDAMENTO",
  CONCLUIDA: "CONCLUIDA",
  CANCELADA: "CANCELADA",
} as const;

const TipoMovimentacaoMetaValues = {
  ENTRADA: "ENTRADA",
  SAIDA: "SAIDA",
} as const;

const IndicadorOrcamentoValues = {
  NORMAL: "NORMAL",
  PROXIMO: "PROXIMO",
  ULTRAPASSADO: "ULTRAPASSADO",
} as const;

type TipoConta = (typeof TipoContaValues)[keyof typeof TipoContaValues];
type FrequenciaRecorrenciaFinanceira =
  (typeof FrequenciaRecorrenciaFinanceiraValues)[keyof typeof FrequenciaRecorrenciaFinanceiraValues];
type Moeda = (typeof MoedaValues)[keyof typeof MoedaValues];
type TipoCartao = (typeof TipoCartaoValues)[keyof typeof TipoCartaoValues];
type TipoCategoriaFinanceira =
  (typeof TipoCategoriaFinanceiraValues)[keyof typeof TipoCategoriaFinanceiraValues];
type StatusCategoria =
  (typeof StatusCategoriaValues)[keyof typeof StatusCategoriaValues];
type TipoLancamento =
  (typeof TipoLancamentoValues)[keyof typeof TipoLancamentoValues];
type StatusLancamento =
  (typeof StatusLancamentoValues)[keyof typeof StatusLancamentoValues];
type FormaPagamento =
  (typeof FormaPagamentoValues)[keyof typeof FormaPagamentoValues];
type TipoMetaFinanceira =
  (typeof TipoMetaFinanceiraValues)[keyof typeof TipoMetaFinanceiraValues];
type StatusMetaFinanceira =
  (typeof StatusMetaFinanceiraValues)[keyof typeof StatusMetaFinanceiraValues];
type TipoMovimentacaoMeta =
  (typeof TipoMovimentacaoMetaValues)[keyof typeof TipoMovimentacaoMetaValues];
type IndicadorOrcamento =
  (typeof IndicadorOrcamentoValues)[keyof typeof IndicadorOrcamentoValues];
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
  FrequenciaRecorrenciaFinanceiraValues,
  TipoCartaoValues,
  TipoCategoriaFinanceiraValues,
  StatusCategoriaValues,
  TipoLancamentoValues,
  StatusLancamentoValues,
  FormaPagamentoValues,
  TipoMetaFinanceiraValues,
  StatusMetaFinanceiraValues,
  TipoMovimentacaoMetaValues,
  IndicadorOrcamentoValues,
  type Moeda,
  type TipoConta,
  type FrequenciaRecorrenciaFinanceira,
  type TipoCartao,
  type TipoCategoriaFinanceira,
  type StatusCategoria,
  type TipoLancamento,
  type StatusLancamento,
  type FormaPagamento,
  type TipoMetaFinanceira,
  type StatusMetaFinanceira,
  type TipoMovimentacaoMeta,
  type IndicadorOrcamento,
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
