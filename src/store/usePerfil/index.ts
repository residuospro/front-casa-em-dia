import { useClient } from "@/client";
import type { AxiosResponse } from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";
import type { Perfil } from "@/utils/tipagem";

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
    email: "",
    celular: null,
    genero: null,
    tipoPessoa: null,
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
