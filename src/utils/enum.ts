export const TipoPessoaValues = {
  MARIDO: "MARIDO",
  ESPOSA: "ESPOSA",
  FILHO: "FILHO",
  FILHA: "FILHA",
  OUTRO: "OUTRO",
} as const;

export type TipoPessoa = typeof TipoPessoaValues[keyof typeof TipoPessoaValues];
