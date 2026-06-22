import { ref } from "vue";
import { useMinhaFamilia } from "../useMinhaFamilia";
import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { usePerfil } from "@/composables/usePerfil";
import { useApiMinhaFamilia } from "../useApiMinhaFamilia";

export const useEditarFamilia = () => {
  const nome = ref("");
  const { perfil } = usePerfil();
  const { editando } = useMinhaFamilia();
  const { obterFamilia } = useApiMinhaFamilia();

  const atualizarFamilia = async () => {
    const resposta: AxiosResponse = await useClient.put(
      `/families/${perfil.value.familiaId}`,
      { nome: nome.value },
    );

    useRespostaApi(resposta.status);
    editando.value = false;
    nome.value = "";
    await obterFamilia();
  };

  return { nome, atualizarFamilia };
};
