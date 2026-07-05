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

type StatusExecucao =
  (typeof StatusExecucaoValues)[keyof typeof StatusExecucaoValues];

type TipoPessoa = (typeof TipoPessoaValues)[keyof typeof TipoPessoaValues];
type Categorias = (typeof CategoriaValues)[keyof typeof CategoriaValues];
type TipoTarefa = (typeof TipoTarefaValues)[keyof typeof TipoTarefaValues];
type ModoDistribuicao =
  (typeof ModoDistribuicaoValues)[keyof typeof ModoDistribuicaoValues];

export {
  CategoriaValues,
  TipoPessoaValues,
  TipoTarefaValues,
  ModoDistribuicaoValues,
  StatusExecucaoValues,
  type ModoDistribuicao,
  type TipoPessoa,
  type Categorias,
  type TipoTarefa,
  type StatusExecucao,
};
