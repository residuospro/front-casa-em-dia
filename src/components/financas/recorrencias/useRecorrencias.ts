import { ref } from "vue";
import type {
  IRecorrencia,
  IResponseRecorrencias,
  FiltroRecorrencia,
  ParametrosRecorrencia,
} from "./tipagem";
import type { FrequenciaRecorrenciaFinanceira } from "@/utils/tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Título", value: "titulo", sortable: true },
  { text: "Frequência", value: "frequencia", sortable: false },
  { text: "Intervalo", value: "intervalo", sortable: true },
  { text: "Próxima execução", value: "proximaExecucao", sortable: true },
  { text: "Ocorrências", value: "ocorrencias", sortable: false },
  { text: "Status", value: "ativa", sortable: true },
  { text: "Ações", value: "acoes", sortable: false },
];

const abriModalRecorrencia = ref(false);
const abrirModalDeletar = ref(false);
const abrirModalOcorrencias = ref(false);
const abrirModalExecutar = ref(false);
const acao = ref<"criar" | "editar">("criar");
const filtrado = ref(false);
const recorrenciaSelecionada = ref<{ id: string; titulo: string } | null>(null);
const recorrenciaEditando = ref<IRecorrencia | null>(null);
const recorrenciaOcorrencia = ref<IRecorrencia | null>(null);
const recorrenciaExecutar = ref<IRecorrencia | null>(null);

const opcoesMenu = [
  { label: "Executar", value: "executar" },
  { label: "Ocorrências", value: "ocorrencias" },
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = (): FiltroRecorrencia => ({
  busca: null,
  ativa: null,
  frequencia: null,
});

const estadoInicial: ParametrosRecorrencia = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosRecorrencia => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosRecorrencia>(criarEstadoInicial());
const dataRecorrencias = ref<IResponseRecorrencias>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: IResponseRecorrencias) => {
  dataRecorrencias.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalRecorrencia = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") recorrenciaEditando.value = null;
  }

  abriModalRecorrencia.value = !abriModalRecorrencia.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const recorrencia = item as IRecorrencia;

  const maps = {
    executar: () => {
      recorrenciaExecutar.value = recorrencia;
      abrirModalExecutar.value = true;
    },
    ocorrencias: () => {
      recorrenciaOcorrencia.value = recorrencia;
      abrirModalOcorrencias.value = true;
    },
    editar: () => {
      recorrenciaEditando.value = recorrencia;
      manipularModalRecorrencia("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      recorrenciaSelecionada.value = {
        id: recorrencia.id,
        titulo: recorrencia.titulo,
      };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getFrequenciaStyle = (frequencia?: FrequenciaRecorrenciaFinanceira) => {
  const styles: Record<
    FrequenciaRecorrenciaFinanceira,
    { label: string; cor: string; background: string }
  > = {
    DIARIA: { label: "Diária", cor: "#1E40AF", background: "#DBEAFE" },
    SEMANAL: { label: "Semanal", cor: "#7C3AED", background: "#EDE9FE" },
    MENSAL: { label: "Mensal", cor: "#0E7490", background: "#ECFEFF" },
    ANUAL: { label: "Anual", cor: "#B45309", background: "#FEF3C7" },
  };

  return (
    styles[frequencia as keyof typeof styles] ?? {
      label: frequencia ?? "",
      cor: "#424242",
      background: "",
    }
  );
};

const getStatusRecorrenciaStyle = (ativa: boolean) => {
  return ativa
    ? {
        label: "Ativa",
        cor: "#166534",
        background: "#DCFCE7",
      }
    : {
        label: "Inativa",
        cor: "#DC2626",
        background: "#FEE2E2",
      };
};

export const useRecorrencias = () => {
  return {
    headers,
    options,
    parametros,
    dataRecorrencias,
    acao,
    abriModalRecorrencia,
    abrirModalDeletar,
    abrirModalOcorrencias,
    abrirModalExecutar,
    recorrenciaSelecionada,
    recorrenciaEditando,
    recorrenciaOcorrencia,
    recorrenciaExecutar,
    opcoesMenu,
    filtrado,
    manipularModalRecorrencia,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getFrequenciaStyle,
    getStatusRecorrenciaStyle,
  };
};
