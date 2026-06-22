<template>
  <div class="max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
    <!-- Cabeçalho -->
    <div class="p-4">
      <h1 class="text-xl font-semibold text-gray-900">Próximos eventos</h1>
    </div>

    <!-- Lista de eventos -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="event in events"
        :key="event.id"
        class="group px-6 py-2 flex items-center gap-2 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
      >
        <!-- Data -->
        <div
          :class="[
            'w-14 h-14 flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-sm font-semibold border',
            event.color,
          ]"
        >
          <span class="text-2xl leading-none font-bold">{{ event.day }}</span>
          <span class="text-xs tracking-widest mt-0.5">{{ event.month }}</span>
        </div>

        <!-- Conteúdo -->
        <div class="flex-1 min-w-0">
          <p class="text-[17px] font-medium text-gray-900 leading-tight mb-1">
            {{ event.title }}
          </p>
          <div class="flex items-center text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 01-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ event.time }}
          </div>
        </div>

        <!-- Seta -->
        <div
          class="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Rodapé -->
    <div class="px-6 py-5 border-t">
      <a
        href="#"
        class="flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
      >
        Ver calendário completo
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Dados mockados (fácil de trocar por API depois)
const events = ref([
  {
    id: 1,
    day: 24,
    month: "MAI",
    title: "Reunião familiar",
    time: "19:00",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: 2,
    day: 25,
    month: "MAI",
    title: "Aniversário da Maria",
    time: "Todo o dia",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },
  {
    id: 3,
    day: 28,
    month: "MAI",
    title: "Consulta médica",
    time: "10:30",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
]);
</script>
