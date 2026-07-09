import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

interface Perfil {
  nome: string;
  fotoPerfil: string | null;
  familia: string;
  totalMembros: number;
  permissao: "ADMIN" | "USUARIO";
  familiaId: string;
  id: string;
  usuarioId: string;
}

export const usePerfil = defineStore("perfil", () => {
  const perfil = ref<Perfil>({
    nome: "",
    fotoPerfil: null,
    familia: "",
    totalMembros: 0,
    permissao: "ADMIN",
    familiaId: "",
    id: "",
    usuarioId: "",
  });

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
});
