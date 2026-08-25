import { ref, watch } from "vue";
import { useTags } from "../useTags";

const estadoInicialForm = () => ({
  nome: "",
  cor: "#000000",
});

const formTag = ref(estadoInicialForm());

const { acao, abriModalTag, tagEditando } = useTags();

watch(abriModalTag, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && tagEditando.value) {
    const { nome, cor } = tagEditando.value;

    formTag.value = {
      nome,
      cor: cor ?? "#000000",
    };
  } else {
    formTag.value = estadoInicialForm();
  }
});

export const useNovaTag = () => {
  return {
    formTag,
  };
};
