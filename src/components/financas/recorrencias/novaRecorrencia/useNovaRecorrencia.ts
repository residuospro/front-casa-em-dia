import {
  FrequenciaRecorrenciaFinanceiraValues,
  type FrequenciaRecorrenciaFinanceira,
} from "@/utils/tipagem";
import { ref, watch } from "vue";
import { useRecorrencias } from "../useRecorrencias";

const opcoesFrequencia = [
  { text: "Diária", value: FrequenciaRecorrenciaFinanceiraValues.DIARIA },
  { text: "Semanal", value: FrequenciaRecorrenciaFinanceiraValues.SEMANAL },
  { text: "Mensal", value: FrequenciaRecorrenciaFinanceiraValues.MENSAL },
  { text: "Anual", value: FrequenciaRecorrenciaFinanceiraValues.ANUAL },
];

const estadoInicialForm = () => ({
  lancamentoModeloId: "",
  titulo: "",
  frequencia: "" as FrequenciaRecorrenciaFinanceira | "",
  intervalo: 1,
  proximaExecucao: new Date().toISOString().slice(0, 16),
});

const formRecorrencia = ref(estadoInicialForm());

const { acao, abriModalRecorrencia, recorrenciaEditando } = useRecorrencias();

watch(abriModalRecorrencia, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && recorrenciaEditando.value) {
    const r = recorrenciaEditando.value;

    formRecorrencia.value = {
      lancamentoModeloId: r.lancamentoModeloId,
      titulo: r.titulo,
      frequencia: r.frequencia,
      intervalo: r.intervalo,
      proximaExecucao: new Date(r.proximaExecucao).toISOString().slice(0, 16),
    };
  } else {
    formRecorrencia.value = estadoInicialForm();
  }
});

export const useNovaRecorrencia = () => {
  return {
    opcoesFrequencia,
    formRecorrencia,
  };
};
