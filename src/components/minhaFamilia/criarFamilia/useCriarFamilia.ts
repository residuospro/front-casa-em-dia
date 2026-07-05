import { ref } from "vue";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useClient } from "@/client";
import { useApiMinhaFamilia } from "../useApiMinhaFamilia";

export const useCriarFamilia = () => {
  const estadoInicial = { nome: "", tipoPessoa: "" };
  const familia = ref({ ...estadoInicial });
  const { obterPerfil } = usePerfil();
  const { obterFamilia } = useApiMinhaFamilia();

  const limparFamilia = () => {
    familia.value = { ...estadoInicial };
  };

  const criarFamilia = async () => {
    const resposta: AxiosResponse = await useClient.post(
      "/families",
      familia.value,
    );

    useRespostaApi(resposta.status);
    await Promise.all([obterFamilia(), obterPerfil()]);
    limparFamilia();
  };

  return {
    familia,
    limparFamilia,
    criarFamilia,
  };
};
