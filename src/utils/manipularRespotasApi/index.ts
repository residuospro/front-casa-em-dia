import { useNotificacoes } from "@/utils/notificacoes";
import { useSessao } from "../sessao";
import type { IResponseError } from "../interfaces";

export const useRespostaApi = (
  statusCode: number,
  res?: IResponseError | null,
  msg?: string,
) => {
  const { notificar } = useNotificacoes();
  const { limparSessao } = useSessao();

  const setarMsg = (message?: string | string[]) => {
    const mensagemErro =
      Array.isArray(message) && message.length > 0
        ? message.join("")
        : String(message) || "Algo deu errado, tente novamente mais tarde";

    notificar("ERROR", 5000, mensagemErro);
  };

  const respostasApi = {
    201: () => {
      notificar("SUCCESS", 3000, "Operação realizada com sucesso");
    },

    200: () => {
      notificar("SUCCESS", 3000, msg || "Operação realizada com sucesso");
    },

    204: () => {
      notificar("SUCCESS", 3000, msg || "Operação realizada com sucesso");
    },

    400: () => {
      const error = res?.response?.data;
      setarMsg(error?.message);
    },

    401: () => {
      const estaDeslogado =
        globalThis.location.pathname === "/login" ||
        globalThis.location.pathname === "/cadastro";

      if (estaDeslogado) return;

      const error = res?.response?.data;
      setarMsg(error?.message);

      setTimeout(() => {
        limparSessao("/login");
      }, 2000);
    },

    403: () => {
      notificar(
        "ERROR",
        5000,
        "Credienciais inválidas, por favor, verifique o e-mail e senha digitados.",
      );
    },

    404: () => {
      const error = res?.response?.data;

      setarMsg(error?.message);
    },

    500: () => {
      notificar(
        "ERROR",
        5000,
        "Erro interno do servidor, tente novamente mais tarde",
      );
    },

    default: () => {
      notificar("ERROR", 5000, "Algo deu errado, tente novamente mais tarde");
    },
  };

  const respostas =
    statusCode in respostasApi
      ? respostasApi[statusCode as keyof typeof respostasApi]
      : respostasApi.default;

  if (respostas) respostas();
};
