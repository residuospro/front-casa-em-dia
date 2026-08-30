import { useNovaMeta } from "./useNovaMeta";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useMetas } from "../useMetas";
import { useApiMetas } from "../useApiMetas";

export const useApiNovaMeta = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formMeta } = useNovaMeta();
  const { abrirModalMeta, metaEditando } = useMetas();
  const { chamarApi } = useApiMetas();

  const montarPayload = (): Record<string, any> => ({
    titulo: formMeta.value.titulo,
    descricao: formMeta.value.descricao || null,
    tipo: formMeta.value.tipo,
    valorObjetivo: Number(formMeta.value.valorObjetivo),
    dataLimite: formMeta.value.dataLimite || null,
    contaDestinoId: formMeta.value.contaDestinoId || null,
  });

  const criarMeta = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/metas`,
      montarPayload(),
    );

    if (resposta.status === 201) {
      abrirModalMeta.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Meta criada com sucesso");
    }
  };

  const atualizarMeta = async () => {
    if (!metaEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/metas/${metaEditando.value.id}`,
      montarPayload(),
    );

    if (resposta.status === 200) {
      abrirModalMeta.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Meta atualizada com sucesso");
    }
  };

  return {
    criarMeta,
    atualizarMeta,
  };
};