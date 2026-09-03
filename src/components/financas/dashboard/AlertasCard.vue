<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">Alertas importantes</h2>

    <div
      v-if="!itens.length"
      class="flex items-center justify-center text-sm text-[#667085] py-4"
    >
      Nenhum alerta
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="alerta in itens"
        :key="alerta.titulo"
        class="flex items-center gap-3 py-3"
      >
        <div
          :class="
            alerta.tipo === 'CRITICO'
              ? 'text-[#e53935] bg-red-100 rounded-xl px-4 py-2'
              : 'text-[#f59e0b] bg-amber-100 rounded-xl px-4 py-2'
          "
          class="text-lg shrink-0"
        >
          {{ alerta.tipo === "CRITICO" ? "!" : "\u25B3" }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-[#17243a] truncate">
            {{ alerta.titulo }}
          </p>
          <p class="text-xs text-[#667085] truncate">{{ alerta.descricao }}</p>
        </div>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
          :style="alerta.badgeStyle"
        >
          {{ alerta.tipo === "CRITICO" ? "Crítico" : "Atenção" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AlertaItem {
  tipo: "CRITICO" | "ATENCAO";
  titulo: string;
  descricao: string;
  badgeStyle: { color: string; background: string; border: string };
}

defineProps<{
  itens: AlertaItem[];
}>();
</script>
