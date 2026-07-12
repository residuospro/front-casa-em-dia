import { ref } from "vue";
import type { FormNovaTarefa } from "./tipagem";
import { CategoriaValues, TipoTarefaValues } from "@/utils/tipagem";
import { useUtils } from "@/utils/useUtils";

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
  responsavelAtualId: null,
  pontos: null,
  cicloId: null,
  execucoes: [],
  atribuirAutomaticamente: false,
};

const { criarDataLocal, criarExecucoes } = useUtils();
const idTarefa = ref("");
const form = ref<FormNovaTarefa>({ ...estadoInicial });
const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const horario = ref("");

const preencherFormulario = (dataIso: string) => {
  const data = criarDataLocal(dataIso);

  dataInicio.value = data.toISOString().split("T")[0] || null;
  dataFim.value = data.toISOString().split("T")[0] || null;

  horario.value = `${String(data.getHours()).padStart(2, "0")}:${String(
    data.getMinutes(),
  ).padStart(2, "0")}`;
};

const gerarExecucoes = () => {
  if (!dataInicio.value) return;

  const inicio = dataInicio.value;
  const fim = dataFim.value ?? dataInicio.value;

  form.value.execucoes.push(...criarExecucoes([inicio], [fim], horario.value));

  dataInicio.value = null;
  dataFim.value = null;
  horario.value = "";
};

const excluirData = (data: string) => {
  form.value.execucoes = form.value.execucoes.filter((d) => d.data !== data);
};

const onUpdateStart = (datas: string) => {
  dataInicio.value = datas ?? null;
};

const onUpdateEnd = (datas: string) => {
  dataFim.value = datas ?? null;
};

const formatarDataAgenda = (dataIso: string) => {
  const data = criarDataLocal(dataIso);

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const meses = [
    "jan.",
    "fev.",
    "mar.",
    "abr.",
    "mai.",
    "jun.",
    "jul.",
    "ago.",
    "set.",
    "out.",
    "nov.",
    "dez.",
  ];

  const diaSemana = diasSemana[data.getDay()];
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = meses[data.getMonth()];
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");

  return `${diaSemana} ${dia} ${mes} · ${hora}:${minuto}`;
};

const limparFormulario = () => {
  form.value = { ...estadoInicial, execucoes: [] };
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
    preencherFormulario,
    gerarExecucoes,
    onUpdateStart,
    onUpdateEnd,
    limparFormulario,
    formatarDataAgenda,
    excluirData,
  };
};
