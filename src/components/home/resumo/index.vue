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
  mdiClockAlertOutline,
} from "@mdi/js";
import { useResumo } from "@/components/minhasTarefas/resumo/useResumo";
import { computed } from "vue";

const { dataResumo } = useResumo();

const cards = computed(() => [
  {
    titulo: "Total de tarefas",
    valor: dataResumo.value?.totalTarefas,
    icon: mdiListBoxOutline,
    bg: "bg-[#EEF5EA]",
    color: "text-[#53864C]",
  },

  {
    titulo: "Execuções concluidas",
    valor: dataResumo.value?.execucoesConcluidas,
    icon: mdiCalendarCheck,
    bg: "bg-green-500/5",
    color: "text-green-500",
  },

  {
    titulo: "Execuções em atraso",
    valor: dataResumo.value?.execucoesAtrasadas,
    icon: mdiClockAlertOutline,
    bg: "bg-red-500/5",
    color: "text-red-500",
  },
]);
</script>
