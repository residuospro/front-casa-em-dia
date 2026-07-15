import { useClient } from "@/client";
import { useNovaTarefa } from "./useNovaTarefa";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import router from "@/router";
import type { IResponseTarefa } from "../tipagem";

export const useApiNovaTarefa = () => {
  const { perfil } = usePerfil();
  const {
    form,
    idTarefa,
    frequenciaAutomatica,
    frequenciaDefinida,
    setarFormRecorrencia,
    limparFormulario,
    limparRecorrencia,
  } = useNovaTarefa();

  const obterTarefaPorId = async (id: string) => {
    const resposta: AxiosResponse = await useClient.get(
      `/tarefas/${perfil.familiaId}/tarefas/${id}`,
    );

    if (resposta.status === 200) {
      form.value = resposta.data;
    }
  };

  const criarNovaTarefa = async () => {
    form.value.recorrencia = frequenciaDefinida.value.exibir
      ? setarFormRecorrencia()
      : null;

    const resposta: AxiosResponse<IResponseTarefa> = await useClient.post(
      `/tarefas/${perfil.familiaId}/tarefas`,
      { ...form.value, pontos: form.value.pontos ?? 0 },
    );

    useRespostaApi(resposta.status);
    limparFormulario();
    limparRecorrencia();
    frequenciaAutomatica.value = false;
  };

  const editarTarefa = async () => {
    form.value.recorrencia = frequenciaDefinida.value.exibir
      ? setarFormRecorrencia()
      : null;

    const resposta: AxiosResponse = await useClient.put(
      `/tarefas/${perfil.familiaId}/tarefas/${idTarefa.value}`,
      form.value,
    );

    useRespostaApi(resposta.status);
    router.push({
      name: "minhas-tarefas.visualizar-tarefa",
      query: { id: resposta.data.id },
    });
  };

  return {
    criarNovaTarefa,
    editarTarefa,
    obterTarefaPorId,
  };
};
