import { TipoMetaFinanceiraValues } from "@/utils/tipagem";
import { computed, ref, watch } from "vue";
import { useUtils } from "@/utils/useUtils";
import { useMetas } from "../useMetas";

const { formartarValor, formatarReal } = useUtils();

const opcoesTipoMeta = [
  { text: "Objetivo", value: TipoMetaFinanceiraValues.OBJETIVO },
  { text: "Economia", value: TipoMetaFinanceiraValues.ECONOMIA },
  { text: "Quitar dívida", value: TipoMetaFinanceiraValues.QUITAR_DIVIDA },
  { text: "Investimento", value: TipoMetaFinanceiraValues.INVESTIMENTO },
];

const estadoInicialForm = () => ({
  titulo: "",
  descricao: "",
  tipo: "",
  valorObjetivo: 0,
  dataLimite: "",
  contaDestinoId: "",
  imagem: null as string | null,
});

const formMeta = ref(estadoInicialForm());

const { acao, abrirModalMeta, metaEditando } = useMetas();

const formatarParaInputDate = (data: string | Date | null) => {
  if (!data) return "";
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

watch(abrirModalMeta, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && metaEditando.value) {
    const { titulo, descricao, tipo, valorObjetivo, dataLimite, contaDestinoId } =
      metaEditando.value;

    formMeta.value = {
      titulo,
      descricao: descricao ?? "",
      tipo,
      valorObjetivo,
      dataLimite: formatarParaInputDate(dataLimite),
      contaDestinoId: contaDestinoId ?? "",
      imagem: null,
    };
  } else {
    formMeta.value = estadoInicialForm();
  }
});

const valorFormatado = computed({
  get() {
    if (formMeta.value.valorObjetivo === null) return "";
    return formatarReal(Number(formMeta.value.valorObjetivo));
  },
  set(novoValor: string) {
    formMeta.value = {
      ...formMeta.value,
      valorObjetivo: formartarValor(novoValor),
    };
  },
});

export const useNovaMeta = () => {
  return {
    opcoesTipoMeta,
    formMeta,
    valorFormatado,
  };
};