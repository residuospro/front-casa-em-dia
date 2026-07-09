<template>
  <div class="flex flex-row sm:flex-col gap-5 w-full">
    <div
      v-for="card in cards"
      :key="card.titulo"
      class="bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-5 w-full"
    >
      <div
        class="w-16 h-16 rounded-full flex items-center justify-center"
        :class="card.bg"
      >
        <svg-icon type="mdi" :path="card.icon" :class="card.color" />
      </div>

      <div class="flex-1">
        <div class="text-3xl font-semibold text-[#1C1F1F]">
          {{ card.valor }}
        </div>

        <div class="text-sm text-black/70 mt-1">
          {{ card.titulo }}
        </div>

        <button class="mt-3 text-sm font-medium text-[#53864C] hover:underline">
          {{ card.acao }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiCalendarCheck,
  mdiListBoxOutline,
  mdiAccountGroupOutline,
} from "@mdi/js";

const cards = [
  {
    titulo: "Tarefas pendentes",
    valor: 12,
    acao: "5 urgentes",
    icon: mdiListBoxOutline,
    bg: "bg-[#EEF5EA]",
    color: "text-[#53864C]",
  },

  {
    titulo: "Eventos hoje",
    valor: 3,
    acao: "Ver agenda",
    icon: mdiCalendarCheck,
    bg: "bg-[#FFF4D8]",
    color: "text-[#D39B00]",
  },

  {
    titulo: "Membros da família",
    valor: 4,
    acao: "Ver todos",
    icon: mdiAccountGroupOutline,
    bg: "bg-[#EEF5EA]",
    color: "text-[#53864C]",
  },
];
</script>
