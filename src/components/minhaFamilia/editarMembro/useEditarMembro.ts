import { ref } from "vue";
import type { IFamiliaPessoa } from "../tipagem";

type Dependente = {
  nome: string;
  tipoPessoa: string;
  genero: string;
  fotoPerfil: string | null;
};

const abrirModalEdicao = ref(false);
const isDependente = ref(false);
const membroAtualizado = ref({
  tipoPessoa: "",
  permissao: "",
});

const dependenteAtualizado = ref<Dependente>({
  nome: "",
  tipoPessoa: "",
  genero: "",
  fotoPerfil: null,
});

const setFormDataDependente = () => {
  const formData = new FormData();

  formData.append("nome", dependenteAtualizado.value.nome);
  formData.append("tipoPessoa", dependenteAtualizado.value.tipoPessoa);
  formData.append("genero", dependenteAtualizado.value.genero);
  formData.append("fotoPerfil", dependenteAtualizado.value.fotoPerfil || "");

  return formData;
};
const setarMembroParaEdicao = (membroFamiliar: IFamiliaPessoa) => {
  abrirModalEdicao.value = true;

  if (membroFamiliar.dependente) {
    isDependente.value = true;
    dependenteAtualizado.value = {
      nome: membroFamiliar.nome,
      genero: membroFamiliar.genero,
      tipoPessoa: membroFamiliar.tipoPessoa,
      fotoPerfil: String(membroFamiliar.fotoPerfil),
    };

    return;
  }

  membroAtualizado.value = {
    permissao: membroFamiliar.permissao,
    tipoPessoa: membroFamiliar.tipoPessoa,
  };
};

export const useEditarMembro = () => {
  return {
    abrirModalEdicao,
    isDependente,
    membroAtualizado,
    dependenteAtualizado,
    setarMembroParaEdicao,
    setFormDataDependente,
  };
};
