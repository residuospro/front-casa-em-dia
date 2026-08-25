import { ref, watch } from "vue";
import { useCentroCustos } from "../useCentroCustos";

const estadoInicialForm = () => ({
  nome: "",
  cor: "#000000",
  icone: "",
  ativo: true,
});

const formCentroCusto = ref(estadoInicialForm());

const { acao, abriModalCentroCusto, centroCustoEditando } =
  useCentroCustos();

watch(abriModalCentroCusto, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && centroCustoEditando.value) {
    const { nome, cor, icone, ativo } = centroCustoEditando.value;

    formCentroCusto.value = {
      nome,
      cor: cor ?? "#000000",
      icone: icone ?? "",
      ativo,
    };
  } else {
    formCentroCusto.value = estadoInicialForm();
  }
});

export const useNovoCentroCusto = () => {
  return {
    formCentroCusto,
  };
};
