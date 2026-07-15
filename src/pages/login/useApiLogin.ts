import { useRoute } from "vue-router";
import { useLogin } from "./useLogin";
import { useClient } from "@/client/index";
import { useSessao } from "@/utils/sessao";

export const useApiLogin = () => {
  const route = useRoute();
  const { usuario } = useLogin();
  const { setToken } = useSessao();

  const login = async () => {
    const resposta = await useClient("/auth/login", {
      data: usuario.value,
      method: "post",
    });

    if (resposta.status === 200) {
      const redirectStorage = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");
      const redirect =
        (route.query.redirect as string) || redirectStorage || "/home";
      setToken(resposta.data.accessToken, redirect);
    }
  };

  return {
    login,
  };
};
