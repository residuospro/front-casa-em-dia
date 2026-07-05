import { ref } from "vue";
import type { FormNovaTarefa } from "./tipagem";
import {
  CategoriaValues,
  TipoTarefaValues,
  type StatusExecucao,
} from "@/utils/tipagem";

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

const estadoInicial = {
  titulo: "",
  descricao: "",
  tipo: "",
  categoria: "",
  modoDistribuicao: "",
  responsavelAtualId: "",
  pontos: null,
  cicloId: null,
  execucoes: [],
};

const idTarefa = ref("");
const form = ref<FormNovaTarefa>({ ...estadoInicial });
const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const horario = ref("");

const criarDataLocal = (valor: string | Date) => {
  if (valor instanceof Date) {
    return new Date(valor);
  }

  // yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano = 0, mes = 0, dia = 0] = valor.split("-").map(Number);

    return new Date(ano, mes - 1, dia);
  }

  // ISO
  const data = new Date(valor);

  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
};

const criarExecucoes = (
  start: [string, ...string[]],
  end: [string, ...string[]] | undefined,
  horario: string,
) => {
  if (!start.length) return [];

  const inicio = criarDataLocal(start[0]);

  const fim = end?.length ? criarDataLocal(end[0]) : criarDataLocal(start[0]);

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

  console.log("inicio", inicio);
  console.log("fim", fim);

  form.value.execucoes = criarExecucoes([inicio], [fim], horario.value);
  console.log("ex", form.value.execucoes);
};

const onUpdateStart = (datas: string) => {
  dataInicio.value = datas ?? null;
};

const onUpdateEnd = (datas: string) => {
  dataFim.value = datas ?? null;
};

const limparFormulario = () => {
  form.value = { ...estadoInicial };
  dataInicio.value = null;
  dataFim.value = null;
  horario.value = "";
};

export const useNovaTarefa = () => {
  return {
    categorias,
    tipos,
    form,
    dataInicio,
    dataFim,
    horario,
    idTarefa,
    gerarExecucoes,
    onUpdateStart,
    onUpdateEnd,
    limparFormulario,
  };
};
