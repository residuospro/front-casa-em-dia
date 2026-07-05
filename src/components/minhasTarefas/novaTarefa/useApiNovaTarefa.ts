import { useClient } from "@/client";
import { useNovaTarefa } from "./useNovaTarefa";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiNovaTarefa = () => {
  const { perfil } = usePerfil();
  const { form, idTarefa, dataFim, horario, dataInicio, limparFormulario } =
    useNovaTarefa();

  const obterTarefaPorId = async (id: string) => {
    const resposta: AxiosResponse = await useClient.get(
      `/tarefas/${perfil.familiaId}/tarefas/${id}`,
    );

    if (resposta.status === 200) {
      form.value = resposta.data;

      const primeiraData = form.value?.execucoes[0]?.data;
      dataInicio.value = primeiraData || null;
      dataFim.value =
        form.value?.execucoes[form.value.execucoes.length - 1]?.data || null;
      horario.value = primeiraData
        ? new Date(primeiraData).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";
    }
  };

  const criarNovaTarefa = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/tarefas/${perfil.familiaId}/tarefas`,
      form.value,
    );

    useRespostaApi(resposta.status);
    limparFormulario();
  };

  const editarTarefa = async () => {
    const resposta: AxiosResponse = await useClient.put(
      `/tarefas/${perfil.familiaId}/tarefas/${idTarefa.value}`,
      form.value,
    );

    useRespostaApi(resposta.status);
  };

  return {
    criarNovaTarefa,
    editarTarefa,
    obterTarefaPorId,
  };
};
