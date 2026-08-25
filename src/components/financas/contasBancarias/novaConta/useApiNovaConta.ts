import { useNovaConta } from "./useNovaConta";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useContaBancaria } from "../useContasBancarias";
import { useApiContasBancarias } from "../useApiContasBancarias";

export const useApiNovaConta = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formConta } = useNovaConta();
  const { abriModalContaBancaria, contaEditando } = useContaBancaria();
  const { chamarApi } = useApiContasBancarias();

  const criarContaBancaria = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/contas`,
      formConta.value,
    );

    if (resposta.status === 201) {
      abriModalContaBancaria.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Conta criada com sucesso");
    }
  };

  const atualizarContaBancaria = async () => {
    if (!contaEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/contas/${contaEditando.value.id}`,
      {
        ...formConta.value,
        saldoInicial: Number(formConta.value.saldoInicial),
      },
    );

    if (resposta.status === 200) {
      abriModalContaBancaria.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Conta atualizada com sucesso");
    }
  };

  return {
    criarContaBancaria,
    atualizarContaBancaria,
  };
};
