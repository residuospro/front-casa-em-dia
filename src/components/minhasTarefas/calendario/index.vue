<template>
  <div class="overflow-hidden h-full border rounded-3xl shadow-lg bg-white">
    <!-- Header -->
    <div
      class="flex flex-col sm:items-center justify-between gap-4 p-4 border-b bg-gray-50"
    >
      <div class="flex items-center gap-4 sm:flex-col sm:justify-center">
        <div class="flex flex-row items-center gap-2">
          <button
            @click="setModoExibicao('tabela')"
            class="p-3 bg-white rounded-2xl shadow border hover:bg-gray-50 transition-all"
          >
            <svg-icon type="mdi" :path="mdiTable" class="text-[#16742F]" />
          </button>

          <button
            @click="mostrarMembrosMobile = !mostrarMembrosMobile"
            class="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white border rounded-2xl"
          >
            <span>Membros</span>
            <span
              class="text-xl transition-transform"
              :class="{ 'rotate-180': mostrarMembrosMobile }"
              >↓</span
            >
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="anterior"
            class="p-3 hover:bg-white rounded-2xl transition-colors"
          >
            ←
          </button>

          <div
            class="flex items-center bg-white rounded-2xl px-4 py-2 shadow-sm border"
          >
            <select
              v-model="mesSelecionado"
              class="font-semibold bg-transparent outline-none text-lg cursor-pointer"
            >
              <option v-for="(mes, i) in meses" :key="i" :value="i">
                {{ mes }}
              </option>
            </select>
            <select
              v-model="anoSelecionado"
              class="font-semibold bg-transparent outline-none text-lg cursor-pointer ml-2"
            >
              <option v-for="ano in anos" :key="ano" :value="ano">
                {{ ano }}
              </option>
            </select>
          </div>

          <button
            @click="proximo"
            class="p-3 hover:bg-white rounded-2xl transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <!-- Sidebar -->
      <aside
        class="sm:w-full border-b sm:border-b-0 sm:border-r p-4 bg-gray-50 transition-all"
        :class="{ hidden: !mostrarMembrosMobile }"
      >
        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold text-gray-700">Membros</p>
          <button
            @click="
              resetarParametros();
              chamarApi();
            "
            class="text-[#53864C]"
          >
            <svg-icon type="mdi" :path="mdiAutorenew" size="20" />
          </button>
        </div>

        <div class="space-y-3 max-h-80 sm:max-h-none overflow-auto">
          <button
            v-for="(membro, index) in opcoesFamiliares"
            :key="index"
            @click="selecionarMembro(membro)"
            class="flex items-center gap-3 w-full text-left hover:bg-gray-100 p-2 rounded-xl transition-colors"
          >
            <img
              v-if="membro.fotoPerfil"
              :src="parseFotoPerfil(membro.fotoPerfil)"
              class="w-9 h-9 rounded-full object-cover"
            />
            <div class="text-sm font-medium truncate">{{ membro.text }}</div>
          </button>
        </div>
      </aside>

      <!-- Calendário -->
      <section
        class="overflow-auto h-[30rem] relative grid grid-cols-[auto_1fr]"
      >
        <div class="border-r grid grid-rows-2 relative">
          <div class="p-2 flex justify-center">
            <svg-icon
              type="mdi"
              :path="mdiClockAlertOutline"
              class="text-gray-400"
              size="25"
            />
          </div>

          <div
            v-for="hora in horas"
            :key="hora"
            class="absolute left-0 right-0 mt-[3.3rem] border-t border-gray-100 bg-slate-400"
            :style="{ top: `${hora * 60}px` }"
          >
            <span
              class="absolute -left-2 text-xs text-gray-500 w-12 text-right pr-2"
            >
              {{ String(hora).padStart(2, "0") }}:00
            </span>
          </div>
        </div>
        <div>
          <div
            class="sticky top-0 z-30 grid grid-cols-7 min-w-[800px] sm:!min-w-0 border-b bg-white"
          >
            <div
              v-for="dia in semana"
              :key="dia.data.toISOString()"
              class="text-center py-1 border-r last:border-r-0"
            >
              <div class="text-xs text-gray-500">{{ dia.semana }}</div>
              <div class="text-lg font-semibold">{{ dia.dia }}</div>
            </div>
          </div>

          <!-- Grade Horária -->
          <div
            class="relative min-w-[800px] sm:!min-w-0"
            style="height: 1450px"
          >
            <!-- Linhas de Hora -->

            <!-- Colunas dos Dias -->
            <div class="grid grid-cols-7 h-full min-w-[600px] sm:!min-w-0">
              <div
                v-for="dia in semana"
                :key="dia.data.toISOString()"
                class="relative border-r last:border-r-0 min-h-full"
              >
                <!-- Grade clicável (hora cheia + meia hora) -->
                <div
                  v-for="hora in horas"
                  :key="`${dia.data.toISOString()}-${hora}`"
                >
                  <!-- Parte superior = hora cheia -->
                  <div
                    class="h-[30px] border-t border-gray-100 hover:bg-[#F5FAF6] cursor-pointer transition-colors"
                    @click="criarTarefa(dia.data, hora)"
                  />

                  <!-- Parte inferior = meia hora -->
                  <div
                    class="h-[30px] border-t border-dashed border-gray-100 hover:bg-[#EDF8EF] cursor-pointer transition-colors"
                    @click="criarTarefa(dia.data, hora, 30)"
                  />
                </div>

                <!-- Tarefas -->
                <div
                  v-for="(tarefa, index) in getTarefasDoDia(dia.data)"
                  :key="index"
                  class="absolute text-xs px-3 py-2 sm:!px-1 sm:justify-center shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col"
                  :style="getTaskPositionStyle(tarefa)"
                >
                  <div class="flex justify-between items-start">
                    <ce-tooltip
                      :focus="false"
                      location="top"
                      :text="`${tarefa.titulo} - ${perfilMembro(tarefa.responsavelAtualId || '').nome}`"
                    >
                      <template #activator>
                        <button>
                          <svg-icon
                            type="mdi"
                            :path="mdiMagnify"
                            class="text-gray-400"
                            size="10"
                          />
                        </button>
                      </template>
                    </ce-tooltip>

                    <span
                      class="font-bold truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px] sm:hidden"
                      :title="tarefa.titulo"
                      >{{ tarefa.titulo }}</span
                    >

                    <ce-context-menu
                      :items="opcoesMenu"
                      @select="
                        executarOpcoesMenu(
                          $event,
                          tarefa.tarefaId,
                          tarefa.titulo,
                        )
                      "
                    >
                      <button>
                        <svg-icon
                          type="mdi"
                          :path="mdiDotsVertical"
                          class="text-gray-400"
                          size="15"
                        />
                      </button>
                    </ce-context-menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useCalendario } from "./useCalendario";
