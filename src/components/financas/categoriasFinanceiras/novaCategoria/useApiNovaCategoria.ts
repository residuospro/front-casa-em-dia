import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { storeToRefs } from "pinia";
import { useCategorias } from "../useCategorias";
import { useApiCategorias } from "../useApiCategorias";
import { useNovaCategoria } from "./useNovaCategoria";
import type { CriarCategoriaDTO } from "./tipagem";

export const useApiNovaCategoria = () => {
  const { perfil } = storeToRefs(usePerfil());
  const { formCategoria } = useNovaCategoria();
  const { abriModalCategoria, categoriaEditando } = useCategorias();
  const { chamarApi } = useApiCategorias();

  const montarPayload = (): CriarCategoriaDTO => ({
    nome: formCategoria.value.nome,
    tipo: formCategoria.value.tipo as CriarCategoriaDTO["tipo"],
    cor: formCategoria.value.cor || null,
    icone: formCategoria.value.icone || null,
  });

  const criarCategoria = async () => {
    const resposta: AxiosResponse = await useClient.post(
      `/financeiro/${perfil.value.familiaId}/financeiro/categorias`,
      montarPayload(),
    );

    if (resposta.status === 201) {
      abriModalCategoria.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Categoria criada com sucesso");
    }
  };

  const atualizarCategoria = async () => {
    if (!categoriaEditando.value) return;

    const resposta: AxiosResponse = await useClient.put(
      `/financeiro/${perfil.value.familiaId}/financeiro/categorias/${categoriaEditando.value.id}`,
      {
        ...montarPayload(),
        status: formCategoria.value.ativo ? "ATIVA" : "ARQUIVADA",
      },
    );

    if (resposta.status === 200) {
      abriModalCategoria.value = false;
      await chamarApi();
      useRespostaApi(resposta.status, null, "Categoria atualizada com sucesso");
    }
  };

  return {
    criarCategoria,
    atualizarCategoria,
  };
};
