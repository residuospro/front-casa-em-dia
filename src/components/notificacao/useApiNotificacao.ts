import { useClient } from "@/client";
import type { INotificacao } from "@/components/notificacao/tipagem";
import { useNotificacao } from "./useNotificacao";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import type { AxiosResponse } from "axios";

export function useApiNotificacao() {
  const { notificacoes, notificacoesNaoLidas } = useNotificacao();

  const listar = async () => {
    try {
      const resposta = await useClient.get("/notifications");
      notificacoes.value = resposta.data;
    } catch {
      notificacoes.value = [];
    }
  };

  const marcarComoLido = async (notificacaoId: string) => {
    await useClient.patch(`/notifications/${notificacaoId}/read`);
    await listar();
    await obterNotificacoesNaoLidas();
  };

  const marcarTodasComoLido = async () => {
    await useClient.patch("/notifications/read-all");
    await listar();
    await obterNotificacoesNaoLidas();
  };

  const excluirNotificacao = async (notificacaoId: string) => {
    const resposta: AxiosResponse = await useClient.delete(
      `/notifications/${notificacaoId}`,
    );

    useRespostaApi(resposta.status);
    await listar();
    await obterNotificacoesNaoLidas();
  };

  const aceitar = async (notificacao: INotificacao) => {
    const resposta: AxiosResponse = await useClient.post(
      `/families/convites/${notificacao.dados.membroId}/responder`,
      {
        aceito: true,
      },
    );

    useRespostaApi(resposta.status, undefined, "Convite aceito com sucesso");
    await listar();
    await marcarComoLido(notificacao.id);
  };

  const recusar = async (notificacao: INotificacao) => {
    const resposta: AxiosResponse = await useClient.post(
      `/families/convites/${notificacao.dados.membroId}/responder`,
      {
        aceito: false,
      },
    );

    useRespostaApi(resposta.status, undefined, "Convite recusado com sucesso");
    await listar();
    await marcarComoLido(notificacao.id);
  };

  const obterNotificacoesNaoLidas = async () => {
    const resposta: AxiosResponse<{ count: number }> = await useClient.get(
      "/notifications/unread-count",
    );

    notificacoesNaoLidas.value = resposta.data.count;
  };

  return {
    listar,
    aceitar,
    recusar,
    marcarComoLido,
    excluirNotificacao,
    marcarTodasComoLido,
    obterNotificacoesNaoLidas,
  };
}
