<template>
  <aside
    class="h-full bg-white border-r border-[#ECE4D8] flex flex-col transition-all duration-300 overflow-hidden"
    :class="
      isDesktop
        ? sidebarAberto
          ? 'w-64 translate-x-0'
          : 'w-16 translate-x-0'
        : sidebarAberto
          ? 'w-64 translate-x-0'
          : 'w-64 -translate-x-full'
    "
  >
    <div
      v-if="sidebarAberto"
      class="flex items-center h-16 p-4 shrink-0 w-full justify-center gap-3 mt-5"
      :class="isDesktop && !sidebarAberto ? 'justify-center' : ''"
    >
      <img src="/icone.png" class="w-10 shrink-0" />
      <div class="flex flex-col justify-start">
        <span
          v-show="!isDesktop || sidebarAberto"
          class="text-verde_53864c font-semibold whitespace-nowrap"
        >
          Casa em dia
        </span>
        <span class="text-xs text-slate-400">Organize-se e viva melhor</span>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-hidden">
      <router-link
        v-for="item in navItens"
        :key="item.path"
        :to="item.path"
        @click="!isDesktop && fecharSidebar()"
        class="flex items-center rounded-lg text-sm font-medium transition"
        :class="[
          isDesktop && !sidebarAberto ? 'justify-center px-0' : 'px-3',
          linkClasses(item.path),
        ]"
      >
        <svg-icon
          type="mdi"
          :path="item.icone"
          class="w-5 h-5 shrink-0 my-2.5"
        />
        <span
          v-show="!isDesktop || sidebarAberto"
          class="ml-3 whitespace-nowrap"
        >
          {{ item.label }}
        </span>
      </router-link>
    </nav>

    <div class="w-full p-4 mb-5" v-if="sidebarAberto">
      <div
        class="overflow-hidden rounded-2xl bg-white shadow-sm border border-[#ECE4D8]"
      >
        <div
          class="h-24 bg-[#F5F4F0] px-5 py-4 flex items-center justify-between"
        >
          <div>
            <h3 class="text-lg font-semibold text-[#1C1F1F]">
              {{ perfil.familia }}
            </h3>

            <p class="text-sm text-black/60">
              {{ perfil.totalMembros }} membros
            </p>
          </div>
        </div>

        <div class="h-32 overflow-hidden bg-[#F1F0E6]">
          <img src="/casinha.png" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { useRoute } from "vue-router";
import { useSidebar } from "./useSidebar";
import { ref, onMounted, onUnmounted } from "vue";
import { usePerfil } from "@/composables/usePerfil";

const { perfil } = usePerfil();

const route = useRoute();
const { sidebarAberto, navItens, fecharSidebar } = useSidebar();

const isDesktop = ref(false);
let mql: MediaQueryList | null = null;

function handleChange(e: MediaQueryListEvent | MediaQueryList) {
  isDesktop.value = e.matches;
}

onMounted(() => {
  mql = window.matchMedia("(min-width: 1024px)");
  handleChange(mql);
  mql.addEventListener("change", handleChange);
});

onUnmounted(() => {
  mql?.removeEventListener("change", handleChange);
});

function linkClasses(path: string) {
  const ativo =
    route.path === path || (route.path.startsWith(path) && path !== "/");
  return {
    "text-verde_53864c bg-verde_F2F4E9": ativo,
    "text-cinza_363637 hover:text-verde_53864c hover:bg-verde_F2F4E9": !ativo,
  };
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
