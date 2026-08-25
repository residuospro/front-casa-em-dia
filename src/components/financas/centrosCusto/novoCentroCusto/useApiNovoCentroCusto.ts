import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useCentroCustos } from "../useCentroCustos";
import { useApiCentroCustos } from "../useApiCentroCustos";
import { useNovoCentroCusto } from "./useNovoCentroCusto";
import type { CriarCentroCustoDTO } from "./tipagem";

export const useApiNovoCentroCusto = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formCentroCusto } = useNovoCentroCusto();
  const { abriModalCentroCusto, centroCustoEditando } = useCentroCustos();
  const { chamarApi } = useApiCentroCustos();

  const criarCentroCusto = async () => {
    const payload: CriarCentroCustoDTO = {
      nome: formCentroCusto.value.nome,
      cor: formCentroCusto.value.cor,
      icone: formCentroCusto.value.icone || null,
    };

    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/centros-custo`,
      payload,
    );

    if (resposta.status === 201) {
      abriModalCentroCusto.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Centro de custo criado com sucesso");
    }
  };

  const atualizarCentroCusto = async () => {
    if (!centroCustoEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/centros-custo/${centroCustoEditando.value.id}`,
      {
        nome: formCentroCusto.value.nome,
        cor: formCentroCusto.value.cor,
        icone: formCentroCusto.value.icone || null,
        ativo: formCentroCusto.value.ativo,
      },
    );

    if (resposta.status === 200) {
      abriModalCentroCusto.value = false;
      await chamarApi();
      useRespostaApi(
        resposta.status,
        null,
        "Centro de custo atualizado com sucesso",
      );
    }
  };

  return {
    criarCentroCusto,
    atualizarCentroCusto,
  };
};
