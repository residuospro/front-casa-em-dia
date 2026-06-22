import type { AxiosError } from "axios";
import { useNotificacoes } from "@/utils/notificacoes";
import { useSessao } from "../sessao";

interface IError {
  message: string;
}

export const useRespostaApi = (
  statusCode: number,
  res?: AxiosError,
  msg?: string,
) => {
  console.log("res", res);

  const { notificar } = useNotificacoes();
  const { limparSessao } = useSessao();

  const respostasApi = {
    201: () => {
      notificar("SUCCESS", 3000, "Operação realizada com sucesso");
    },

    200: () => {
      notificar("SUCCESS", 3000, msg || "Operação realizada com sucesso");
    },

    400: () => {
      const error = res?.response?.data as IError;
      notificar("ERROR", 5000, error.message);
    },

    401: () => {
      const error = res?.response?.data as IError;

      notificar("ERROR", 5000, error.message);

      setTimeout(() => {
        limparSessao();
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
      const error = res?.response?.data as IError;

      notificar(
        "ERROR",
        5000,
        error.message || "Algo deu errado, tente novamente mais tarde",
      );
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
