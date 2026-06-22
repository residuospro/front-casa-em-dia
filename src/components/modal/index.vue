<template>
  <transition name="modal">
    <div
      v-if="abrirModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      @mousedown.self="emit('fecharModal')"
    >
      <div
        class="relative w-full max-w-2xl bg-white rounded-2xl border border-[#ECE4D8] shadow-sm overflow-auto max-h-[85vh]"
      >
        <!-- header -->
        <div
          class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#ECE4D8]"
        >
          <div>
            <h2 class="text-xl font-semibold text-[#363637]">
              {{ titulo }}
            </h2>

            <p v-if="subtitulo" class="text-sm text-black/60 mt-1">
              {{ subtitulo }}
            </p>
          </div>

          <button
            type="button"
            @click="emit('fecharModal')"
            class="h-8 w-8 rounded-full flex items-center justify-center text-black/40 hover:text-[#53864C] hover:bg-[#F2F4E9] transition"
          >
            ✕
          </button>
        </div>

        <form class="p-6" @submit.prevent="salvar">
          <div class="space-y-5">
            <slot />
          </div>

          <div class="flex justify-end gap-3 pt-6 mt-6">
            <button
              type="button"
              @click="emit('fecharModal')"
              class="flex-1 h-12 rounded-xl border border-black/10 text-black/70 hover:bg-black/5 transition"
            >
              Cancelar
            </button>

            <button
              v-if="salvar"
              type="submit"
              class="flex-1 h-12 rounded-xl bg-[#53864C] text-white font-medium hover:scale-[1.02] transition"
            >
              {{ textoBotao }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

<script setup lang="ts">
import { type PropType } from "vue";

const props = defineProps({
  abrirModal: {
    type: Boolean,
    required: true,
  },
  salvar: {
    type: Function as PropType<() => void>,
    required: false,
  },
  titulo: {
    type: String,
    required: false,
  },
  subtitulo: {
    type: String,
    required: false,
    default: "Preencha as informações abaixo",
  },
  textoBotao: {
    type: String,
    required: false,
    default: "Salvar",
  },
});

const emit = defineEmits<{
  (e: "fecharModal"): void;
}>();
</script>
