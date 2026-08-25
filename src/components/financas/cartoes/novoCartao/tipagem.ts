import type { TipoCartao } from "@/utils/tipagem";

type CriarCartaoDTO = {
  contaId: string;
  nome: string;
  tipo?: TipoCartao;
  bandeira?: string | null;
  limite?: number | null;
  fechamentoDia?: number | null;
  vencimentoDia?: number | null;
  melhorDiaCompra?: number | null;
};

export type { CriarCartaoDTO };
