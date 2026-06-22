import { useClient } from "@/client";
import { useMinhaFamilia } from "./useMinhaFamilia";
import type { AxiosResponse } from "axios";
import type { IFamilia, IFamiliaPessoa } from "./tipagem";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { usePerfil } from "@/composables/usePerfil";

export const useApiMinhaFamilia = () => {
  const { dataFamilia, abrirModalDeletar } = useMinhaFamilia();
  const { perfil } = usePerfil();

  const obterFamilia = async () => {
    const resposta: AxiosResponse<IFamilia[]> = await useClient.get(
      "/families/obterFamilia",
    );

    dataFamilia.value = resposta.data;
  };

  const deletarFamilia = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/families/${perfil.value.familiaId}`,
    );

    useRespostaApi(resposta.status);
    await obterFamilia();
    abrirModalDeletar.value = false;
  };

  return { obterFamilia, deletarFamilia };
};
