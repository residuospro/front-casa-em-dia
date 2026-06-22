import { useClient } from "@/client";
import { useEditarMembro } from "./useEditarMembro";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiEditarMembro = () => {
  const {
    isDependente,
    setFormDataDependente,
    membroAtualizado,
    abrirModalEdicao,
  } = useEditarMembro();

  const atualizarMembro = async (
    callback: (familiaId?: string | undefined) => Promise<void>,
    membroId?: string,
    familiaId?: string,
  ) => {
    const dados = isDependente.value
      ? setFormDataDependente()
      : membroAtualizado.value;

    const resposta = await useClient.put(
      `/families/${familiaId}/membros/${membroId}`,
      dados,
    );

    useRespostaApi(resposta.status);
    await callback(familiaId);
    abrirModalEdicao.value = false;
    isDependente.value = false;
  };

  return { atualizarMembro };
};
