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

//@ts-ignore
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.meta.auth !== false;

  if (requiresAuth && tokenExpirado() && to.path !== "/login") {
    limparSessao();
    return next("/login");
  }

  if (!tokenExpirado() && to.path === "/login") {
    setBearerAuthorization();
    return next("/home");
  }

  if (!tokenExpirado() && !["/login", "/cadastro"].includes(to.path)) {
    await obterPerfil();
  }

  return next();
});

export default router;
