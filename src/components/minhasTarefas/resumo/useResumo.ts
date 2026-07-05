import { computed, ref } from "vue";
import type { IResumo } from "./tipagem";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import {
  mdiListBoxOutline,
  mdiCalendarCheckOutline,
  mdiClockAlertOutline,
  mdiAutorenew,
} from "@mdi/js";

export const useResumo = () => {
  const { perfil } = usePerfil();

  const dataResumo = ref<IResumo | null>(null);

  const obterCiclos = async () => {
    const resposta: AxiosResponse<IResumo> = await useClient.get(
      `/tarefas/${perfil.familiaId}/tarefas/resumo`,
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
      label: "Tarefas concluídas",
      value: dataResumo.value?.tarefasConcluidas,
      slug: "tarefas-concluidas",
      icone: mdiCalendarCheckOutline,
    },
    {
      label: "Tarefas atrasadas",
      value: dataResumo.value?.tarefasAtrasadas,
      slug: "tarefas-atrasadas",
      icone: mdiClockAlertOutline,
    },
  ]);

  return { dataResumo, resumo, obterCiclos };
};
