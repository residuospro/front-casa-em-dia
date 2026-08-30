import type { IConta } from "../../contasBancarias/tipagem";
import type { ICategoria } from "../../categoriasFinanceiras/tipagem";

type OpcaoCategoria = ICategoria;
type OpcaoConta = Pick<IConta, "id" | "nome">;

export type { OpcaoCategoria, OpcaoConta };