import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "~pages";
import { useSessao } from "@/utils/sessao";
import { usePerfil } from "@/composables/usePerfil";
const { tokenExpirado, limparSessao, setBearerAuthorization } = useSessao();
const { obterPerfil } = usePerfil();

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const requiresAuth = to.meta.auth !== false;

  if (requiresAuth && tokenExpirado() && to.path !== "/login") {
    limparSessao();
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (!tokenExpirado() && to.path === "/login") {
    setBearerAuthorization();
    return "/home";
  }

  if (!tokenExpirado() && !["/login", "/cadastro"].includes(to.path)) {
    try {
      await obterPerfil();
    } catch {
      console.error("Erro ao obter perfil durante navegação");
    }
  }
});

export default router;
