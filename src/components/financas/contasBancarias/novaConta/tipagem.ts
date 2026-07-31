import type { Moeda, TipoConta } from "@/utils/tipagem";

type CriarContaDTO = {
  nome: string;
  instituicao?: string | null;
  tipo: TipoConta;
  moeda?: Moeda;
  saldoInicial?: number;
  cor?: string | null;
  icone?: string | null;
};

export type { CriarContaDTO };
