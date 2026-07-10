import type { Perfil, UsuarioEdit } from "@/utils/tipagem";
import { ref, computed } from "vue";
import { usePerfil } from "@/store/usePerfil";

const { perfil } = usePerfil();

const usuario = ref<UsuarioEdit>({
  nome: "",
  email: "",
  celular: null,
  senha: "",
  confirmarSenha: "",
  genero: null,
  tipoPessoa: null,
  fotoPerfil: null,
});

const setarUsuario = (user: Perfil) => {
  usuario.value.nome = user.nome;
  usuario.value.email = user.email;
  usuario.value.celular = user.celular;
  usuario.value.genero = user.genero;
  usuario.value.tipoPessoa = user.tipoPessoa;
};

const fotoPreview = ref<string | null>(null);

const showSenha = ref(false);
const showConfirmarSenha = ref(false);
const loading = ref(false);
const erros = ref({
  nome: "",
  email: "",
  celular: "",
  senha: "",
  confirmarSenha: "",
  genero: "",
  tipoPessoa: "",
});

const toggleShowSenha = () => {
  showSenha.value = !showSenha.value;
};

const toggleShowConfirmarSenha = () => {
  showConfirmarSenha.value = !showConfirmarSenha.value;
};

const validarSenha = (senha: string): boolean => {
  if (!senha) return true;
  if (senha.length < 6) return false;
  if (!/[A-Z]/.test(senha)) return false;
  if (!/\d/.test(senha)) return false;
  if (!/[^a-zA-Z0-9]/.test(senha)) return false;
  return true;
};

const formularioValido = computed(() => {
  return (
    usuario.value.nome.trim() !== "" &&
    usuario.value.email.trim() !== "" &&
    usuario.value.genero !== null &&
    usuario.value.tipoPessoa !== null
  );
});

const setarFormData = () => {
  const formData = new FormData();

  formData.append("nome", usuario.value.nome);
  formData.append("email", usuario.value.email);

  if (usuario.value.celular) {
    formData.append("celular", usuario.value.celular);
  }

  if (usuario.value.genero) {
    formData.append("genero", usuario.value.genero);
  }

  if (usuario.value.tipoPessoa) {
    formData.append("tipoPessoa", usuario.value.tipoPessoa);
  }

  formData.append("familiaId", perfil.familiaId);

  if (usuario.value.senha) {
    formData.append("senha", usuario.value.senha);
  }

  if (usuario.value.fotoPerfil instanceof File) {
    formData.append("fotoPerfil", usuario.value.fotoPerfil);
  }

  return formData;
};

const validar = () => {
  erros.value.nome = !usuario.value.nome.trim() ? "Nome é obrigatório" : "";
  erros.value.email = !usuario.value.email.trim() ? "Email é obrigatório" : "";
  erros.value.celular = !usuario.value.celular ? "Celular é obrigatório" : "";
  erros.value.genero = !usuario.value.genero ? "Gênero é obrigatório" : "";
  erros.value.tipoPessoa = !usuario.value.tipoPessoa
    ? "Tipo de pessoa é obrigatório"
    : "";

  if (usuario.value.senha && !validarSenha(usuario.value.senha)) {
    erros.value.senha =
      "A senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, um número e um caractere especial";
  } else {
    erros.value.senha = "";
  }

  erros.value.confirmarSenha =
    usuario.value.senha !== usuario.value.confirmarSenha
      ? "As senhas não conferem"
      : "";
};

const limparErros = () => {
  erros.value = {
    nome: "",
    email: "",
    celular: "",
    senha: "",
    confirmarSenha: "",
    genero: "",
    tipoPessoa: "",
  };
};

const setarFotoPreview = (arquivo: File | string | null) => {
  if (!arquivo) {
    fotoPreview.value = null;
    return;
  }

  if (typeof arquivo === "string") {
    fotoPreview.value = arquivo;
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    fotoPreview.value = reader.result as string;
  };

  reader.readAsDataURL(arquivo);
};

export function useEditarPerfil() {
  return {
    usuario,
    fotoPreview,
    showSenha,
    showConfirmarSenha,
    loading,
    erros,
    formularioValido,
    toggleShowSenha,
    toggleShowConfirmarSenha,
    validar,
    limparErros,
    validarSenha,
    setarFotoPreview,
    setarUsuario,
    setarFormData,
  };
}
