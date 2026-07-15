import axios, { type AxiosInstance } from "axios";
import { useLoading } from "@/components/loading/useLoading";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

const { ativarLoading, desativarLoading } = useLoading();

const obterPathname = (url?: string): string => {
  if (!url) return "";

  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

let numeroRequisicoesAtivas = 0;

const incrementarRequisicoesAtivas = () => {
  numeroRequisicoesAtivas += 1;
};

const decrementarRequisicoesAtivas = () => {
  if (numeroRequisicoesAtivas > 0) {
    numeroRequisicoesAtivas -= 1;
  }
};

const isRotaIgnorada = (url?: string): boolean => {
  if (!url) return false;

  const pathname = obterPathname(url);

  const rotasIgnoradas = [
    /^\/notifications$/,
    /^\/users\/me\/perfil$/,
    /^\/notifications\/[^/]+\/read$/,
  ];
  return rotasIgnoradas.some((regex) => regex.test(pathname));
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const ignorarLoading = isRotaIgnorada(config.url);

  incrementarRequisicoesAtivas();
  if (!ignorarLoading) {
    ativarLoading();
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    decrementarRequisicoesAtivas();
    const ignorarLoading = isRotaIgnorada(response.config.url);

    if (!ignorarLoading && numeroRequisicoesAtivas === 0) desativarLoading();

    return response;
  },
  (error) => {
    decrementarRequisicoesAtivas();
    useRespostaApi(error.response?.status, error);

    const ignorarLoading = isRotaIgnorada(error.config?.url);

    if (!ignorarLoading && numeroRequisicoesAtivas === 0) desativarLoading();

    return Promise.reject(error);
  },
);

export const useClient = api;
