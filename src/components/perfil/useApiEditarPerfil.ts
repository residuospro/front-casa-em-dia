import { useClient } from "@/client";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useEditarPerfil } from "./useEditarPerfil";
import { usePerfil } from "@/store/usePerfil";
import { useLoading } from "../loading/useLoading";

export const useApiEditarPerfil = () => {
  const { setarFormData, loading } = useEditarPerfil();
  const { obterPerfil } = usePerfil();
  const { ativarLoading, desativarLoading } = useLoading();

  const atualizarPerfil = async () => {
    loading.value = true;
    ativarLoading();

    const formData = setarFormData();

    try {
      const resposta = await useClient.put("/users/me/perfil", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      useRespostaApi(resposta.status);
      await obterPerfil();
    } finally {
      loading.value = false;
      desativarLoading();
    }
  };

  return { atualizarPerfil };
};
