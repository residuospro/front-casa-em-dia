<template>
  <div
    class="grid grid-cols-[auto_1fr] h-screen"
    :class="
      sidebarAberto
        ? 'sm:!grid-cols-[auto_1fr] md:!grid-cols-[auto_1fr]'
        : 'sm:!grid-cols-[1fr] sm:!grid-rows-1 md:!grid-cols-[1fr] md:!grid-rows-1'
    "
  >
    <Sidebar />

    <div class="grid grid-rows-[8%_1fr_8%] h-screen">
      <div
        class="flex bg-[#FCFAF8] border-b border-[#ECE4D8] px-6 items-center justify-between"
      >
        <button @click="toggleSidebar" class="text-cinza_363637 transition">
          <svg-icon type="mdi" :path="mdiMenu" class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-2">
          <NotificacaoNaoLidas />

          <img
            v-if="perfil.fotoPerfil"
            :src="parseFotoPerfil(perfil.fotoPerfil)"
            class="object-cover w-8 h-8 rounded-full"
          />

          <div class="flex flex-col gap-1">
            <span class="text-sm font-medium">{{ perfil.nome }}</span>
            <ce-badge
              color="primary"
              rounded="lg"
              size="sm"
              status
              variant="solid"
            >
              <span>{{ parsePermissao(perfil.permissao) }}</span>
            </ce-badge>
          </div>
        </div>
      </div>

      <div class="relative w-full flex justify-start p-4">
        <!-- Fundo da aplicação -->
        <img
          src="/fundoConteudo.png"
          alt=""
          class="absolute inset-0 w-full h-full object-cover"
        />

        <!-- Overlay -->
        <div class="absolute inset-0" />

        <!-- Conteúdo (fica por cima) -->
        <div class="relative z-10 pb-20 w-full">
          <!-- pb-20 dá espaço no final -->
          <router-view />
        </div>
      </div>

      <div class="bg-[#FAF7F3] border-t border-[#ECE4D8]">footer</div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenu } from "@mdi/js";
import { useSidebar } from "@/components/sidebar/useSidebar";
import Sidebar from "@/components/sidebar/index.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { usePerfil } from "@/composables/usePerfil";
import { CeBadge } from "@comercti/vue-components";
import { useUtils } from "@/utils/useUtils";
import NotificacaoNaoLidas from "@/components/notificacao/naoLidas/index.vue";

const { toggleSidebar, sidebarAberto } = useSidebar();
const { perfil } = usePerfil();
const { parseFotoPerfil, parsePermissao } = useUtils();

const isDesktop = ref(false);
let mql: MediaQueryList | null = null;

function handleChange(e: MediaQueryListEvent | MediaQueryList) {
  isDesktop.value = e.matches;
}

onMounted(async () => {
  mql = window.matchMedia("(min-width: 1024px)");
  handleChange(mql);
  mql.addEventListener("change", handleChange);
});

onUnmounted(() => {
  mql?.removeEventListener("change", handleChange);
});
</script>

<style scoped>
.fundo {
  background-image: "/fundoLogin.png";
}
</style>
