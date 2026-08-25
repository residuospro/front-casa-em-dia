import { TipoCategoriaFinanceiraValues } from "@/utils/tipagem";
import { ref, watch } from "vue";
import { useCategorias } from "../useCategorias";

const opcoesTipoCategoria = [
  { text: "Receita", value: TipoCategoriaFinanceiraValues.RECEITA },
  { text: "Despesa", value: TipoCategoriaFinanceiraValues.DESPESA },
];

const estadoInicialForm = () => ({
  nome: "",
  tipo: "",
  cor: "",
  icone: "",
  ativo: true,
});

const formCategoria = ref(estadoInicialForm());

const { acao, abriModalCategoria, categoriaEditando } = useCategorias();

watch(abriModalCategoria, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && categoriaEditando.value) {
    const { nome, tipo, cor, icone, status } = categoriaEditando.value;

    formCategoria.value = {
      nome,
      tipo: tipo ?? "",
      cor: cor ?? "",
      icone: icone ?? "",
      ativo: status === "ATIVA",
    };
  } else {
    formCategoria.value = estadoInicialForm();
  }
});

export const useNovaCategoria = () => {
  return {
    opcoesTipoCategoria,
    formCategoria,
  };
};
