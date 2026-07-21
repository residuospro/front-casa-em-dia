import { computed, ref } from "vue";
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
import type { IResumo, Items } from "./tipagem";

const { perfil } = storeToRefs(usePerfil());

const dataResumo = ref<IResumo | null>(null);

const familiaId = computed(() => perfil.value.familiaId);

const obterResumo = async () => {
  try {
    const resposta: AxiosResponse = await useClient.get(
      `/tarefas/${familiaId.value}/tarefas/resumo`,
    );

    dataResumo.value = resposta.data;
  } catch (error) {
    console.error("Erro ao buscar resumo:", error);
    dataResumo.value = null;
  }
};

// Computado para os cards
const resumo = computed(() => {
  if (!dataResumo.value) return [];

  const items: Items[] = [
    {
      label: "Total de tarefas do dia",
      value: dataResumo.value.totalTarefas ?? 0,
      slug: "total-tarefas",
      icone: mdiListBoxOutline,
    },
    {
      label: "Execuções concluídas",
      value: dataResumo.value.execucoesConcluidas ?? 0,
      slug: "tarefas-concluidas",
      icone: mdiCalendarCheckOutline,
    },
    {
      label: "Execuções atrasadas",
      value: dataResumo.value.execucoesAtrasadas ?? 0,
      slug: "tarefas-atrasadas",
      icone: mdiClockAlertOutline,
    },
  ];

  return items;
});

export const useResumo = () => {
  return { dataResumo, resumo, obterResumo };
};
