import { computed, ref } from "vue";
import type { IResumo } from "./tipagem";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { storeToRefs } from "pinia";
import {
  mdiListBoxOutline,
  mdiCalendarCheckOutline,
  mdiClockAlertOutline,
  mdiAutorenew,
} from "@mdi/js";

const { perfil } = storeToRefs(usePerfil());

const dataResumo = ref<IResumo | null>(null);

const familiaId = computed(() => perfil.value.familiaId);

const obterResumo = async () => {
  const resposta: AxiosResponse<IResumo> = await useClient.get(
    `/tarefas/${familiaId.value}/tarefas/resumo`,
  );

  dataResumo.value = resposta.data;
};

const resumo = computed(() => [
  {
    label: "Ciclo ativo",
    value: dataResumo.value?.diasRestantes,
    slug: "ciclo-ativo",
    icone: mdiAutorenew,
  },
  {
    label: "Total de tarefas",
    value: dataResumo.value?.totalTarefas,
    slug: "total-tarefas",
    icone: mdiListBoxOutline,
  },
  {
    label: "Execuções concluídas",
    value: dataResumo.value?.execucoesConcluidas,
    slug: "tarefas-concluidas",
    icone: mdiCalendarCheckOutline,
  },
  {
    label: "Execuções atrasadas",
    value: dataResumo.value?.execucoesAtrasadas,
    slug: "tarefas-atrasadas",
    icone: mdiClockAlertOutline,
  },
]);

export const useResumo = () => {
  return { dataResumo, resumo, obterResumo };
};
