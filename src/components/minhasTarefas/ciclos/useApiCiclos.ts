import { useClient } from "@/client";
import { useCiclos } from "./useCiclos";
import type { IResponseCiclos } from "./type";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import type { IOpcoes, IResponseError } from "@/utils/interfaces";

export const useApiCiclos = () => {
  const { dataCiclos, ciclo, abrirModalDeletar, opcaoCiclo } = useCiclos();
  const { perfil } = usePerfil();

  const obterCiclos = async () => {
    const resposta: AxiosResponse<IResponseCiclos[]> = await useClient.get(
      `/ciclos/${perfil.familiaId}/ciclos`,
    );

    dataCiclos.value = resposta.data;
  };

  const deletarCiclo = async () => {
    const resposta: AxiosResponse = await useClient.delete(
      `/ciclos/${perfil.familiaId}/ciclos/${ciclo.value.id}`,
    );

    useRespostaApi(resposta.status);
    await obterCiclos();
    abrirModalDeletar.value = false;
  };

  const renovarCiclo = async (cicloId: string) => {
    const resposta: AxiosResponse = await useClient.post(
      `/ciclos/${perfil.familiaId}/ciclos/${cicloId}/rotacionar`,
    );

    useRespostaApi(resposta.status);
    await obterCiclos();
  };

  const atualizarStatusCiclo = async (id: string, ativo: boolean) => {
    try {
      const resposta: AxiosResponse = await useClient.patch(
        `/ciclos/${perfil.familiaId}/ciclos/${id}/ativo`,
        {
          ativo,
        },
      );

      useRespostaApi(resposta.status);
      await obterCiclos();
    } catch (error: unknown) {
      const erro = error as IResponseError;
      useRespostaApi(erro?.response?.status || 500, erro);
    }
  };

  const obterCicloAtivo = async () => {
    const resposta: AxiosResponse<IOpcoes[]> = await useClient.get(
      `/ciclos/${perfil.familiaId}/ciclos/ativos`,
    );

    opcaoCiclo.value = resposta.data;
  };

  return {
    obterCiclos,
    deletarCiclo,
    atualizarStatusCiclo,
    obterCicloAtivo,
    renovarCiclo,
  };
};
