<template>
  <div class="bg-white border rounded-3xl p-6">
    <h3 class="font-semibold mb-4">Agendamento</h3>

    <div class="space-y-3">
      <div
        v-for="item in formatarAgendamento(dataTarefa?.execucoes || [])"
        :key="item.dia"
        class="flex items-center justify-between py-2 sm:text-xs"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold p-1"
          >
            <svg-icon
              type="mdi"
              :path="mdiClockTimeEightOutline"
              class="text-emerald-600"
            />
          </div>

          <span>{{ item.dia }}</span>
        </div>

        <span class="font-medium">
          {{ item.horarios.join(" & ") }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClockTimeEightOutline } from "@mdi/js";
import { useVisualizarTarefas } from "../useVisualizarTarefa";

const { dataTarefa, formatarAgendamento } = useVisualizarTarefas();
</script>
