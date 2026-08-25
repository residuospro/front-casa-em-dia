import { computed, ref, watch } from "vue";
import { useSubcategorias } from "../useSubcategorias";
import { useCategorias } from "../../categoriasFinanceiras/useCategorias";

const estadoInicialForm = () => ({
  nome: "",
  categoriaId: "",
  ativo: true,
});

const formSubcategoria = ref(estadoInicialForm());

const { acao, abriModalSubcategoria, subcategoriaEditando, categoriaSelecionadaId } =
  useSubcategorias();
const { dataCategorias } = useCategorias();

const opcoesCategorias = computed(() =>
  dataCategorias.value.data.map((cat) => ({
    text: cat.nome,
    value: cat.id,
  })),
);

watch(abriModalSubcategoria, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && subcategoriaEditando.value) {
    const { nome, ativo } = subcategoriaEditando.value;

    formSubcategoria.value = {
      nome,
      categoriaId: subcategoriaEditando.value.categoriaId,
      ativo,
    };
  } else {
    formSubcategoria.value = {
      ...estadoInicialForm(),
      categoriaId: categoriaSelecionadaId.value ?? "",
    };
  }
});

export const useNovaSubcategoria = () => {
  return {
    formSubcategoria,
    opcoesCategorias,
  };
};
