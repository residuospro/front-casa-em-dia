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
      label: "Total de tarefas",
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

  // Adiciona apenas o primeiro ciclo com contagem de restantes
  if (dataResumo.value.ciclos?.length) {
    const primeiro = dataResumo.value.ciclos[0];

    items.push({
      label: primeiro.nome || "Ciclo ativo",
      value: primeiro.diasRestantes ?? 0,
      slug: "ciclo-ativo",
      icone: mdiAutorenew,
      isCiclo: true,
      duracaoDias: primeiro.duracaoDias,
      restantesCount: Math.max(0, dataResumo.value.ciclos.length - 1),
    });
  }

  return items;
});

export const useResumo = () => {
  return { dataResumo, resumo, obterResumo };
};
