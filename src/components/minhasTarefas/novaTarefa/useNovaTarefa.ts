import { ref } from "vue";
import type { Execucao, FormNovaTarefa, StatusExecucao } from "./tipagem";
import { CategoriaValues, TipoTarefaValues } from "@/utils/tipagem";

const categorias = [
  {
    text: "Casa",
    value: CategoriaValues.CASA,
  },

  {
    text: "Estudo",
    value: CategoriaValues.ESTUDO,
  },

  {
    text: "Saúde",
    value: CategoriaValues.SAUDE,
  },
  {
    text: "Financeiro",
    value: CategoriaValues.FINANCEIRO,
  },
  {
    text: "Outros",
    value: CategoriaValues.OUTROS,
  },
];

const tipos = [
  {
    text: "Pessoal",
    value: TipoTarefaValues.PESSOAL,
  },

  {
    text: "Familiar",
    value: TipoTarefaValues.FAMILIAR,
  },
];

const form = ref<FormNovaTarefa>({
  titulo: "",
  descricao: "",
  tipo: "",
  categoria: "",
  modoDistribuicao: "",
  responsavelAtualId: "",
  pontos: null,
  cicloId: null,
  agendamentos: [],
});

const novoAgendamento = ref<{ diaSemana: number | null; horario: string }>({
  diaSemana: null,
  horario: "",
});

const diasSemana = [
  {
    text: "Diariamente",
    value: 7,
  },
  {
    text: "Domingo",
    value: 0,
  },

  {
    text: "Segunda",
    value: 1,
  },

  {
    text: "Terça",
    value: 2,
  },

  {
    text: "Quarta",
    value: 3,
  },

  {
    text: "Quinta",
    value: 4,
  },

  {
    text: "Sexta",
    value: 5,
  },

  {
    text: "Sábado",
    value: 6,
  },
];

const arrayAgendamentos = ref<{ dia: number; horario: string }[]>([]);

const removerAgendamento = (index: number) => {
  form.value.agendamentos.splice(index, 1);
};

const nomeDia = (dia: number) => {
  const dias = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Diariamente",
  ];

  return dias[dia];
};

const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const horario = ref("18:00");

const execucoes = ref<Execucao[]>([]);

const criarExecucoes = (
  start: [string, ...string[]],
  end: [string, ...string[]] | undefined,
  horario: string,
) => {
  if (!start.length) return [];

  const inicio = new Date(start[0]);

  const fim = end?.length ? new Date(end[0]) : new Date(start[0]);

  const [hora = 0, minuto = 0] = horario.split(":").map(Number);

  const execucoes = [];

  const dataAtual = new Date(inicio);

  while (dataAtual <= fim) {
    const data = new Date(dataAtual);

    data.setHours(hora, minuto, 0, 0);

    execucoes.push({
      data: data.toISOString(),
      status: "AGENDADA" as StatusExecucao,
      pontosObtidos: null,
    });

    dataAtual.setDate(dataAtual.getDate() + 1);
  }

  return execucoes;
};

const gerarExecucoes = () => {
  if (!dataInicio.value) return;

  const inicio = dataInicio.value;
  const fim = dataFim.value ?? dataInicio.value;

  execucoes.value = criarExecucoes([inicio], [fim], horario.value);

  console.log("exec", execucoes.value);
};

const onUpdateStart = (datas: string) => {
  dataInicio.value = datas ?? null;

  // Caso o usuário esteja selecionando apenas uma data
  if (!dataFim.value) {
    gerarExecucoes();
  }
};

const onUpdateEnd = (datas: string) => {
  dataFim.value = datas ?? null;

  gerarExecucoes();
};

export const useNovaTarefa = () => {
  return {
    categorias,
    tipos,
    form,
    novoAgendamento,
    diasSemana,
    arrayAgendamentos,
    dataInicio,
    dataFim,
    onUpdateStart,
    onUpdateEnd,

    removerAgendamento,
    nomeDia,
  };
};
