import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { useConvidarMembro } from "./useConvidarMembro";
import { useApiListaMembros } from "@/components/minhaFamilia/lista/useApiListaMembros";
import { useRespostaApi } from "@/utils/manipularRespotasApi";

export const useApiConvidarMembro = () => {
  const { novoMembro, limparNovoMembro } = useConvidarMembro();
  const { listarMembros } = useApiListaMembros();
  const { perfil } = usePerfil();

  const convidarMembro = async () => {
    const resposta = await useClient.post(
      `/families/${perfil.familiaId}/membros`,
      novoMembro.value,
    );

    useRespostaApi(resposta.status);
    await listarMembros(perfil.familiaId);
    limparNovoMembro();
  };

  return { convidarMembro };
};
