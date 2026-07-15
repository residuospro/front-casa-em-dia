import { computed, ref } from "vue";
import type { FormNovaTarefa, Recorrencia } from "./tipagem";
import {
  CategoriaValues,
  TipoTarefaValues,
  type FrequenciasRecorrencia,
} from "@/utils/tipagem";
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

const estadoInicialRecorrencia: Recorrencia = {
  frequencia: null,
  horarios: [],
  dataInicio: "",
  dataFim: null,
};

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
  recorrencia: { ...estadoInicialRecorrencia },
};

const { criarDataLocal, criarExecucoes, formatarData } = useUtils();
const idTarefa = ref("");
const form = ref<FormNovaTarefa>({ ...estadoInicial });
const dataInicio = ref<string | null>(null);
const dataFim = ref<string | null>(null);
const horario = ref("");
const frequenciaAutomatica = ref(false);

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

const frequencias = [
  { label: "Diariamente", value: "DIARIO" },
  { label: "Dia sim, dia não", value: "DIA_SIM_DIA_NAO" },
  { label: "Dias ímpares", value: "DIAS_IMPARES" },
  { label: "Dias pares", value: "DIAS_PARES" },
];

const recorrencia = ref({
  ...estadoInicialRecorrencia,
});

const limparRecorrencia = () => {
  recorrencia.value = { ...estadoInicialRecorrencia, horarios: [] };
};

const setarFrequencia = (
  frequencia: FrequenciasRecorrencia,
  checked: boolean,
) => {
  recorrencia.value.frequencia = checked ? frequencia : null;
};

const setarHorarioRecorrencia = () => {
  if (
    recorrencia.value.horarios.includes(horario.value) ||
    horario.value === ""
  )
    return;

  recorrencia.value.horarios.push(horario.value);
  horario.value = "";
};

const setarFrequenciaAutomatica = (valor: boolean) => {
  frequenciaAutomatica.value = valor;
  recorrencia.value = { ...estadoInicialRecorrencia, horarios: [] };
};

const exibirDataFrequencia = () => {
  const inicio = recorrencia.value.dataInicio?.split("-").reverse().join("/");
  const fim = recorrencia.value.dataFim?.split("-").reverse().join("/");

  if (!inicio) return "";

  if (fim && inicio !== fim) {
    return `${inicio} à ${fim}`;
  }

  return inicio;
};

const parseFrequencia = (frequencia: FrequenciasRecorrencia) => {
  const mapsFrequencia = {
    DIARIO: "Diário",
    DIA_SIM_DIA_NAO: "Dia sim, dia não",
    DIAS_IMPARES: "Dias impares",
    DIAS_PARES: "Dias pares",
  };

  return mapsFrequencia[frequencia];
};

const frequenciaDefinida = computed(() => {
  const recorrenciaRetorno = {
    frequencia: "",
    data: "",
    horario: "",
    exibir: false,
  };

  if (
    recorrencia.value.frequencia &&
    recorrencia.value.dataInicio !== "" &&
    recorrencia.value.horarios.length > 0
  ) {
    return {
      frequencia: parseFrequencia(recorrencia.value.frequencia),
      data: exibirDataFrequencia(),
      horario: recorrencia.value.horarios.join(" & "),
      exibir: true,
    };
  }

  return recorrenciaRetorno;
});

const setarFormRecorrencia = () => {
  const inicio = formatarData(recorrencia.value.dataInicio || "", false);
  const fim = formatarData(recorrencia.value.dataFim || "", false);

  if (inicio != fim) {
    return {
      ...recorrencia.value,
      dataInicio: recorrencia.value.dataInicio,
      dataFim: recorrencia.value.dataFim,
    };
  }

  return {
    ...recorrencia.value,
    dataInicio: recorrencia.value.dataInicio,
    dataFim: null,
  };
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
    frequenciaAutomatica,
    estadoInicialRecorrencia,
    frequencias,
    recorrencia,
    frequenciaDefinida,
    setarFormRecorrencia,
    limparRecorrencia,
    setarFrequencia,
    setarHorarioRecorrencia,
    setarFrequenciaAutomatica,
    preencherFormulario,
    gerarExecucoes,
    limparFormulario,
    formatarDataAgenda,
    excluirData,
  };
};
