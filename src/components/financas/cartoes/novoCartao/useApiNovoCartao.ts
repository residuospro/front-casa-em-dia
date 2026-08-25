import { useNovoCartao } from "./useNovoCartao";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import type { CriarCartaoDTO } from "./tipagem";
import { useCartoes } from "../useCartoes";
import { useApiCartoes } from "../useApiCartoes";

export const useApiNovoCartao = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formCartao } = useNovoCartao();
  const { abriModalCartao, cartaoEditando } = useCartoes();
  const { chamarApi } = useApiCartoes();

  const montarPayload = (): CriarCartaoDTO => {
    const converterDia = (valor: string) => (valor ? Number(valor) : null);

    return {
      contaId: formCartao.value.contaId,
      nome: formCartao.value.nome,
      tipo: formCartao.value.tipo
        ? (formCartao.value.tipo as CriarCartaoDTO["tipo"])
        : undefined,
      bandeira: formCartao.value.bandeira || null,
      limite: Number(formCartao.value.limite),
      fechamentoDia: converterDia(formCartao.value.fechamentoDia),
      vencimentoDia: converterDia(formCartao.value.vencimentoDia),
      melhorDiaCompra: converterDia(formCartao.value.melhorDiaCompra),
    };
  };

  const criarCartao = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/cartoes`,
      montarPayload(),
    );

    if (resposta.status === 201) {
      abriModalCartao.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Cartão criado com sucesso");
    }
  };

  const atualizarCartao = async () => {
    if (!cartaoEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/cartoes/${cartaoEditando.value.id}`,
      {
        ...montarPayload(),
        ativo: formCartao.value.ativo,
      },
    );

    if (resposta.status === 200) {
      abriModalCartao.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Cartão atualizado com sucesso");
    }
  };

  return {
    criarCartao,
    atualizarCartao,
  };
};