import { onMounted } from "vue";
import { useUtils } from "@/utils/useUtils";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiAutorenew,
  mdiTable,
  mdiDotsVertical,
  mdiClockAlertOutline,
  mdiMagnify,
} from "@mdi/js";
import { useApiTarefas } from "../useApiTarefas";
import { useTarefas } from "../useTarefas";
import { CeContextMenu, CeTooltip } from "@comercti/vue-components-hmg";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const { parseFotoPerfil } = useUtils();
const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const { opcoesFamiliares, perfilMembro } = useMinhaFamilia();
const { chamarApi } = useApiTarefas();
const { parametros, executarOpcoesMenu, resetarParametros, setModoExibicao } =
  useTarefas();

const mostrarMembrosMobile = ref(false);

const selecionarMembro = async (membro: any) => {
  mostrarMembrosMobile.value = false;
  parametros.value.filtro.responsavelAtualId = membro.value;
  await chamarApi();
};

const {
  horas,
  semana,
  anoSelecionado,
  mesSelecionado,
  anos,
  meses,
  opcoesMenu,
  anterior,
  proximo,
  getTarefasDoDia,
  getTaskPositionStyle,
} = useCalendario();

// onMounted(async () => {
//   await Promise.all([obterOpcoesFamiliares(), chamarApi()]);
// });

const criarTarefa = (dia: Date, hora: number, minuto = 0) => {
  const data = new Date(dia);

  data.setHours(hora, minuto, 0, 0);

  router.push({
    name: "minhas-tarefas.nova-tarefa",
    query: {
      data: data.toISOString(),
    },
  });
};
</script>

<style scoped>
.task-block {
  border-left: 8px solid;
  transition: all 0.2s;
}

.task-block:hover {
  transform: translateX(4px);
  z-index: 10;
}
</style>
