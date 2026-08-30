import { useNovaRecorrencia } from "./useNovaRecorrencia";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useRecorrencias } from "../useRecorrencias";
import { useApiRecorrencias } from "../useApiRecorrencias";

export const useApiNovaRecorrencia = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formRecorrencia } = useNovaRecorrencia();
  const { abriModalRecorrencia, recorrenciaEditando } = useRecorrencias();
  const { chamarApi } = useApiRecorrencias();

  const montarPayload = (): Record<string, any> => ({
    lancamentoModeloId: formRecorrencia.value.lancamentoModeloId,
    titulo: formRecorrencia.value.titulo,
    frequencia: formRecorrencia.value.frequencia,
    intervalo: formRecorrencia.value.intervalo,
    proximaExecucao: formRecorrencia.value.proximaExecucao,
  });

  const criarRecorrencia = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias`,
      montarPayload(),
    );

    if (resposta.status === 201) {
      abriModalRecorrencia.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Recorrência criada com sucesso");
    }
  };

  const atualizarRecorrencia = async () => {
    if (!recorrenciaEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/recorrencias/${recorrenciaEditando.value.id}`,
      {
        titulo: formRecorrencia.value.titulo,
        frequencia: formRecorrencia.value.frequencia,
        intervalo: formRecorrencia.value.intervalo,
        proximaExecucao: formRecorrencia.value.proximaExecucao,
      },
    );

    if (resposta.status === 200) {
      abriModalRecorrencia.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Recorrência atualizada com sucesso");
    }
  };

  return {
    criarRecorrencia,
    atualizarRecorrencia,
  };
};
