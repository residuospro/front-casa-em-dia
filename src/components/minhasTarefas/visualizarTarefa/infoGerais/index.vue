<template>
  <div>
    <h2 class="font-semibold text-lg mb-4">Informações gerais</h2>

    <div
      class="flex flex-row sm:flex-col gap-4 xl:!w-1/2 w-full justify-between"
    >
      <div class="space-y-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">Tipo</p>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
            :style="{
              color: getTagTarefaStyle(dataTarefa?.tipo).tipo?.cor,
              background: getTagTarefaStyle(dataTarefa?.tipo).tipo?.background,
            }"
          >
            {{ dataTarefa?.tipo.toLocaleLowerCase() }}
          </span>
        </div>
        <div v-if="dataTarefa?.modoDistribuicao">
          <p class="text-sm text-gray-500 mb-1">Distribuição</p>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
            :style="{
              color: getTagTarefaStyle(
                dataTarefa?.tipo,
                dataTarefa?.modoDistribuicao,
              ).modo?.cor,

              background: getTagTarefaStyle(
                dataTarefa?.tipo,
                dataTarefa?.modoDistribuicao,
              ).modo?.background,
            }"
          >
            {{ dataTarefa?.modoDistribuicao.toLocaleLowerCase() }}
          </span>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Categoria</p>
          <span
            class="px-3 py-1 rounded-full text-xs font-medium w-min capitalize"
            :style="{
              color: getCategoriaStyle(dataTarefa?.categoria).cor,
              background: getCategoriaStyle(dataTarefa?.categoria).background,
            }"
          >
            {{ dataTarefa?.categoria.toLocaleLowerCase() }}
          </span>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <p class="text-sm text-gray-500 mb-1">Responsável atual</p>
          <div class="flex items-center gap-3">
            <img
              :src="
                parseFotoPerfil(
                  perfilMembro(dataTarefa?.responsavelAtualId || '').foto,
                )
              "
              :alt="perfilMembro(dataTarefa?.responsavelAtualId || '').nome"
              class="w-9 h-9 rounded-full"
            />
            <div>
              <p class="font-medium">
                {{ perfilMembro(dataTarefa?.responsavelAtualId || "").nome }}
              </p>
              <p class="text-xs text-gray-500">Esta semana</p>
            </div>
          </div>
        </div>

        <div v-if="(dataTarefa?.participantesId.length || 0) > 0">
          <p class="text-sm text-gray-500 mb-1">Participante(s)</p>
          <div class="flex -space-x-2 z-10">
            <div v-for="(participante, index) in dataTarefa?.participantesId">
              <img
                :key="index"
                v-if="participante"
                :src="parseFotoPerfil(perfilMembro(participante || '').foto)"
                class="object-cover w-8 h-8 rounded-full ring-2 ring-white"
                :style="{
                  zIndex:
                    dataTarefa?.participantesId.length || 0 + Number(index),
                }"
              />
            </div>
          </div>
        </div>

        <div v-if="(dataTarefa?.pontos ?? 0) > 0">
          <p class="text-sm text-gray-500 mb-1">Pontuação</p>
          <p class="font-medium">{{ dataTarefa?.pontos }} pts</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Criada por</p>
          <p class="font-medium">{{ criadoPor }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 mb-1">Criada em</p>
          <p class="font-medium">
            {{ formatarData(String(dataTarefa?.criadoEm)) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTarefas } from "../../useTarefas";
import { useUtils } from "@/utils/useUtils";
import { useVisualizarTarefas } from "../useVisualizarTarefa";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { computed } from "vue";

const { dataTarefa } = useVisualizarTarefas();
const { parseFotoPerfil, formatarData } = useUtils();
const { perfilMembro, opcoesFamiliares } = useMinhaFamilia();
const { getTagTarefaStyle, getCategoriaStyle } = useTarefas();

const criadoPor = computed(
  () =>
    opcoesFamiliares.value.find(
      (opcao) => opcao.value === dataTarefa?.value?.criadoPorId,
    )?.text || "",
);
</script>
