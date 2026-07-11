import { computed, ref } from "vue";
import type { ModoCalendario, TarefaComExecucao } from "./tipagem";
import router from "@/router";
import { useTarefas } from "../useTarefas";

const { dataTarefas } = useTarefas();

export function useCalendario() {
  const modo = ref<ModoCalendario>("SEMANA");
  const dataAtual = ref(new Date());

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const opcoesMenu = [
    { label: "Visualizar", value: "visualizar" },
    { label: "Editar", value: "editar" },
    { label: "Excluir", value: "excluir", color: "#ff0000" },
  ];

  const titulo = computed(
    () =>
      `${meses[dataAtual.value.getMonth()]} de ${dataAtual.value.getFullYear()}`,
  );

  const horas = computed(() => {
    return Array.from({ length: 24 }, (_, i) => i); // 0 até 23
  });

  const semana = computed(() => {
    const ref = new Date(dataAtual.value);
    const domingo = new Date(ref);
    domingo.setDate(ref.getDate() - ref.getDay());

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(domingo);
      d.setDate(domingo.getDate() + i);
      return {
        data: d,
        dia: d.getDate(),
        semana: dias[d.getDay()],
      };
    });
  });

  function anterior() {
    const d = new Date(dataAtual.value);
    d.setDate(d.getDate() - 7);
    dataAtual.value = d;
  }

  function proximo() {
    const d = new Date(dataAtual.value);
    d.setDate(d.getDate() + 7);
    dataAtual.value = d;
  }

  const anoSelecionado = computed({
    get: () => dataAtual.value.getFullYear(),
    set: (ano: number) => {
      const d = new Date(dataAtual.value);
      d.setFullYear(ano);
      dataAtual.value = d;
    },
  });

  const mesSelecionado = computed({
    get: () => dataAtual.value.getMonth(),
    set: (mes: number) => {
      const d = new Date(dataAtual.value);
      d.setMonth(mes);
      dataAtual.value = d;
    },
  });

  const anos = computed(() => {
    const anoAtual = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, i) => anoAtual - 5 + i);
  });

  const getTarefasDoDia = (dataDia: Date): TarefaComExecucao[] => {
    const dataStr = dataDia.toISOString().split("T")[0];

    return dataTarefas.value.data.flatMap((tarefa) => {
      return tarefa.execucoes
        .filter((exec) => {
          const execDate = new Date(exec.data);
          return execDate.toISOString().split("T")[0] === dataStr;
        })
        .map((exec) => ({
          ...tarefa,
          ...exec,
        })) as TarefaComExecucao[];
    });
  };

  const getTaskPositionStyle = (tarefa: TarefaComExecucao) => {
    const date = new Date(tarefa.data);
    const hora = date.getHours() + date.getMinutes() / 60;

    // Alteração principal aqui ↓
    const top = hora * 60; // ← Removido o "- 6"
    const height = 65;

    const diff = new Date(tarefa.data).getTime() - new Date().getTime();
    const isClose = diff <= 1000 * 60 * 60 * 24;

    const statusColors: Record<
      string,
      { bg: string; texto: string; borda: string }
    > = {
      ATRASADA: { bg: "#FEE2E2", texto: "#DC2626", borda: "#DC2626" },
      CONCLUIDA: { bg: "#DCFCE7", texto: "#16A34A", borda: "#16A34A" },
      CANCELADA: { bg: "#F3F4F6", texto: "#9CA3AF", borda: "#9CA3AF" },
    };

    const cores =
      tarefa.status === "AGENDADA"
        ? isClose
          ? { bg: "#FFF7ED", texto: "#EA580C", borda: "#EA580C" }
          : { bg: "#DCFCE7", texto: "#16A34A", borda: "#16A34A" }
        : (statusColors[tarefa.status] ?? {
            bg: "#F3F4F6",
            texto: "#9CA3AF",
            borda: "#9CA3AF",
          });

    return {
      top: `${top}px`,
      height: `${height}px`,
      background: cores.bg,
      color: cores.texto,
      borderLeft: `4px solid ${cores.borda}`,
    };
  };

  const abrirDetalhe = (tarefa: TarefaComExecucao) => {
    console.log("Tarefa clicada:", tarefa);
    router.push({
      name: "minhas-tarefas.editar-tarefa",
      query: { id: tarefa.tarefaId },
    });
  };

  return {
    modo,
    dataAtual,
    titulo,
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
    abrirDetalhe,
  };
}
