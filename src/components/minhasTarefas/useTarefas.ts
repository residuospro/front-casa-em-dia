import { ref } from "vue";
import router from "@/router";
import type {
  Filtro,
  ParametrosTarefas,
  IResponseTarefa,
  Execucao,
} from "./tipagem";
import type {
  Categorias,
  ModoDistribuicao,
  StatusExecucao,
  TipoTarefa,
  TipoTarefaValues,
} from "@/utils/tipagem";
import {
  mdiAccountHeartOutline,
  mdiAccountCashOutline,
  mdiListBoxOutline,
  mdiHomeEditOutline,
  mdiAccountSchoolOutline,
  mdiCalendarMonthOutline,
  mdiCheckCircleOutline,
  mdiClockAlertOutline,
  mdiCloseCircleOutline,
} from "@mdi/js";

const criarFiltroInicial = (): Filtro => ({
  titulo: "",
  tipo: null,
  categoria: null,
  modoDistribuicao: null,
  responsavelAtualId: "",
  ativo: null,
  dataInicial: null,
  dataFinal: null,
  status: null,
  busca: null,
  cicloId: null,
  dependente: null,
});

const modoExibicao = ref<"tabela" | "calendario">("tabela");

const setModoExibicao = (modo: "tabela" | "calendario") => {
  modoExibicao.value = modo;
  localStorage.setItem("modoExibicao", modo);
};

const carregarModoExibicao = () => {
  const salvo = localStorage.getItem("modoExibicao");
  if (salvo === "tabela" || salvo === "calendario") {
    modoExibicao.value = salvo;
  }
};

const filtrado = ref(false);
const filtroInicial: Filtro = criarFiltroInicial();
const abrirModalDeletar = ref(false);
const abrirModalFiltro = ref(false);
const tarefaSelecionada = ref<{ id: string; titulo: string } | null>(null);
const estadoInicial: ParametrosTarefas = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosTarefas => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosTarefas>(criarEstadoInicial());
const dataTarefas = ref<IResponseTarefa>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});
const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const opcoesStatusTarefa = [
  { label: "Atrasadas", bg: "#FEE2E2", cor: "#DC2626" },
  { label: "Pra hoje", bg: "#FFF7ED", cor: "#EA580C" },
  { label: "Agendadas", bg: "#DCFCE7", cor: "#16A34A" },
];

const options = [5, 10, 25, 50, 100];
const headers = [
  { text: "Tarefa", value: "titulo", sortable: true },
  { text: "Categoria", value: "categoria", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Responsável", value: "responsavelAtual", sortable: true },
  { text: "Pontos", value: "pontos", sortable: false },
  { text: "Agenda", value: "execucoes", sortable: false },
  { text: "Ciclo", value: "ciclo" },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: false, width: "5rem" },
];

const manipularResposta = (res: IResponseTarefa) => {
  const { data, ...resto } = res;
  dataTarefas.value = { ...res };
  parametros.value = { ...parametros.value, ...resto };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const setarIconePorCategoria = (item: Categorias) => {
  const mapCategorias = {
    CASA: mdiHomeEditOutline,
    ESTUDO: mdiAccountSchoolOutline,
    SAUDE: mdiAccountHeartOutline,
    FINANCEIRO: mdiAccountCashOutline,
    OUTROS: mdiListBoxOutline,
  };

  return mapCategorias[item];
};

const getCategoriaStyle = (categoria?: Categorias) => {
  if (!categoria) {
    return {
      cor: "#424242",
      background: "",
    };
  }

  const styles = {
    CASA: {
      cor: "#53864C",
      background: "#EEF5EA",
    },

    ESTUDO: {
      cor: "#3B82F6",
      background: "#EFF6FF",
    },

    SAUDE: {
      cor: "#E05A6F",
      background: "#FFF1F3",
    },

    FINANCEIRO: {
      cor: "#D49B1F",
      background: "#FFF8E7",
    },

    OUTROS: {
      cor: "#8B5CF6",
      background: "#F5F3FF",
    },
  };

  return styles[categoria] ?? styles.OUTROS;
};

const getTagTarefaStyle = (tipo?: TipoTarefa, modo?: ModoDistribuicao) => {
  const tipos = {
    PESSOAL: {
      cor: "#6D4E9B",
      background: "#F3EDFF",
    },

    FAMILIAR: {
      cor: "#39704A",
      background: "#EEF5EA",
    },
  };

  const modos = {
    FIXA: {
      cor: "#A56A00",
      background: "#FFF4D6",
    },

    REVEZAMENTO: {
      cor: "#A56A00",
      background: "#FFF4D6",
    },
  };

  return {
    tipo: tipo ? tipos[tipo as keyof typeof TipoTarefaValues] : null,
    modo: modo ? modos[modo] : null,
  };
};

const obterProximaExecucao = (execucoes: Execucao[]): Execucao | null => {
  if (!execucoes.length) return null;

  const agora = new Date();

  const futuras = execucoes
    .filter(
      (e) =>
        e.status === "AGENDADA" &&
        new Date(e.data).getTime() >= agora.getTime(),
    )
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  if (futuras.length) {
    return futuras[0] || null;
  }

  return (
    [...execucoes].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    )[0] || null
  );
};

