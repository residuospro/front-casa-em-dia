<template>
  <div class="overflow-hidden h-full border rounded-lg shadow-lg">
    <!-- Header -->

    <div class="flex items-center justify-end gap-4 p-3 border-b sm:flex-col">
      <div class="p-1 rounded-lg shadow-lg border">
        <button
          @click="setModoExibicao('tabela')"
          class="flex flex-row items-center gap-2 text-[#16742F] font-medium"
        >
          <svg-icon type="mdi" :path="mdiTable" />
        </button>
      </div>

      <div>
        <button
          @click="anterior"
          class="p-3 hover:bg-gray-100 rounded-xl text-xl"
        >
          &lt;
        </button>

        <select
          v-model="mesSelecionado"
          class="font-semibold text-lg bg-transparent border-none cursor-pointer outline-none !w-20"
        >
          <option v-for="(mes, i) in meses" :key="i" :value="i">
            {{ mes }}
          </option>
        </select>

        <select
          v-model="anoSelecionado"
          class="font-semibold text-lg bg-transparent border-none cursor-pointer outline-none"
        >
          <option v-for="ano in anos" :key="ano" :value="ano">
            {{ ano }}
          </option>
        </select>

        <button
          @click="proximo"
          class="p-3 hover:bg-gray-100 rounded-xl text-xl"
        >
          &gt;
        </button>
      </div>
    </div>

    <div class="flex flex-row sm:flex-col">
      <!-- Sidebar -->
      <aside
        class="w-56 border-r sm:border-r-0 sm:border-b p-4 flex flex-col justify-start gap-2 sm:w-full"
      >
        <div class="flex flex-row items-center justify-between mb-2">
          <p class="font-medium">Membros</p>
          <button
            class="active:scale-90"
            @click="
              async () => {
                resetarParametros();
                await chamarApi();
              }
            "
          >
            <svg-icon
              type="mdi"
              :path="mdiAutorenew"
              size="20"
              class="text-[#53864C]"
            />
          </button>
        </div>
        <div class="space-y-3">
          <!-- Você pode popular com membros da família aqui -->
          <div v-for="(membro, index) in opcoesFamiliares" :key="index">
            <button
              class="flex items-center gap-3 active:scale-90"
              @click="
                async () => {
                  parametros.filtro.responsavelAtualId = membro.value;
                  await chamarApi();
                }
              "
            >
              <img
                v-if="membro.fotoPerfil"
                :src="parseFotoPerfil(membro.fotoPerfil)"
                class="object-cover w-8 h-8 rounded-full"
              />

              <span
                class="text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]"
                :title="membro.text"
                >{{ membro.text }}</span
              >
            </button>
          </div>
        </div>
      </aside>

      <!-- Calendário -->
      <section class="flex-1 overflow-auto h-[30rem] relative">
        <!-- Dias da semana -->
        <div
          class="sticky top-0 z-30 grid grid-cols-7 border-b bg-white w-[100rem] xl:!w-full"
        >
          <div
            v-for="dia in semana"
            :key="dia.data.toISOString()"
            class="text-center py-2 border-r last:border-r-0"
          >
            <div class="text-xs text-gray-500">{{ dia.semana }}</div>
            <div class="text-xl font-semibold">{{ dia.dia }}</div>
          </div>
        </div>

        <!-- Grade Horária -->
        <div class="relative" style="height: 1100px">
          <!-- Linhas de hora -->
          <div
            v-for="hora in horas"
            :key="hora"
            class="absolute -left-2 right-0 border-t border-gray-100 w-[100rem] xl:!w-full"
            :style="{ top: `${(hora - 6) * 60}px` }"
          >
            <span
              class="absolute -left-1 text-xs text-gray-500 w-12 text-right pr-2"
            >
              {{ String(hora).padStart(2, "0") }}:00
            </span>
          </div>

          <!-- Colunas dos dias -->

          <!-- Colunas dos dias -->
          <div class="grid grid-cols-7 h-full w-[100rem] xl:!w-full">
            <div
              v-for="dia in semana"
              :key="dia.data.toISOString()"
              class="relative border-r last:border-r-0 min-h-full"
            >
              <!-- Grade clicável -->
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
                class="absolute left-2 task-block right-2 text-xs rounded-xl px-3 py-2 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col"
                :style="getTaskPositionStyle(tarefa)"
              >
                <div class="flex flex-row items-center justify-between">
                  <span class="font-bold">
                    {{ tarefa.titulo }}
                  </span>

                  <ce-context-menu
                    :items="opcoesMenu"
                    @select="
                      executarOpcoesMenu($event, tarefa.tarefaId, tarefa.titulo)
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

                <span
                  class="truncate !text-black font-bold max-w-[80px]"
                  :title="tarefa.responsavelAtual?.nome"
                >
                  {{ tarefa.responsavelAtual?.nome }}
                </span>

                <span class="capitalize">
                  {{ tarefa.status.toLowerCase() }}
                </span>
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
import { mdiAutorenew, mdiTable, mdiDotsVertical } from "@mdi/js";
import { useApiTarefas } from "../useApiTarefas";
import { useTarefas } from "../useTarefas";
import { CeContextMenu } from "@comercti/vue-components-hmg";
import { useRouter } from "vue-router";

const router = useRouter();
const { parseFotoPerfil } = useUtils();
const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const { opcoesFamiliares } = useMinhaFamilia();
const { chamarApi } = useApiTarefas();
const { parametros, executarOpcoesMenu, resetarParametros, setModoExibicao } =
  useTarefas();

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

onMounted(async () => {
  await Promise.all([obterOpcoesFamiliares(), chamarApi()]);
});

const criarTarefa = (dia: Date, hora: number, minuto = 0) => {
  const data = new Date(dia);

  data.setHours(hora, minuto, 0, 0);

  console.log("datatata", data);

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
  border-left: 4px solid;
  transition: all 0.2s;
}

.task-block:hover {
  transform: translateX(4px);
  z-index: 10;
}
</style>
