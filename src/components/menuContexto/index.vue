<template>
  <div ref="wrapperRef" class="relative inline-block">
    <div @click="abrir = !abrir">
      <slot />
    </div>

    <transition name="menu-fade">
      <div
        v-if="abrir"
        class="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#ECE4D8] shadow-lg z-50 overflow-hidden py-1"
      >
        <button
          v-for="item in items"
          :disabled="item.disabled"
          :key="item.value"
          type="button"
          class="w-full px-4 py-3 text-sm text-left text-[#363637] transition-colors flex items-center gap-3"
          :class="item.disabled ? 'hover:bg-slate-300' : ' hover:bg-[#F2F4E9]'"
          @click="selecionar(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface MenuItem {
  label: string;
  value: string;
  disabled: boolean;
}

const props = defineProps<{
  items: MenuItem[];
}>();

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const abrir = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const fechar = () => {
  abrir.value = false;
};

const selecionar = (value: string) => {
  emit("select", value);
  fechar();
};

const onClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    fechar();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", onClickOutside);
});
</script>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.15s ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
