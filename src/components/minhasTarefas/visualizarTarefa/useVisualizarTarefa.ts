import { computed, ref } from "vue";
import type { Execucao, Tarefa } from "../tipagem";
import { useUtils } from "@/utils/useUtils";

const { criarDataLocal, criarExecucoes } = useUtils();
const dataTarefa = ref<Tarefa | null>(null);
const qtdExecucao = ref(4);
const dataInicio = ref<string | null>(null);
const horario = ref("");
const verHisticoCompleto = ref(false);
const abrirModalConcluir = ref(false);
const abrirModalCancelar = ref(false);
const abrirModalEditar = ref(false);
const execucao = ref({
  execucaoId: "",
  concluidoPorId: "",
  tarefaId: "",
});

const execucoesAgrupadas = computed(() => {
  const execs = dataTarefa.value?.execucoes || [];
  if (!execs.length) return { atuais: [], passadas: [] };

  const maxIteracao = Math.max(...execs.map((e) => e.iteracao));

  return {
    atuais: execs.filter((e) => e.iteracao === maxIteracao),
    passadas: execs.filter((e) => e.iteracao < maxIteracao),
  };
});

const opcoesMenuExecucao = [
  { label: "Editar", value: "editar" },
  { label: "Concluir", value: "concluir" },
  { label: "Cancelar", value: "cancelar", color: "#ff0000" },
];

const setarClasseStatus = (execucao: Execucao | null) => {
  if (!execucao) return "";

  const mapsStatus = {
    ATRASADA: "text-red-600 border-red-500",
    CONCLUIDA: "text-green-700 border-green-600",
    CANCELADA: "text-gray-500 border-gray-300",
  } as const;

  const classe = mapsStatus[execucao.status as keyof typeof mapsStatus];

  if (classe) {
    return classe;
  }

  const diff = new Date(execucao.data).getTime() - Date.now();

  if (diff <= 1000 * 60 * 60 * 24) {
    return "text-[#F5A623] border-[#F5A623]";
  }

  return "text-green-700 border-green-700";
};

const executarOpcoesMenuExecucao = (acao: string, execucaoId: string) => {
  execucao.value.execucaoId = execucaoId;

  const mapsAcao = {
    concluir: () => {
      abrirModalConcluir.value = true;
    },
    cancelar: () => {
      abrirModalCancelar.value = true;
    },
    editar: () => {
      abrirModalEditar.value = true;
    },
  };

  const executar = mapsAcao[acao as keyof typeof mapsAcao];

  if (executar) executar();
};

const setarDataAtualizar = () => {
  const inicio = dataInicio.value;
  return criarExecucoes([inicio || ""], [inicio || ""], horario.value);
};

const formatarAgendamento = (execucoes: Execucao[]) => {
  const diasSemana = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const agrupado = new Map<string, string[]>();

  execucoes.forEach((execucao) => {
    const data = criarDataLocal(execucao.data);

    const dia = diasSemana[data.getDay()];

    const hora = `${String(data.getHours()).padStart(2, "0")}:${String(
      data.getMinutes(),
    ).padStart(2, "0")}`;

    if (!agrupado.has(dia || "")) {
      agrupado.set(dia || "", []);
    }

    agrupado.get(dia || "")?.push(hora);
  });

  return [...agrupado.entries()].map(([dia, horarios]) => ({
    dia,
    horarios: [...new Set(horarios)].sort(),
  }));
};

const setarQtdExecucao = () => {
  if (verHisticoCompleto.value) {
    qtdExecucao.value = 4;
    verHisticoCompleto.value = false;
    return;
  }

  verHisticoCompleto.value = true;
  qtdExecucao.value = execucoesAgrupadas.value.passadas.length || 4;
};

export const useVisualizarTarefas = () => {
  return {
    dataTarefa,
    execucoesAgrupadas,
    opcoesMenuExecucao,
    qtdExecucao,
    verHisticoCompleto,
    abrirModalConcluir,
    execucao,
    abrirModalCancelar,
    abrirModalEditar,
    dataInicio,
    horario,
    executarOpcoesMenuExecucao,
    formatarAgendamento,
    setarClasseStatus,
    setarQtdExecucao,
    setarDataAtualizar,
  };
};
