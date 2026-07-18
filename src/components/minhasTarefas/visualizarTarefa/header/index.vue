<template>
  <div class="p-5 flex items-start justify-between border-b sm:flex-col gap-8">
    <div class="flex items-center gap-4">
      <div
        class="rounded-full p-2"
        :style="{
          background: getCategoriaStyle('CASA').background,
        }"
      >
        <svg-icon
          type="mdi"
          :path="setarIconePorCategoria('CASA')"
          :style="{ color: getCategoriaStyle('CASA').cor }"
        />
      </div>

      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ dataTarefa?.titulo }}
        </h1>
        <span
          v-if="dataTarefa?.ativo"
          class="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full"
        >
          {{ dataTarefa?.ativo && "Ativo" }}
        </span>
      </div>
    </div>

    <Button @click="router.push('/minhas-tarefas')" class="sm:!w-full">
      Visualizar tarefas
    </Button>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { useTarefas } from "../../useTarefas";
import { useVisualizarTarefas } from "../useVisualizarTarefa";
import { useRouter } from "vue-router";
import Button from "@/components/botao/index.vue";

const router = useRouter();
const { dataTarefa } = useVisualizarTarefas();
const { getCategoriaStyle, setarIconePorCategoria } = useTarefas();
</script>

<style scoped></style>
