<template>
  <router-view v-slot="{ Component, route }" v-if="carregado">
    <transition name="fade-soft" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>

  <PWABadge />

  <Loading :show-loading="!carregado" />
</template>

<script setup lang="ts">
import PWABadge from "./components/atualizarVersao/atualizarVersaoAplicacao.vue";
import Loading from "@/components/loading/index.vue";
import { useSessao } from "./utils/sessao";
import { ref, onBeforeMount, onMounted, onUnmounted } from "vue";
import { onForegroundMessage } from "@/firebase/messaging";
import { useNotificacao } from "@/components/notificacao/useNotificacao.ts";
import { useApiNotificacao } from "./components/notificacao/useApiNotificacao.ts";
import { usePushNotifications } from "./composables/usePushNotifications.ts";

import { usePerfil } from "@/store/usePerfil";

const { setBearerAuthorization } = useSessao();
const { obterPerfil } = usePerfil();
const { solicitarPermissaoNotificacao } = useNotificacao();
const { listar } = useApiNotificacao();

const { registrarDispositivo } = usePushNotifications();

const temToken = !!localStorage.getItem("token");

const carregado = ref(!temToken);

if (temToken) {
  setBearerAuthorization();
}

onBeforeMount(async () => {
  if (!temToken) return;

  try {
    await obterPerfil();
  } catch (erro) {
    console.error("Erro ao carregar perfil:", erro);
  } finally {
    carregado.value = true;
  }
});

onMounted(async () => {
  const estaDeslogado = !localStorage.getItem("token");

  if (estaDeslogado) return;

  listar();

  // socket.value = conectar();

  // if (socket.value) {
  //   socket.value.on("notification:new", (data: any) => {
  //     const existe = notificacoes.value.some((n) => n.id === data.id);
  //     if (!existe) {
  //       notificacoes.value.unshift(data);
  //     }
  //   });
  // }

  solicitarPermissaoNotificacao();

  console.log("[FCM Debug] Iniciando registro de push...");
  const resultado = await registrarDispositivo();
  console.log("[FCM Debug] registrarDispositivo retornou:", resultado);

  onForegroundMessage((payload) => {
    console.log("[FCM Debug] Mensagem recebida em foreground:", payload);
    const titulo = payload.notification?.title ?? "Casa em Dia";
    const corpo = payload.notification?.body ?? "";

    if (!("Notification" in window) || Notification.permission !== "granted")
      return;

    new Notification(titulo, {
      body: corpo,
      icon: "/pwa-192.png",
    });
  });
});

onUnmounted(() => {
  // if (socket.value) {
  //   socket.value.off("notification:new");
  // }
});
</script>
