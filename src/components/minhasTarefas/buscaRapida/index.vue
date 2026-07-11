<template>
  <div class="flex items-center gap-4 sm:p-2 sm:justify-between sm:w-full">
    <button
      @click="aplicaFiltro('todas')"
      class="active:scale-90"
      :class="
        buscaRapida === 'todas'
          ? 'underline underline-offset-4 decoration-lime-700 text-lime-700'
          : ''
      "
    >
      Todas
    </button>
    <button
      @click="aplicaFiltro('minhas')"
      class="active:scale-90"
      :class="
        buscaRapida === 'minhas'
          ? 'underline underline-offset-4 decoration-lime-700 text-lime-700'
          : ''
      "
    >
      Minhas
    </button>
    <button
      @click="aplicaFiltro('dependentes')"
      class="active:scale-90"
      :class="
        buscaRapida === 'dependentes'
          ? 'underline underline-offset-4 decoration-lime-700 text-lime-700'
          : ''
      "
    >
      Dependentes
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useApiTarefas } from "../useApiTarefas";
import { useTarefas } from "../useTarefas";
import { usePerfil } from "@/store/usePerfil";
import { storeToRefs } from "pinia";

const { chamarApi } = useApiTarefas();
const { parametros, resetarParametros } = useTarefas();

type FiltroRapido = "todas" | "minhas" | "dependentes";

const buscaRapida = ref<FiltroRapido>("todas");
const { perfil } = storeToRefs(usePerfil());

const aplicaFiltro = async (filtro: FiltroRapido) => {
  const mapsFiltro = {
    todas: () => {
      buscaRapida.value = "todas";
    },
    minhas: () => {
      buscaRapida.value = "minhas";
      parametros.value.filtro.responsavelAtualId = perfil.value.id;
      parametros.value.filtro.cicloId = null;
    },
    dependentes: () => {
      buscaRapida.value = "dependentes";
      parametros.value.filtro.dependente = true;
      parametros.value.filtro.cicloId = null;
    },
  };

  const executar = mapsFiltro[filtro];

  if (executar) {
    executar();
    await chamarApi();
    resetarParametros();
  }
};
</script>

<style scoped></style>
