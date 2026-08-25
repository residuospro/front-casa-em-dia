import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useLancamentos } from "../useLancamentos";
import { useApiLancamentos } from "../useApiLancamentos";
import { useNovoLancamento } from "./useNovoLancamento";

export const useApiNovoLancamento = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formLancamento } = useNovoLancamento();
  const { abriModalLancamento, lancamentoEditando } = useLancamentos();
  const { chamarApi } = useApiLancamentos();

  const criarLancamento = async () => {
    const payload: Record<string, any> = {
      tipo: formLancamento.value.tipo,
      titulo: formLancamento.value.titulo,
      descricao: formLancamento.value.descricao || null,
      valor: formLancamento.value.valor,
      dataHora: formLancamento.value.dataHora,
      contaOrigemId: formLancamento.value.contaOrigemId,
      responsavelId: formLancamento.value.responsavelId,
    };

    if (formLancamento.value.contaDestinoId)
      payload.contaDestinoId = formLancamento.value.contaDestinoId;
    if (formLancamento.value.categoriaId)
      payload.categoriaId = formLancamento.value.categoriaId;
    if (formLancamento.value.subcategoriaId)
      payload.subcategoriaId = formLancamento.value.subcategoriaId;
    if (formLancamento.value.centroCustoId)
      payload.centroCustoId = formLancamento.value.centroCustoId;
    if (formLancamento.value.cartaoId)
      payload.cartaoId = formLancamento.value.cartaoId;
    if (formLancamento.value.formaPagamento)
      payload.formaPagamento = formLancamento.value.formaPagamento;
    if (formLancamento.value.tagsIds.length)
      payload.tagsIds = formLancamento.value.tagsIds;
    if (formLancamento.value.observacoes)
      payload.observacoes = formLancamento.value.observacoes;
    if (formLancamento.value.localizacao)
      payload.localizacao = formLancamento.value.localizacao;

    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos`,
      payload,
    );

    if (resposta.status === 201) {
      abriModalLancamento.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Lançamento criado com sucesso");
    }
  };

  const atualizarLancamento = async () => {
    if (!lancamentoEditando.value) return;

    const payload: Record<string, any> = {
      tipo: formLancamento.value.tipo,
      titulo: formLancamento.value.titulo,
      descricao: formLancamento.value.descricao || null,
      valor: formLancamento.value.valor,
      dataHora: formLancamento.value.dataHora,
      contaOrigemId: formLancamento.value.contaOrigemId,
      responsavelId: formLancamento.value.responsavelId,
      contaDestinoId: formLancamento.value.contaDestinoId || null,
      categoriaId: formLancamento.value.categoriaId || null,
      subcategoriaId: formLancamento.value.subcategoriaId || null,
      centroCustoId: formLancamento.value.centroCustoId || null,
      cartaoId: formLancamento.value.cartaoId || null,
      formaPagamento: formLancamento.value.formaPagamento || null,
      tagsIds: formLancamento.value.tagsIds,
      observacoes: formLancamento.value.observacoes || null,
      localizacao: formLancamento.value.localizacao || null,
    };

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos/${lancamentoEditando.value.id}`,
      payload,
    );

    if (resposta.status === 200) {
      abriModalLancamento.value = false;
      await chamarApi();
      useRespostaApi(
        resposta.status,
        null,
        "Lançamento atualizado com sucesso",
      );
    }
  };

  return {
    criarLancamento,
    atualizarLancamento,
  };
};
