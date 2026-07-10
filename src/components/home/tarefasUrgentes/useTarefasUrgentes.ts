import { useClient } from "@/client";
import type { Tarefa } from "@/components/minhasTarefas/tipagem";
import { usePerfil } from "@/store/usePerfil";
import type { AxiosResponse } from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const { perfil } = storeToRefs(usePerfil());
const dataTarefasUrgentes = ref<Tarefa[]>([]);

const obterTarefasurgentes = async () => {
  const resposta: AxiosResponse<Tarefa[]> = await useClient.get(
    `/tarefas/${perfil.value.familiaId}/tarefas/urgentes`,
  );

  dataTarefasUrgentes.value = resposta.data;

  console.log("res", resposta.data);
  console.log("datt", dataTarefasUrgentes.value);
};

export const useTarefasUrgentes = () => {
  return {
    dataTarefasUrgentes,
    obterTarefasurgentes,
  };
};
