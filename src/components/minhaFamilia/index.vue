<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar família"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarFamilia()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar a família {{ dataFamilia[0]?.nome }}?
    </span>
  </ModalDeletar>

  <div
    class="bg-white rounded-2xl border border-[#ECE4D8] shadow-sm p-5 w-full h-full flex flex-col gap-3"
  >
    <template v-if="dataFamilia.length === 0 && !editando">
      <CriarFamilia />
    </template>

    <template v-else>
      <div class="flex flex-col gap-3 h-full">
        <div v-if="!editando" class="flex items-center justify-between">
          <div v-for="(familia, index) in dataFamilia" :key="index">
            <p class="text-sm text-black/50">Minha família</p>

            <h2 class="text-xl font-semibold text-[#1C1F1F]">
              {{ familia.nome }}
            </h2>
          </div>

          <div class="flex flex-row items-center gap-2">
            <button @click="() => (abrirModalDeletar = true)">
              <svg-icon
                type="mdi"
                :path="mdiTrashCanOutline"
                class="text-red-500"
              />
            </button>

            <button @click="permitirEdicao">
              <svg-icon type="mdi" :path="mdiPencil" class="text-[#53864C]" />
            </button>
          </div>
        </div>

        <EditarFamilia v-else />

        <hr class="w-full h-[0.10rem] bg-[#ECE4D8]" />

        <div class="h-full flex flex-col items-center justify-center">
          <div
            class="rounded-full bg-[#EEF5EA] flex items-center justify-center w-60 h-60 text-9xl"
          >
            🏡
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CriarFamilia from "@/components/minhaFamilia/criarFamilia/index.vue";
import { useMinhaFamilia } from "./useMinhaFamilia";
import { useApiMinhaFamilia } from "./useApiMinhaFamilia";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTrashCanOutline, mdiPencil } from "@mdi/js";
import ModalDeletar from "@/components/modal/index.vue";
import EditarFamilia from "@/components/minhaFamilia/editarFamilia/index.vue";

const { dataFamilia, editando, abrirModalDeletar, permitirEdicao } =
  useMinhaFamilia();

const { obterFamilia, deletarFamilia } = useApiMinhaFamilia();

onMounted(async () => {
  console.log("c");
  await obterFamilia();
});
</script>
