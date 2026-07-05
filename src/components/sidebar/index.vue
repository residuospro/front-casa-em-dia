<template>
  <aside
    class="flex flex-col bg-white border-r border-[#ECE4D8] overflow-hidden transition-all duration-300 z-50"
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

    <nav class="flex-1 p-4 space-y-1 overflow-hidden">
      <template v-for="item in navItens" :key="item.label">
        <div v-if="item.children" class="space-y-1">
          <button
            @click="toggleSubmenu(item.label)"
            class="flex items-center w-full rounded-lg text-sm font-medium transition"
            :class="[
              isDesktop && !sidebarAberto ? 'justify-center px-0' : 'px-3',
              parentLinkClasses(item),
            ]"
          >
            <svg-icon
              type="mdi"
              :path="item.icone"
              class="w-5 h-5 shrink-0 my-2.5"
            />
            <span
              v-show="!isDesktop || sidebarAberto"
              class="ml-3 whitespace-nowrap flex-1 text-left"
            >
              {{ item.label }}
            </span>
            <svg-icon
              v-show="!isDesktop || sidebarAberto"
              type="mdi"
              :path="mdiChevronDown"
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': submenuAbertos[item.label] }"
            />
          </button>
          <div v-show="submenuAbertos[item.label]" class="space-y-1">
            <template v-for="child in item.children" :key="child.label">
              <router-link
                v-if="child.path"
                :to="child.path!"
                @click="!isDesktop && fecharSidebar()"
                class="flex items-center rounded-lg text-sm font-medium transition pl-11"
                :class="childLinkClasses(child.path)"
              >
                <span
                  v-show="!isDesktop || sidebarAberto"
                  class="whitespace-nowrap"
                >
                  {{ child.label }}
                </span>
              </router-link>
            </template>
          </div>
        </div>

        <router-link
          v-else-if="item.path"
          :to="item.path!"
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
      </template>
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
import { mdiChevronDown } from "@mdi/js";
import { useRoute } from "vue-router";
import { useSidebar, type NavItem } from "./useSidebar";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { usePerfil } from "@/store/usePerfil";

const { perfil } = usePerfil();

const route = useRoute();
const { sidebarAberto, navItens, fecharSidebar } = useSidebar();

const submenuAbertos = reactive<Record<string, boolean>>({});

const toggleSubmenu = (label: string) => {
  submenuAbertos[label] = !submenuAbertos[label];
};

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

function isPathActive(path?: string) {
  if (!path) return false;
  return route.path === path || (route.path.startsWith(path) && path !== "/");
}

function linkClasses(path?: string) {
  const ativo = isPathActive(path);
  return {
    "text-verde_53864c bg-verde_F2F4E9": ativo,
    "text-cinza_363637 hover:text-verde_53864c hover:bg-verde_F2F4E9": !ativo,
  };
}

function childLinkClasses(path?: string) {
  const ativo = route.path === path;
  return {
    "text-verde_53864c bg-verde_F2F4E9": ativo,
    "text-cinza_363637 hover:text-verde_53864c hover:bg-verde_F2F4E9": !ativo,
  };
}

function parentLinkClasses(item: NavItem) {
  const ativo =
    isPathActive(item.path) ||
    item.children?.some((child) => child.path && route.path === child.path);
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
