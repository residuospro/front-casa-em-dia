<template>
  <div class="w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
    <div class="p-4">
      <h1 class="text-xl font-semibold text-gray-900">Tarefas urgentes</h1>
    </div>

    <div class="divide-y divide-gray-100">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="px-6 py-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
      >
        <!-- Checkbox -->
        <div class="flex-shrink-0">
          <div
            v-if="task.done"
            class="w-6 h-6 bg-emerald-500 rounded-xl flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 10l7-7m0 0l7 7"
              />
            </svg>
          </div>
          <div
            v-else
            class="w-6 h-6 border-2 border-gray-300 rounded-xl group-hover:border-gray-400 transition-colors"
          ></div>
        </div>

        <div class="flex flex-rows items-center justify-between w-full">
          <div class="flex-1 min-w-0 flex flex-row gap-2 items-center">
            <p
              :class="[
                'text-[17px] font-medium',
                task.done ? 'line-through text-gray-400' : 'text-gray-900',
              ]"
            >
              {{ task.title }}
            </p>

            <span
              :class="[
                'text-xs font-medium px-3 py-1 rounded-full',
                task.categoryColor,
              ]"
            >
              {{ task.category }}
            </span>
          </div>

          <div class="flex items-center gap-10">
            <span :class="['text-sm font-medium', task.dueColor]">
              {{ task.due }}
            </span>

            <img
              :src="task.avatar"
              :alt="task.title"
              class="w-9 h-9 rounded-2xl object-cover ring-2 ring-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 py-5 border-t text-center">
      <a
        href="#"
        class="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center justify-center gap-1 transition-colors"
      >
        Ver todas as tarefas
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tasks = ref([
  {
    id: 1,
    done: false,
    title: "Comprar mantimentos",
    category: "Casa",
    categoryColor: "bg-emerald-100 text-emerald-700",
    due: "Hoje",
    dueColor: "text-red-600",
    avatar: "https://i.pravatar.cc/128?u=mulher1",
  },
  {
    id: 2,
    done: false,
    title: "Pagar conta de luz",
    category: "Financeiro",
    categoryColor: "bg-amber-100 text-amber-700",
    due: "Hoje",
    dueColor: "text-red-600",
    avatar: "https://i.pravatar.cc/128?u=homem1",
  },
  {
    id: 3,
    done: false,
    title: "Levar o lixo para fora",
    category: "Casa",
    categoryColor: "bg-emerald-100 text-emerald-700",
    due: "Amanhã",
    dueColor: "text-gray-600",
    avatar: "https://i.pravatar.cc/128?u=garoto",
  },
  {
    id: 4,
    done: true,
    title: "Organizar documentos",
    category: "Pessoal",
    categoryColor: "bg-purple-100 text-purple-700",
    due: "Concluída",
    dueColor: "text-emerald-600",
    avatar: "https://i.pravatar.cc/128?u=mulher2",
  },
]);
</script>
