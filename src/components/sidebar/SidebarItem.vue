<template>
  <div>
    <template v-if="item.children">
      <button
        @click="toggleSubmenu(item.label)"
        class="flex items-center w-full rounded-lg text-sm font-medium transition"
        :class="[
          isDesktop && !sidebarAberto
            ? 'justify-center px-0'
            : indentClasses(level),
          linkClasses(item),
        ]"
      >
        <svg-icon
          v-if="level === 0"
          type="mdi"
          :path="item.icone"
          class="w-5 h-5 shrink-0 my-2.5"
        />
        <span
          v-show="!isDesktop || sidebarAberto"
          class="whitespace-nowrap"
          :class="level === 0 ? 'ml-3 flex-1 text-left' : ''"
        >
          {{ item.label }}
        </span>
        <svg-icon
          v-show="!isDesktop || sidebarAberto"
          type="mdi"
          :path="mdiChevronDown"
          class="w-4 h-4 transition-transform ml-3"
          :class="{
            'rotate-180': submenuAbertos[item.label],
            'ml-[1.1rem]': level > 0,
          }"
        />
      </button>
      <div v-show="submenuAbertos[item.label]" class="space-y-1">
        <SidebarItem
          v-for="child in item.children"
          :key="child.label"
          :item="child"
          :level="level + 1"
          :is-desktop="isDesktop"
        />
      </div>
    </template>

    <router-link
      v-else-if="item.path"
      :to="item.path!"
      @click="!isDesktop && fecharSidebar()"
      class="flex items-center rounded-lg text-sm font-medium transition"
      :class="[
        isDesktop && !sidebarAberto
          ? 'justify-center px-0'
          : indentClasses(level),
        linkClasses(item),
      ]"
    >
      <svg-icon
        v-if="level === 0"
        type="mdi"
        :path="item.icone"
        class="w-5 h-5 shrink-0 my-2.5"
      />
      <span v-show="!isDesktop || sidebarAberto" class="whitespace-nowrap">
        {{ item.label }}
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";
import { useRoute } from "vue-router";
import {
  useSidebar,
  submenuAbertos,
  toggleSubmenu,
  type NavItem,
} from "./useSidebar";

const props = withDefaults(
  defineProps<{
    item: NavItem;
    level?: number;
    isDesktop?: boolean;
  }>(),
  {
    level: 0,
    isDesktop: false,
  },
);

const { item, level, isDesktop } = props;

const route = useRoute();
const { sidebarAberto, fecharSidebar } = useSidebar();

function indentClasses(nivel: number) {
  if (nivel === 0) return "px-3";
  if (nivel === 1) return "pl-10";
  if (nivel === 2) return "pl-12";
  return "pl-14";
}

function isPathActive(path?: string) {
  if (!path) return false;
  return route.path === path || (route.path.startsWith(path) && path !== "/");
}

function itemAtivo(itemNav: NavItem): boolean {
  return (
    isPathActive(itemNav.path) || itemNav.children?.some(itemAtivo) === true
  );
}

function linkClasses(itemNav: NavItem) {
  const ativo = itemAtivo(itemNav);
  return {
    "text-verde_53864c bg-verde_F2F4E9": ativo,
    "text-cinza_363637 hover:text-verde_53864c hover:bg-verde_F2F4E9": !ativo,
  };
}
</script>
