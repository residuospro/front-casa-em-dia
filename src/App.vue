<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-soft" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>

  <PWABadge />

  <Loading />
</template>

<script setup lang="ts">
import PWABadge from "./components/atualizarVersaoAplicacao.vue";
import Loading from "@/components/loading/index.vue";
import { useSessao } from "./utils/sessao";
import { onMounted, onUnmounted } from "vue";
import { useSocket } from "@/composables/useSocket";
import { useNotificacao } from "@/components/notificacao/useNotificacao.ts";
import { useApiNotificacao } from "./components/notificacao/useApiNotificacao.ts";
import type { INotificacao } from "./components/notificacao/tipagem.ts";

const { estaAutenticado, setBearerAuthorization } = useSessao();
const {
  socket,
  notificacoes,
  mostrarNotificacaoOS,
  solicitarPermissaoNotificacao,
} = useNotificacao();
const { listar, obterNotificacoesNaoLidas } = useApiNotificacao();
const { conectar } = useSocket();

if (estaAutenticado()) {
  setBearerAuthorization();
}

onMounted(() => {
  const estaDeslogado =
    globalThis.location.pathname === "/login" ||
    globalThis.location.pathname === "/cadastro";

  if (estaDeslogado) return;

  listar();

  socket.value = conectar();

  if (socket.value) {
    socket.value.on("notification:new", (data: INotificacao) => {
      const existe = notificacoes.value.some((n) => n.id === data.id);
      if (!existe) {
        notificacoes.value.unshift(data);
        mostrarNotificacaoOS(data);
        obterNotificacoesNaoLidas();
      }
    });
  }

  solicitarPermissaoNotificacao();
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off("notification:new");
  }
});
</script>
