import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "~pages";
import { useSessao } from "@/utils/sessao";

const { tokenExpirado, limparSessao, setBearerAuthorization } = useSessao();

const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

///@ts-ignore
router.beforeEach((to, from) => {
  const requiresAuth = to.meta.auth !== false;

  if (requiresAuth && tokenExpirado() && to.path !== "/login") {
    limparSessao();
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  if (!tokenExpirado() && to.path === "/login") {
    setBearerAuthorization();
    return "/home";
  }
});

export default router;
