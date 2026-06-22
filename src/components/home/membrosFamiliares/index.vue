<template>
  <div class="max-w-md bg-white rounded-3xl shadow-2xl">
    <!-- Cabeçalho -->
    <div class="p-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold text-gray-900">Membros da família</h1>
      <a
        href="#"
        class="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
      >
        Ver todos
        <span aria-hidden="true">→</span>
      </a>
    </div>

    <!-- Lista de membros -->
    <div class="divide-y divide-gray-100">
      <div
        v-for="member in displayedMembers"
        :key="member.id"
        class="py-2 px-4 flex items-center gap-2 hover:bg-gray-50 transition-colors group"
      >
        <!-- Avatar -->
        <img
          :src="member.avatar"
          :alt="member.name"
          class="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
        />

        <!-- Informações -->
        <div class="flex-1 min-w-0 flex flex-row justify-between">
          <p class="font-medium text-gray-900 text-[17px]">{{ member.name }}</p>
          <span
            :class="[
              'inline-block mt-1 px-3 py-0.5 text-xs font-medium rounded-full',
              member.badgeColor,
            ]"
          >
            {{ member.role }}
          </span>
        </div>

        <!-- Seta -->
        <div
          class="text-gray-300 group-hover:text-emerald-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// Dados mockados (pode ter mais de 4)
const allMembers = ref([
  {
    id: 1,
    name: "Kallif Abdon",
    role: "Administrador",
    avatar: "https://i.pravatar.cc/128?u=kallif",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 2,
    name: "Maria Abdon",
    role: "Esposa",
    avatar: "https://i.pravatar.cc/128?u=maria",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    name: "João Abdon",
    role: "Filho",
    avatar: "https://i.pravatar.cc/128?u=joao",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4,
    name: "Laura Abdon",
    role: "Filha",
    avatar: "https://i.pravatar.cc/128?u=laura",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    name: "Pedro Abdon",
    role: "Filho",
    avatar: "https://i.pravatar.cc/128?u=pedro",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 6,
    name: "Ana Abdon",
    role: "Filha",
    avatar: "https://i.pravatar.cc/128?u=ana",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
]);

// Limita a exibição a 4 membros
const displayedMembers = computed(() => allMembers.value.slice(0, 4));
</script>
