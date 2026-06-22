import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import type { IFamiliaPessoa } from "../tipagem";
import { useListaMembros } from "./useListaMembros";
import { useRespostaApi } from "@/utils/manipularRespotasApi";
import { useApiMinhaFamilia } from "../useApiMinhaFamilia";

export const useApiListaMembros = () => {
  const {
    dataMembrosFamiliares,
    sairDaFamilia,
    filtroAplicado,
    buscarMembro,
    fecharModalDeletar,
  } = useListaMembros();
  const { obterFamilia } = useApiMinhaFamilia();

  const listarMembros = async (familiaId?: string) => {
    const resposta: AxiosResponse<IFamiliaPessoa[]> = await useClient.get(
      `/families/${familiaId}/membros`,
    );

    dataMembrosFamiliares.value = resposta.data;
    filtroAplicado.value = false;
    buscarMembro.value = "";
  };

  const removerMembro = async (membroId?: string, familiaId?: string) => {
    const resposta = await useClient.delete(
      `/families/${familiaId}/membros/${membroId}`,
    );

    useRespostaApi(resposta.status);
    await listarMembros(familiaId);

    if (sairDaFamilia.value) obterFamilia();
    fecharModalDeletar();
  };

  const reenviarConvite = async (membroId?: string, familiaId?: string) => {
    const resposta = await useClient.post(
      `/families/${familiaId}/membros/${membroId}/re-enviar-convite`,
    );

    useRespostaApi(resposta.status);
    await listarMembros(familiaId);
  };

  const buscarMembroPorNomeOuEmail = async (
    termoBusca: string,
    familiaId?: string,
  ) => {
    const resposta: AxiosResponse<IFamiliaPessoa[]> = await useClient.get(
      `/families/${familiaId}/membros/busca`,
      {
        params: {
          termoBusca,
        },
      },
    );

    dataMembrosFamiliares.value = resposta.data;
    filtroAplicado.value = true;
  };

  const aceitarConvite = async (membro: IFamiliaPessoa) => {
    await useClient.post(`/families/convites/${membro.id}/responder`, {
      aceito: true,
    });

    await listarMembros(membro.familiaId);
  };

  const recusarConvite = async (membro: IFamiliaPessoa) => {
    await useClient.post(`/families/convites/${membro.id}/responder`, {
      aceito: false,
    });

    await listarMembros(membro.familiaId);
  };

  return {
    listarMembros,
    removerMembro,
    buscarMembroPorNomeOuEmail,
    reenviarConvite,
    aceitarConvite,
    recusarConvite,
  };
};
