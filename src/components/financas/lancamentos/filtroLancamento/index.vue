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
          <h1 class="text-2xl font-semibold text-[#1C1F1F]">
            Filtrar lançamentos
          </h1>

          <p class="text-sm text-black/50 mt-1">
            Utilize os filtros abaixo para encontrar rapidamente os lançamentos.
          </p>
        </div>

        <div class="flex flex-col gap-5 p-6">
          <div class="flex flex-row items-center gap-2">
            <svg-icon type="mdi" :path="mdiFormatListBulleted" class="text-[#16742F]" />
            <span class="font-medium text-[#1C1F1F]">Opções</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Select
              label="Tipo"
              v-model="parametros.filtro.tipo"
              :items="opcoesTipo"
              :multiple="true"
              placeholder="Todos os tipos"
            />

            <Select
              label="Conta"
              v-model="parametros.filtro.contaId"
              :items="opcoesContas"
              placeholder="Todas as contas"
            />

            <Select
              label="Status"
              v-model="parametros.filtro.status"
              :items="opcoesStatus"
              :multiple="true"
              placeholder="Todos os status"
            />
          </div>

          <div class="flex flex-row items-center gap-2">
            <svg-icon type="mdi" :path="mdiCalendarMonthOutline" class="text-[#16742F]" />
            <span class="font-medium text-[#1C1F1F]">Período</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <CeDatePicker
              v-model="parametros.filtro.inicio"
              label="Data inicial"
              placeholder="Selecione a data inicial"
            />

            <CeDatePicker
              v-model="parametros.filtro.fim"
              label="Data final"
              placeholder="Selecione a data final"
            />
          </div>
        </div>
      </div>

      <div
        class="border-t border-gray-300 bg-white px-8 py-5 flex justify-between gap-3"
      >
        <Button variant="outline" @click="limparFiltrosModal">
          Limpar filtros
        </Button>

        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="abrirModalFiltro = false">
            Cancelar
          </Button>

          <Button class="bg-[#53864C] text-white" @click="aplicarFiltros">
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { CeModal, CeDatePicker } from "@comercti/vue-components-hmg";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiFormatListBulleted, mdiCalendarMonthOutline } from "@mdi/js";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
import { useLancamentos } from "../useLancamentos";
import { useApiLancamentos } from "../useApiLancamentos";
import { useContaBancaria } from "../../contasBancarias/useContasBancarias";
import { useApiContasBancarias } from "../../contasBancarias/useApiContasBancarias";

const { abrirModalFiltro, parametros } = useLancamentos();
const { obterPorFiltro, limparFiltros } = useApiLancamentos();
const { dataContas } = useContaBancaria();
const { chamarApi: carregarContas } = useApiContasBancarias();

const opcoesTipo = [
  { text: "Receita", value: "RECEITA" },
  { text: "Despesa", value: "DESPESA" },
  { text: "Transferência", value: "TRANSFERENCIA" },
  { text: "Ajuste", value: "AJUSTE" },
];

const opcoesStatus = computed(() => {
  const tiposSelecionados = parametros.value.filtro.tipo;
  const temReceita =
    !tiposSelecionados || !tiposSelecionados.length ||
    tiposSelecionados.includes("RECEITA");

  const base = [
    { text: "Pendente", value: "PENDENTE" },
    { text: "Pago", value: "PAGO" },
    { text: "Cancelado", value: "CANCELADO" },
    { text: "Ignorado", value: "IGNORADO" },
  ];

  if (!temReceita) return base;

  return [
    { text: "Pendente", value: "PENDENTE" },
    { text: "Pago", value: "PAGO" },
    { text: "Recebido", value: "RECEBIDO" },
    { text: "Cancelado", value: "CANCELADO" },
    { text: "Ignorado", value: "IGNORADO" },
  ];
});

watch(
  () => parametros.value.filtro.tipo,
  (tipos) => {
    if (tipos && tipos.length && !tipos.includes("RECEITA")) {
      parametros.value.filtro.status =
        parametros.value.filtro.status?.filter((s) => s !== "RECEBIDO") ?? null;
    }
  },
);

const opcoesContas = computed(() =>
  dataContas.value.data.map((c) => ({ text: c.nome, value: c.id })),
);

const aplicarFiltros = async () => {
  abrirModalFiltro.value = false;
  await obterPorFiltro();
};

const limparFiltrosModal = async () => {
  abrirModalFiltro.value = false;
  await limparFiltros();
};

onMounted(() => {
  carregarContas();
});
</script>
