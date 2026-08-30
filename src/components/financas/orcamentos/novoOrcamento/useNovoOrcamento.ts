import { computed, ref, watch } from "vue";
import { useUtils } from "@/utils/useUtils";
import { useOrcamentos } from "../useOrcamentos";

const { formartarValor, formatarReal } = useUtils();
const {
  acao,
  abrirModalOrcamento,
  orcamentoEditando,
  opcoesMeses,
  opcoesAnos,
} = useOrcamentos();

const estadoInicialForm = () => ({
  categoriaId: "",
  contaId: "",
  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),
  valorLimite: 0,
});

const formOrcamento = ref(estadoInicialForm());
const categoriaNome = ref("");

watch(abrirModalOrcamento, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && orcamentoEditando.value) {
    const o = orcamentoEditando.value;

    formOrcamento.value = {
      categoriaId: o.categoriaId,
      contaId: o.contaId,
      mes: String(o.mes),
      ano: String(o.ano),
      valorLimite: o.valorLimite,
    };

    categoriaNome.value = o.categoria?.nome ?? "";
  } else {
    formOrcamento.value = estadoInicialForm();
    categoriaNome.value = "";
  }
});

const valorFormatado = computed({
  get() {
    if (formOrcamento.value.valorLimite === null) return "";
    return formatarReal(Number(formOrcamento.value.valorLimite));
  },
  set(novoValor: string) {
    formOrcamento.value = {
      ...formOrcamento.value,
      valorLimite: formartarValor(novoValor),
    };
  },
});

export const useNovoOrcamento = () => {
  return {
    formOrcamento,
    valorFormatado,
    categoriaNome,
    opcoesMeses,
    opcoesAnos,
  };
};