import { useClient } from "@/client";
import { useNovoCiclo } from "./useNovoCiclo";
import { usePerfil } from "@/store/usePerfil";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import type { AxiosResponse } from "axios";
import type { IResponseError } from "@/utils/interfaces";
import type { IResponseCiclos } from "./type";
import { useUtils } from "@/utils/useUtils";

export const useApiNovoCiclo = () => {
  const { form, idCiclo, limparForm } = useNovoCiclo();
  const { perfil } = usePerfil();
  const { formatarData } = useUtils();

  const criaNovoCiclo = async () => {
    try {
      const resposta: AxiosResponse = await useClient.post(
        `/ciclos/${perfil.familiaId}/ciclos`,
        form.value,
      );

      useRespostaApi(resposta.status);
      limparForm();
    } catch (error: unknown) {
      const erro = error as IResponseError;
      useRespostaApi(erro?.response?.status || 500, erro);
    }
  };

  const atualizarCiclo = async () => {
    try {
      const resposta: AxiosResponse = await useClient.put(
        `/ciclos/${perfil.familiaId}/ciclos/${idCiclo.value}`,
        form.value,
      );

      useRespostaApi(resposta.status);
    } catch (error: unknown) {
      const erro = error as IResponseError;
      useRespostaApi(erro?.response?.status || 500, erro);
    }
  };

  const obterCicloPorId = async () => {
    try {
      const resposta: AxiosResponse<IResponseCiclos> = await useClient.get(
        `/ciclos/${perfil.familiaId}/ciclos/${idCiclo.value}`,
      );

      form.value = {
        nome: resposta.data.nome,
        duracaoDias: resposta.data.duracaoDias,
        inicio: formatarData(resposta.data.inicio)
          .split("/")
          .reverse()
          .join("-"),
        ativo: resposta.data.ativo,
        descricao: "",
      };
    } catch (error: unknown) {
      const erro = error as IResponseError;
      useRespostaApi(erro?.response?.status || 500, erro);
    }
  };

  return {
    criaNovoCiclo,
    obterCicloPorId,
    atualizarCiclo,
  };
};
