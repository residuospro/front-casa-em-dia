import { TipoCartaoValues } from "@/utils/tipagem";
import { computed, ref, watch } from "vue";
import { useUtils } from "@/utils/useUtils";
import { useCartoes } from "../useCartoes";
import { useContaBancaria } from "../../contasBancarias/useContasBancarias";

const { formartarValor, formatarReal } = useUtils();

const opcoesTipoCartao = [
  { text: "Crédito", value: TipoCartaoValues.CREDITO },
  { text: "Débito", value: TipoCartaoValues.DEBITO },
  { text: "Ambos", value: TipoCartaoValues.AMBOS },
];

const opcoesDias = Array.from({ length: 31 }, (_, index) => ({
  text: String(index + 1),
  value: String(index + 1),
}));

const estadoInicialForm = () => ({
  nome: "",
  contaId: "",
  tipo: "",
  bandeira: "",
  limite: 0,
  fechamentoDia: "",
  vencimentoDia: "",
  melhorDiaCompra: "",
  ativo: false,
});

const formCartao = ref(estadoInicialForm());

const { acao, abriModalCartao, cartaoEditando } = useCartoes();
const { dataContas } = useContaBancaria();

const opcoesContas = computed(() =>
  dataContas.value.data.map((conta) => ({
    text: conta.nome,
    value: conta.id,
  })),
);

watch(abriModalCartao, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && cartaoEditando.value) {
    const {
      nome,
      contaId,
      tipo,
      bandeira,
      limite,
      fechamentoDia,
      vencimentoDia,
      melhorDiaCompra,
      ativo,
    } = cartaoEditando.value;

    formCartao.value = {
      nome,
      contaId,
      tipo: tipo ?? "",
      bandeira: bandeira ?? "",
      limite: limite ?? 0,
      fechamentoDia: fechamentoDia ? String(fechamentoDia) : "",
      vencimentoDia: vencimentoDia ? String(vencimentoDia) : "",
      melhorDiaCompra: melhorDiaCompra ? String(melhorDiaCompra) : "",
      ativo,
    };
  } else {
    formCartao.value = estadoInicialForm();
  }
});

const valorFormatado = computed({
  get() {
    if (formCartao.value.limite === null) return "";
    return formatarReal(Number(formCartao.value.limite));
  },
  set(novoValor: string) {
    formCartao.value = {
      ...formCartao.value,
      limite: formartarValor(novoValor),
    };
  },
});

export const useNovoCartao = () => {
  return {
    opcoesTipoCartao,
    opcoesDias,
    opcoesContas,
    formCartao,
    valorFormatado,
  };
};
