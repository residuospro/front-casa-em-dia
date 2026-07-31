import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useContaBancaria } from "./useContasBancarias";
import { storeToRefs } from "pinia";
import type { IResponseContas } from "./tipagem";

export const useApiContasBancarias = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { parametros, manipularResposta, resetarParametros } =
    useContaBancaria();

  const chamarApi = async () => {
    try {
      const resposta: AxiosResponse<IResponseContas> = await useClient.get(
        `/financeiro/${perfil.value.familiaId}/financeiro/contas`,
        {
          params: parametros.value,
        },
      );

      console.log("res", resposta);

      manipularResposta(resposta.data);
    } catch {
      resetarParametros();
    }
  };

  return {
    chamarApi,
  };
};
