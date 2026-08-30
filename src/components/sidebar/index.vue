<template>
  <aside
    class="flex flex-col bg-white border-r overflow-hidden transition-all duration-300 z-50"
    :class="
      isDesktop
        ? sidebarAberto
          ? 'relative h-full w-64'
          : 'relative h-full w-auto'
        : sidebarAberto
          ? 'fixed left-0 top-0 h-full w-64 translate-x-0'
          : 'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 -translate-x-full'
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

    <nav class="flex-1 p-4 space-y-1 overflow-auto">
      <SidebarItem
        v-for="item in navItens"
        :key="item.label"
        :item="item"
        :level="0"
        :is-desktop="isDesktop"
      />
    </nav>

    <div
      class="w-full flex flex-row justify-end p-4 gap-2"
      v-if="sidebarAberto"
    >
      <span>Sair</span>
      <button @click="limparSessao('/login')">
        <svg-icon type="mdi" :path="mdiLogout" class="w-4 h-4" />
      </button>
    </div>

    <!-- <div class="w-full p-4 mb-5" v-if="sidebarAberto">
      <div class="overflow-hidden rounded-2xl bg-white shadow-sm border">
        <div
          class="h-16 bg-[#F5F4F0] px-5 py-4 flex items-center justify-between"
        >
          <div>
            <h3 class="text-base font-semibold text-[#1C1F1F]">
              {{ perfil.familia }}
            </h3>

            <p class="text-sm text-black/60">
              {{ perfil.totalMembros }} membros
            </p>
          </div>
        </div>

        <div class="h-20 overflow-hidden bg-[#F1F0E6]">
          <img src="/casinha.png" class="w-full h-full object-cover" />
        </div>
      </div>
    </div> -->
  </aside>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout } from "@mdi/js";
import { useSidebar } from "./useSidebar";
import SidebarItem from "./SidebarItem.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useSessao } from "@/utils/sessao";

const { limparSessao } = useSessao();

const { sidebarAberto, navItens } = useSidebar();

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
