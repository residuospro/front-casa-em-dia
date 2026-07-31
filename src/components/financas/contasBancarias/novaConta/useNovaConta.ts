import { MoedaValues, TipoContaValues } from "@/utils/tipagem";
import { computed, ref } from "vue";
import { useUtils } from "@/utils/useUtils";

const { formartarValor, formatarReal } = useUtils();
const opcoesTipoConta = [
  { text: "Conta corrente", value: TipoContaValues.CONTA_CORRENTE },
  { text: "Poupança", value: TipoContaValues.POUPANCA },
  { text: "Dinheiro", value: TipoContaValues.DINHEIRO },
  { text: "Investimento", value: TipoContaValues.INVESTIMENTO },
  { text: "Carteira", value: TipoContaValues.CARTEIRA },
];

const opcoesMoedas = [
  { text: "BRL", value: MoedaValues.BRL },
  { text: "EUR", value: MoedaValues.EUR },
  { text: "USD", value: MoedaValues.USD },
];

const formConta = ref({
  nome: "",
  instituicao: "",
  tipo: "",
  moeda: "",
  saldoInicial: 0,
});

const valorFormatado = computed({
  get() {
    if (formConta.value.saldoInicial === null) return "";
    return formatarReal(Number(formConta.value.saldoInicial));
  },
  set(novoValor: string) {
    formConta.value = {
      ...formConta.value,
      saldoInicial: formartarValor(novoValor),
    };
  },
});

export const useNovaConta = () => {
  return {
    opcoesMoedas,
    opcoesTipoConta,
    formConta,
    valorFormatado,
  };
};
