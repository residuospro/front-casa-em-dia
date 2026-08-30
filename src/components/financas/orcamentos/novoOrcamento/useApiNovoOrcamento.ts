import { useNovoOrcamento } from "./useNovoOrcamento";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useOrcamentos } from "../useOrcamentos";
import { useApiOrcamentos } from "../useApiOrcamentos";

export const useApiNovoOrcamento = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formOrcamento } = useNovoOrcamento();
  const { abrirModalOrcamento, orcamentoEditando } = useOrcamentos();
  const { buscar } = useApiOrcamentos();

  const montarPayload = () => ({
    categoriaId: formOrcamento.value.categoriaId,
    contaId: formOrcamento.value.contaId,
    mes: Number(formOrcamento.value.mes),
    ano: Number(formOrcamento.value.ano),
    valorLimite: Number(formOrcamento.value.valorLimite),
  });

  const criarOrcamento = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/orcamentos`,
      montarPayload(),
    );

    if (resposta.status === 201) {
      abrirModalOrcamento.value = false;
      await buscar();
      useRespostaApi(resposta.status, null, "Orçamento criado com sucesso");
    }
  };

  const atualizarOrcamento = async () => {
    if (!orcamentoEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/orcamentos/${orcamentoEditando.value.id}`,
      {
        valorLimite: Number(formOrcamento.value.valorLimite),
        contaId: formOrcamento.value.contaId,
      },
    );

    if (resposta.status === 200) {
      abrirModalOrcamento.value = false;
      await buscar();
      useRespostaApi(resposta.status, null, "Orçamento atualizado com sucesso");
    }
  };

  return {
    criarOrcamento,
    atualizarOrcamento,
  };
};