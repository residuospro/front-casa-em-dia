import { ref } from "vue";
import type {
  Filtro,
  ParametrosTarefas,
  IResponseTarefa,
  Agendamento,
  AgendamentoComData,
} from "./tipagem";
import type {
  Categorias,
  ModoDistribuicao,
  TipoTarefa,
  TipoTarefaValues,
} from "@/utils/tipagem";
import {
  mdiAccountHeartOutline,
  mdiAccountCashOutline,
  mdiListBoxOutline,
  mdiHomeEditOutline,
  mdiAccountSchoolOutline,
} from "@mdi/js";

const criarFiltroInicial = (): Filtro => ({
  titulo: "",
  tipo: null,
  categoria: null,
  modoDistribuicao: null,
  responsavelAtualId: "",
  ativo: null,
});

const filtroInicial: Filtro = criarFiltroInicial();

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

const options = [5, 10, 25, 50, 100];
const headers = [
  { text: "Tarefa", value: "titulo", sortable: true },
  { text: "Categoria", value: "categoria", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Responsável", value: "responsavelAtual", sortable: true },
  { text: "Pontos", value: "pontos", sortable: false },
  { text: "Agenda", value: "agendamentos", sortable: false },
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

const getCategoriaStyle = (categoria: Categorias) => {
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

const obterProximoAgendamento = (
  agendamentos: Agendamento[],
  agora = new Date(),
): Agendamento | null => {
  if (!agendamentos.length) return null;

  const diaAtual = agora.getDay();
  const horaAtual = agora.getHours();
  const minutoAtual = agora.getMinutes();

  const candidatos: AgendamentoComData[] = agendamentos.map((agendamento) => {
    const [horaString, minutoString] = agendamento.horario.split(":");

    const hora = Number(horaString ?? 0);
    const minuto = Number(minutoString ?? 0);

    let diasAteAgendamento = agendamento.diaSemana - diaAtual;

    if (diasAteAgendamento < 0) {
      diasAteAgendamento += 7;
    }

    if (
      diasAteAgendamento === 0 &&
      (hora < horaAtual || (hora === horaAtual && minuto <= minutoAtual))
    ) {
      diasAteAgendamento = 7;
    }

    const dataAgendamento = new Date(agora);

    dataAgendamento.setDate(agora.getDate() + diasAteAgendamento);

    dataAgendamento.setHours(hora, minuto, 0, 0);

    return {
      ...agendamento,
      dataAgendamento,
    };
  });

  const proximo = candidatos.sort(
    (a, b) => a.dataAgendamento.getTime() - b.dataAgendamento.getTime(),
  )[0];

  return proximo ?? null;
};

const formatarAgendamento = (agendamento: Agendamento | null) => {
  if (!agendamento) return "";

  const hoje = new Date();
  const diaAtual = hoje.getDay();

  const diferenca =
    agendamento.diaSemana - diaAtual < 0
      ? agendamento.diaSemana - diaAtual + 7
      : agendamento.diaSemana - diaAtual;

  let dia = "";

  if (diferenca === 0) {
    dia = "Hoje";
  } else if (diferenca === 1) {
    dia = "Amanhã";
  } else {
    const diasSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];

    dia = diasSemana[agendamento.diaSemana] || "";
  }

  return `${dia} às ${agendamento.horario}`;
};

export const useTarefas = () => {
  return {
    parametros,
    dataTarefas,
    filtroInicial,
    headers,
    opcoesMenu,
    options,
    setarIconePorCategoria,
    getCategoriaStyle,
    getTagTarefaStyle,
    manipularResposta,
    resetarParametros,
    obterProximoAgendamento,
    formatarAgendamento,
  };
};
