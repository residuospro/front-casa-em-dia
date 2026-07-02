import { useClient } from "@/client";
import { useNovaTarefa } from "./useNovaTarefa";
import { usePerfil } from "@/composables/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiNovaTarefa = () => {
  const { perfil } = usePerfil();
  const { form } = useNovaTarefa();

  const criarNovaTarefa = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/tarefas/${perfil.value.familiaId}/tarefas`,
      form.value,
    );

    useRespostaApi(resposta.status);
  };

  return {
    criarNovaTarefa,
  };
};
