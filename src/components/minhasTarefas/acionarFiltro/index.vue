<template>
  <div class="flex flex-row gap-2 sm:justify-between sm:w-full sm:p-2">
    <div class="flex items-center gap-2">
      <div class="p-2 rounded-lg shadow-lg border">
        <button
          @click="setModoExibicao('calendario')"
          class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
        >
          <svg-icon type="mdi" :path="mdiCalendarMonthOutline" />
        </button>
      </div>
    </div>

    <button
      @click="abrirModalFiltro = true"
      class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
    >
      <svg-icon type="mdi" :path="mdiFilterVariant" />
      Filtrar
    </button>

    <Button
      variant="outline"
      @click="
        async () => {
          resetarParametros();
          await chamarApi();
        }
      "
      v-if="filtrado"
    >
      Limpar filtro
    </Button>
  </div>
</template>

<script setup lang="ts">
import { useApiTarefas } from "../useApiTarefas";
import { useTarefas } from "../useTarefas";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiFilterVariant, mdiCalendarMonthOutline } from "@mdi/js";
import Button from "@/components/botao/index.vue";

const { chamarApi } = useApiTarefas();
const { abrirModalFiltro, filtrado, setModoExibicao, resetarParametros } =
  useTarefas();
</script>