const formatarExecucao = (execucao: Execucao | null) => {
  if (!execucao) {
    return {
      titulo: "",
      subtitulo: "",
    };
  }

  const data = new Date(execucao.data);

  const hoje = new Date();
  const inicioHoje = new Date(hoje);
  inicioHoje.setHours(0, 0, 0, 0);

  const amanha = new Date(inicioHoje);
  amanha.setDate(amanha.getDate() + 1);

  const somenteData = new Date(data);
  somenteData.setHours(0, 0, 0, 0);

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let dia = "";

  if (somenteData.getTime() === inicioHoje.getTime()) {
    dia = "Hoje";
  } else if (somenteData.getTime() === amanha.getTime()) {
    dia = "Amanhã";
  } else {
    dia = data.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    dia = dia.replace(".", "").replace(",", "").replace(" de", "");

    dia = dia.charAt(0).toUpperCase() + dia.slice(1);
  }

  const nomes = {
    AGENDADA: "Agendada",
    ATRASADA: "Atrasada",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
  };

  return {
    titulo: `${dia} • ${hora}`,
    subtitulo: nomes[execucao.status],
  };
};

const obterClasseExecucao = (execucao: Execucao | null) => {
  if (!execucao) return "";

  switch (execucao.status) {
    case "ATRASADA":
      return {
        text: "text-red-600",
        border: "border-red-500",
        dot: "bg-red-500",
      };

    case "CONCLUIDA":
      return {
        text: "text-green-700",
        border: "border-green-600",
        dot: "bg-green-600",
      };

    case "CANCELADA":
      return {
        text: "text-gray-500",
        border: "border-gray-300",
        dot: "bg-gray-400",
      };

    default: {
      const diff = new Date(execucao.data).getTime() - new Date().getTime();

      if (diff <= 1000 * 60 * 60 * 24) {
        return {
          text: "text-[#F5A623]",
          border: "border-[#F5A623]",
          dot: "bg-[#F5A623]",
        };
      }

      return {
        text: "text-green-700",
        border: "border-green-700",
        dot: "bg-green-700",
      };
    }
  }
};

const obterClasseExecucaoFormatada = (execucao: Execucao | null) => {
  const classe = obterClasseExecucao(execucao);
  return typeof classe === "string"
    ? { text: "", border: "", dot: "" }
    : classe;
};

const executarOpcoesMenu = (acao: string, id: string, titulo: string) => {
  const maps = {
    editar: () => {
      router.push({ name: "minhas-tarefas.editar-tarefa", query: { id } });
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      tarefaSelecionada.value = {
        id,
        titulo,
      };
    },
    visualizar: () => {
      router.push({ name: "minhas-tarefas.visualizar-tarefa", query: { id } });
    },
  };

  const action = maps[acao as keyof typeof maps];

  if (action) {
    action();
  }
};

const statusExecucao = [
  {
    text: "Agendada",
    value: "AGENDADA",
    icon: mdiCalendarMonthOutline,
    color: "#3B82F6",
    background: "#EFF6FF",
  },
  {
    text: "Concluída",
    value: "CONCLUIDA",
    icon: mdiCheckCircleOutline,
    color: "#22C55E",
    background: "#F0FDF4",
  },
  {
    text: "Atrasada",
    value: "ATRASADA",
    icon: mdiClockAlertOutline,
    color: "#F59E0B",
    background: "#FFFBEB",
  },
  {
    text: "Cancelada",
    value: "CANCELADA",
    icon: mdiCloseCircleOutline,
    color: "#A78BFA",
    background: "#F5F3FF",
  },
] as const;

const toggleStatus = (status: StatusExecucao) => {
  if (!parametros.value.filtro.status) {
    parametros.value.filtro.status = [];
  }

  const index = parametros.value.filtro.status.indexOf(status);

  if (index >= 0) {
    parametros.value.filtro.status.splice(index, 1);

    if (parametros.value.filtro.status.length === 0) {
      parametros.value.filtro.status = null;
    }
  } else {
    parametros.value.filtro.status.push(status);
  }
};

const statusSelecionado = (status: StatusExecucao) => {
  return parametros.value.filtro.status?.includes(status) ?? false;
};

export const useTarefas = () => {
  return {
    parametros,
    dataTarefas,
    filtroInicial,
    headers,
    opcoesMenu,
    options,
    abrirModalDeletar,
    tarefaSelecionada,
    abrirModalFiltro,
    statusExecucao,
    filtrado,
    modoExibicao,
    opcoesStatusTarefa,
    setModoExibicao,
    carregarModoExibicao,
    toggleStatus,
    statusSelecionado,
    setarIconePorCategoria,
    getCategoriaStyle,
    getTagTarefaStyle,
    manipularResposta,
    resetarParametros,
    obterProximaExecucao,
    formatarExecucao,
    obterClasseExecucao,
    executarOpcoesMenu,
    obterClasseExecucaoFormatada,
  };
};
