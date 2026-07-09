<template>
  <div class="h-screen bg-[#fff] dark:bg-ce_black flex flex-col">
    <div
      class="flex bg-[#FCFAF8] border-b px-6 items-center justify-between h-16 shrink-0 z-20"
    >
      <button @click="toggleSidebar" class="text-cinza_363637 transition">
        <svg-icon type="mdi" :path="mdiMenu" class="w-6 h-6" />
      </button>

      <div class="flex items-center gap-4">
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

        <button @click="limparSessao('/login')">
          <svg-icon type="mdi" :path="mdiLogout" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div class="flex flex-1 min-h-0 relative">
      <Transition name="overlay">
        <div
          v-if="!isDesktop && sidebarAberto"
          class="fixed inset-0 bg-black/50 z-40"
          @click="fecharSidebar"
        />
      </Transition>

      <Sidebar />

      <main
        class="flex-1 min-w-0 relative overflow-auto bg-cover bg-center bg-no-repeat"
        style="background-image: url(&quot;/fundoConteudo.png&quot;)"
      >
        <div class="pb-20 w-full p-4">
          <router-view />
        </div>
      </main>
    </div>

    <div class="bg-[#FAF7F3] border-t shrink-0">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenu, mdiLogout } from "@mdi/js";
import { useSidebar } from "@/components/sidebar/useSidebar";
import Sidebar from "@/components/sidebar/index.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { usePerfil } from "@/store/usePerfil";
import { CeBadge } from "@comercti/vue-components";
import { useUtils } from "@/utils/useUtils";
import Footer from "@/components/footer/index.vue";
import { useSessao } from "@/utils/sessao";

const { limparSessao } = useSessao();
const { toggleSidebar, sidebarAberto, fecharSidebar } = useSidebar();
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
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
