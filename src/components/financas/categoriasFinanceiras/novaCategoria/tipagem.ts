import type { TipoCategoriaFinanceira } from "@/utils/tipagem";

type CriarCategoriaDTO = {
  nome: string;
  cor?: string | null;
  icone?: string | null;
  tipo: TipoCategoriaFinanceira;
};

export type { CriarCategoriaDTO };
