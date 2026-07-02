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
  type ModoDistribuicao,
  type TipoPessoa,
  type Categorias,
  type TipoTarefa,
};
