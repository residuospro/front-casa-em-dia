import { ref } from "vue";

const estadoInical = {
  email: "",
  permissao: "",
  tipoPessoa: "",
};

const novoMembro = ref({ ...estadoInical });

const limparNovoMembro = () => {
  novoMembro.value = { ...estadoInical };
};

export const useConvidarMembro = () => {
  return { novoMembro, limparNovoMembro };
};
