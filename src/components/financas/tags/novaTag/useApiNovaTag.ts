import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useTags } from "../useTags";
import { useApiTags } from "../useApiTags";
import { useNovaTag } from "./useNovaTag";
import type { CriarTagDTO } from "./tipagem";

export const useApiNovaTag = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formTag } = useNovaTag();
  const { abriModalTag, tagEditando } = useTags();
  const { chamarApi } = useApiTags();

  const criarTag = async () => {
    const payload: CriarTagDTO = {
      nome: formTag.value.nome,
      cor: formTag.value.cor,
    };

    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/tags`,
      payload,
    );

    if (resposta.status === 201) {
      abriModalTag.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Tag criada com sucesso");
    }
  };

  const atualizarTag = async () => {
    if (!tagEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/tags/${tagEditando.value.id}`,
      {
        nome: formTag.value.nome,
        cor: formTag.value.cor,
      },
    );

    if (resposta.status === 200) {
      abriModalTag.value = false;
      await chamarApi();
      useRespostaApi(
        resposta.status,
        null,
        "Tag atualizada com sucesso",
      );
    }
  };

  return {
    criarTag,
    atualizarTag,
  };
};
