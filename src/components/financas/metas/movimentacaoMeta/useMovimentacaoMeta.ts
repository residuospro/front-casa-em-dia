import { TipoMovimentacaoMetaValues } from "@/utils/tipagem";
import { computed, ref } from "vue";
import { useUtils } from "@/utils/useUtils";

const { formartarValor, formatarReal } = useUtils();

const opcoesMovimentacao = [
  { text: "Entrada", value: TipoMovimentacaoMetaValues.ENTRADA },
  { text: "Saída", value: TipoMovimentacaoMetaValues.SAIDA },
];

const estadoInicialForm = () => ({
  tipo: "",
  valor: 0,
  observacao: "",
});

const formMovimentacao = ref(estadoInicialForm());

const resetar = () => {
  formMovimentacao.value = estadoInicialForm();
};

const valorFormatado = computed({
  get() {
    if (formMovimentacao.value.valor === null) return "";
    return formatarReal(Number(formMovimentacao.value.valor));
  },
  set(novoValor: string) {
    formMovimentacao.value = {
      ...formMovimentacao.value,
      valor: formartarValor(novoValor),
    };
  },
});

export const useMovimentacaoMeta = () => {
  return {
    opcoesMovimentacao,
    formMovimentacao,
    valorFormatado,
    resetar,
  };
};