<template>
  <ce-modal
    :is-open="abrirModalFiltro"
    background="2"
    variant="secondary"
    class="w-1/3 h-full sm:w-full"
    close-outside
    show-close-button
    @close="abrirModalFiltro = false"
  >
    <div class="flex flex-col h-full bg-white justify-between">
      <div>
        <div class="border-b border-gray-300 p-6">
          <h1 class="text-2xl font-semibold text-[#1C1F1F]">Filtrar tarefas</h1>

          <p class="text-sm text-black/50 mt-1">
            Utilize os filtros abaixo para encontrar rapidamente as tarefas.
          </p>
        </div>

        <div class="flex flex-col gap-5 p-6">
          <div class="flex flex-row items-center gap-2">
            <svg-icon
              type="mdi"
              :path="mdiFormatListBulleted"
              class="text-[#16742F]"
            />
            <span class="font-medium text-[#1C1F1F]">Opções</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Select
              label="Categoria"
              placeholder="Selecione uma categoria"
              v-model="parametros.filtro.categoria"
              :items="categorias"
            />

            <Select
              label="Tipo de tarefa"
              v-model="parametros.filtro.tipo"
              :items="tipos"
              placeholder="Selecione o tipo de tarefa"
            />

            <Select
              label="Modo de distribuição"
              v-model="parametros.filtro.modoDistribuicao"
              :items="distribuicoes"
              placeholder="Selecione o modo de distribuição"
            />

            <Select
              label="Responsável atual"
              v-model="parametros.filtro.responsavelAtualId"
              :items="opcoesFamiliares"
              placeholder="Selecione um responsável atual"
            />
          </div>

          <div class="flex flex-row items-center gap-2">
            <svg-icon
              type="mdi"
              :path="mdiCalendarMonthOutline"
              class="text-[#16742F]"
            />
            <span class="font-medium text-[#1C1F1F]">Período</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <CeDatePicker
              v-model="parametros.filtro.dataInicial"
              label="Data inicial"
              placeholder="Selecione a data inicial"
            />

            <CeDatePicker
              v-model="parametros.filtro.dataFinal"
              label="Data final"
              placeholder="Selecione a data final"
            />
          </div>

          <div class="flex flex-row items-center gap-2 -mt-3">
            <svg-icon type="mdi" :path="mdiListStatus" class="text-[#16742F]" />
            <span class="font-medium text-[#1C1F1F]">Status</span>
          </div>

          <div class="flex flex-row items-center flex-wrap gap-4">
            <button
              v-for="status in statusExecucao"
              :key="status.value"
              @click="toggleStatus(status.value)"
              class="flex items-center gap-3 rounded-lg border p-2 transition hover:shadow-sm active:scale-90"
              :class="
                statusSelecionado(status.value)
                  ? 'border-[#53864C] bg-[#EEF5EA]'
                  : 'border-[#ECE4D8] bg-white'
              "
            >
              <svg-icon
                type="mdi"
                :path="status.icon"
                :size="20"
                :style="{
                  color: statusSelecionado(status.value)
                    ? '#53864C'
                    : status.color,
                }"
              />

              <span
                class="text-sm font-medium"
                :style="{
                  color: statusSelecionado(status.value)
                    ? '#53864C'
                    : status.color,
                }"
              >
                {{ status.text }}
              </span>
            </button>
          </div>

          <div class="flex flex-row items-center gap-2">
            <svg-icon type="mdi" :path="mdiMagnify" class="text-[#16742F]" />
            <span class="font-medium text-[#1C1F1F]">Termo</span>
          </div>

          <Input
            placeholder="Digite o título ou a descrição da tarefa"
            v-model="parametros.filtro.busca"
          />
        </div>
      </div>

      <div
        class="border-t border-gray-300 bg-white px-8 py-5 flex justify-end gap-3"
      >
        <Button variant="outline" @click="abrirModalFiltro = false">
          Cancelar
        </Button>

        <Button class="bg-[#53864C] text-white" @click="obterPorFiltro()">
          Aplicar filtros
        </Button>
      </div>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { CeModal, CeDatePicker } from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiFormatListBulleted,
  mdiListStatus,
  mdiCalendarMonthOutline,
  mdiMagnify,
} from "@mdi/js";
import Button from "@/components/botao/index.vue";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useApiMinhaFamilia } from "@/components/minhaFamilia/useApiMinhaFamilia";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useTarefas } from "../useTarefas";
import { useApiTarefas } from "../useApiTarefas";
import { onMounted } from "vue";

const { obterOpcoesFamiliares } = useApiMinhaFamilia();
const { opcoesFamiliares } = useMinhaFamilia();

onMounted(async () => {
  await obterOpcoesFamiliares();
});
const {
  abrirModalFiltro,
  parametros,
  statusExecucao,
  toggleStatus,
  statusSelecionado,
} = useTarefas();

const { obterPorFiltro } = useApiTarefas();

const categorias = [
  { text: "Casa", value: "CASA" },
  { text: "Estudo", value: "ESTUDO" },
  { text: "Saúde", value: "SAUDE" },
  { text: "Financeiro", value: "FINANCEIRO" },
];

const tipos = [
  { text: "Pessoal", value: "PESSOAL" },
  { text: "Familiar", value: "FAMILIAR" },
];

const distribuicoes = [
  { text: "Fixa", value: "FIXA" },
  { text: "Revezamento", value: "REVEZAMENTO" },
];
</script>
