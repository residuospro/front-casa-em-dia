import { useMovimentacaoMeta } from "./useMovimentacaoMeta";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useMetas } from "../useMetas";
import { useApiMetas } from "../useApiMetas";
import type { MovimentacaoMetaDTO } from "../tipagem";

export const useApiMovimentacaoMeta = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formMovimentacao } = useMovimentacaoMeta();
  const { abrirModalMovimentacao, metaMovimentando } = useMetas();
  const { chamarApi } = useApiMetas();

  const registrarMovimentacao = async () => {
    const metaId = metaMovimentando.value?.id;
    if (!metaId) return;

    const payload: MovimentacaoMetaDTO = {
      valor: Number(formMovimentacao.value.valor),
      tipo: formMovimentacao.value.tipo as MovimentacaoMetaDTO["tipo"],
      observacao: formMovimentacao.value.observacao || null,
    };

    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/metas/${metaId}/movimentacoes`,
      payload,
    );

    if (resposta.status === 201) {
      abrirModalMovimentacao.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Movimentação registrada com sucesso");
    }
  };

  return {
    registrarMovimentacao,
  };
};