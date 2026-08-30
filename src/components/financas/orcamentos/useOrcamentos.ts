import { computed, ref } from "vue";
import type { IndicadorOrcamento } from "@/utils/tipagem";
import type {
  IOrcamento,
  IResumoOrcamentos,
  IResponseOrcamentos,
  ParametrosOrcamentos,
} from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Categoria", value: "categoria", sortable: false },
  { text: "Limite", value: "valorLimite", sortable: true },
  { text: "Utilizado", value: "valorAtual", sortable: true },
  { text: "Restante", value: "valorRestante", sortable: false },
  { text: "% Utilizado", value: "percentualUtilizado", sortable: true },
  { text: "Status", value: "indicador", sortable: false },
  { text: "Ações", value: "acoes", sortable: false },
];

const mesesNomes = [
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

const opcoesMeses = mesesNomes.map((nome, indice) => ({
  text: nome,
  value: String(indice + 1),
}));

const anoAtual = new Date().getFullYear();
const opcoesAnos = Array.from({ length: 3 }, (_, i) => anoAtual - i).map(
  (ano) => ({ text: String(ano), value: String(ano) }),
);

const hoje = new Date();
const mesInicial = String(hoje.getMonth() + 1);
const anoInicial = String(hoje.getFullYear());

const abrirModalOrcamento = ref(false);
const abrirModalDeletar = ref(false);
const acao = ref<"criar" | "editar">("criar");
const filtrado = ref(false);
const orcamentoEditando = ref<IOrcamento | null>(null);
const orcamentoDeletando = ref<{ id: string; nome: string } | null>(null);

const mesSelecionado = ref<string>(mesInicial);
const anoSelecionado = ref<string>(anoInicial);
const statusSelecionado = ref<string>("");
const busca = ref<string>("");

const opcoesCategorias = ref<{ text: string; value: string }[]>([]);
const categoriaSelecionada = ref<string>("");

const opcoesCategoriasFiltro = computed(() => [
  { text: "Todas as categorias", value: "" },
  ...opcoesCategorias.value,
]);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const estadoInicial: ParametrosOrcamentos = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
};

const parametros = ref<ParametrosOrcamentos>({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
});

const dataOrcamentos = ref<IResponseOrcamentos>({
  data: [],
  filtro: {
    mes: Number(mesInicial),
    ano: Number(anoInicial),
    status: null,
    busca: null,
  },
  ordenacao: [...estadoInicial.ordenacao],
  paginacao: { ...estadoInicial.paginacao },
});

const resumo = ref<IResumoOrcamentos>({
  mes: Number(mesInicial),
  ano: Number(anoInicial),
  quantidadeOrcamentos: 0,
  totalOrcado: 0,
  totalConsumido: 0,
  totalRestante: 0,
  percentualGlobal: 0,
  porIndicador: {
    NORMAL: 0,
    PROXIMO: 0,
    ULTRAPASSADO: 0,
  },
  orcamentos: [],
});

const manipularResposta = (res: IResponseOrcamentos) => {
  dataOrcamentos.value = { ...res, filtro: dataOrcamentos.value.filtro };
  parametros.value = {
    ...parametros.value,
    paginacao: res.paginacao,
    ordenacao: res.ordenacao,
  };
};

const resetarParametros = () => {
  parametros.value = {
    paginacao: { ...estadoInicial.paginacao },
    ordenacao: [...estadoInicial.ordenacao],
  };
  filtrado.value = false;
};

const manipularModalOrcamento = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") orcamentoEditando.value = null;
  }

  abrirModalOrcamento.value = !abrirModalOrcamento.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const orcamento = item as IOrcamento;

  const maps = {
    editar: () => {
      orcamentoEditando.value = orcamento;
      manipularModalOrcamento("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      orcamentoDeletando.value = {
        id: orcamento.id,
        nome: orcamento.categoria?.nome ?? "orçamento",
      };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getIndicadorStyle = (indicador?: IndicadorOrcamento) => {
  const styles: Record<
    IndicadorOrcamento,
    { label: string; cor: string; background: string; border: string }
  > = {
    NORMAL: {
      label: "Dentro do limite",
      cor: "#438b4d",
      background: "#EFF9F1",
      border: "#cfe9d3",
    },
    PROXIMO: {
      label: "Próximo do limite",
      cor: "#f59e0b",
      background: "#fff8ea",
      border: "#ffdca0",
    },
    ULTRAPASSADO: {
      label: "Ultrapassado",
      cor: "#e53935",
      background: "#fff0f0",
      border: "#ffd0d0",
    },
  };

  return (
    styles[indicador as keyof typeof styles] ?? {
      label: indicador ?? "",
      cor: "#424242",
      background: "",
      border: "",
    }
  );
};

const opcoesStatus = [
  { text: "Todos os status", value: "" },
  { text: "Dentro do limite", value: "NORMAL" },
  { text: "Próximo do limite", value: "PROXIMO" },
  { text: "Ultrapassado", value: "ULTRAPASSADO" },
];

const serializarParametros = (): Record<string, any> => {
  const params: Record<string, any> = {
    mes: Number(mesSelecionado.value),
    ano: Number(anoSelecionado.value),
    pagina: parametros.value.paginacao.pagina,
    por_pagina: parametros.value.paginacao.por_pagina,
  };

  if (parametros.value.ordenacao.length) {
    params.ordenacao = parametros.value.ordenacao;
  }

  if (categoriaSelecionada.value) {
    params.categoriaId = categoriaSelecionada.value;
  }

  if (statusSelecionado.value) {
    params.status = statusSelecionado.value;
  }

  if (busca.value.trim()) {
    params.busca = busca.value.trim();
  }

  return params;
};

export const useOrcamentos = () => {
  return {
    headers,
    options,
    parametros,
    dataOrcamentos,
    resumo,
    acao,
    abrirModalOrcamento,
    abrirModalDeletar,
    orcamentoEditando,
    orcamentoDeletando,
    opcoesMenu,
    opcoesStatus,
    mesesNomes,
    opcoesMeses,
    opcoesAnos,
    mesSelecionado,
    anoSelecionado,
    statusSelecionado,
    busca,
    opcoesCategorias,
    opcoesCategoriasFiltro,
    categoriaSelecionada,
    filtrado,
    serializarParametros,
    manipularModalOrcamento,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getIndicadorStyle,
  };
};
