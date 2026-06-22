import { ref } from "vue";

const estadoInicial = { nome: "", genero: "", tipoPessoa: "", fotoPerfil: "" };

const novoDependente = ref({ ...estadoInicial });

const limparNovoPedentende = () => {
  novoDependente.value = { ...estadoInicial };
};

export const useCadastrarDependente = () => {
  return {
    novoDependente,
    limparNovoPedentende,
  };
};
