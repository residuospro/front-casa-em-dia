import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useSubcategorias } from "../useSubcategorias";
import { useApiSubcategorias } from "../useApiSubcategorias";
import { useNovaSubcategoria } from "./useNovaSubcategoria";
import type { CriarSubcategoriaDTO } from "./tipagem";

export const useApiNovaSubcategoria = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formSubcategoria } = useNovaSubcategoria();
  const { abriModalSubcategoria, subcategoriaEditando } = useSubcategorias();
  const { chamarApi } = useApiSubcategorias();

  const criarSubcategoria = async () => {
    const payload: CriarSubcategoriaDTO = {
      categoriaId: formSubcategoria.value.categoriaId,
      nome: formSubcategoria.value.nome,
    };

    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/subcategorias`,
      payload,
    );

    if (resposta.status === 201) {
      abriModalSubcategoria.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Subcategoria criada com sucesso");
    }
  };

  const atualizarSubcategoria = async () => {
    if (!subcategoriaEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/subcategorias/${subcategoriaEditando.value.id}`,
      {
        nome: formSubcategoria.value.nome,
        ativo: formSubcategoria.value.ativo,
      },
    );

    if (resposta.status === 200) {
      abriModalSubcategoria.value = false;
      await chamarApi();
      useRespostaApi(
        resposta.status,
        null,
        "Subcategoria atualizada com sucesso",
      );
    }
  };

  return {
    criarSubcategoria,
    atualizarSubcategoria,
  };
};
