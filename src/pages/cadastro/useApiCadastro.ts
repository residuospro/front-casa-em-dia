import { useCadastro } from "./useCadastro";
import { useClient } from "@/client/index";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiCadastro = () => {
  const { usuario, loading } = useCadastro();

  const cadastrar = async () => {
    loading.value = true;

    const formData = new FormData();

    formData.append("nome", usuario.value.nome);
    formData.append("email", usuario.value.email);
    formData.append("senha", usuario.value.senha);
    formData.append("fotoPerfil", usuario.value.fotoPerfil || "");
    formData.append("genero", usuario.value.genero);

    try {
      const resposta = await useClient.post("/auth/cadastrar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (resposta.status === 201) {
        useRespostaApi(201);

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    cadastrar,
  };
};
