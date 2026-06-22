import { useCadastrarDependente } from "./useCadastrarDependente";
import { useClient } from "@/client";
import { usePerfil } from "@/composables/usePerfil";
import { useApiListaMembros } from "@/components/minhaFamilia/lista/useApiListaMembros";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useUtils } from "@/utils/useUtils";

export const useApiCadastrarDependente = () => {
  const { limparNovoPedentende, novoDependente } = useCadastrarDependente();
  const { setarFormDataDependente } = useUtils();
  const { listarMembros } = useApiListaMembros();
  const { perfil } = usePerfil();

  const cadastrarNovoDependente = async (familiaId: string) => {
    const resposta = await useClient.post(
      `/families/${familiaId}/membros/dependentes`,
      setarFormDataDependente({ ...novoDependente.value }),
    );

    useRespostaApi(resposta.status);
    await listarMembros(perfil.value.familiaId);
    limparNovoPedentende();
  };
  return {
    cadastrarNovoDependente,
  };
};
