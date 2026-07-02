import { useClient } from "@/client";
import { useMinhaFamilia } from "./useMinhaFamilia";
import type { AxiosResponse } from "axios";
import type { IFamilia } from "./tipagem";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { usePerfil } from "@/composables/usePerfil";
import type { IOpcoes } from "@/utils/interfaces";

export const useApiMinhaFamilia = () => {
  const { dataFamilia, abrirModalDeletar, opcoesFamiliares } =
    useMinhaFamilia();
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

  const obterOpcoesFamiliares = async () => {
    const resposta: AxiosResponse<IOpcoes[]> = await useClient.get(
      `/families/${perfil.value.familiaId}/membros/opcoes`,
    );

    opcoesFamiliares.value = resposta.data;
  };

  return { obterFamilia, deletarFamilia, obterOpcoesFamiliares };
};
