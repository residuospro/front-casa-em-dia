import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { ref } from "vue";

interface Perfil {
  nome: string;
  fotoPerfil: string | null;
  familia: string;
  totalMembros: number;
  permissao: "ADMIN" | "USUARIO";
  familiaId: string;
  id: string;
}

const perfil = ref<Perfil>({
  nome: "",
  fotoPerfil: null,
  familia: "",
  totalMembros: 0,
  permissao: "ADMIN",
  familiaId: "",
  id: "",
});

export const usePerfil = () => {
  const obterPerfil = async () => {
    const resposta: AxiosResponse<Perfil> =
      await useClient.get("/users/me/perfil");

    perfil.value = resposta.data;

    console.log("perfil", perfil.value);
  };

  return {
    perfil,
    obterPerfil,
  };
};
