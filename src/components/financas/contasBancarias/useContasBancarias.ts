import { ref } from "vue";
import type { Moeda, TipoConta } from "@/utils/tipagem";
import type {
  FiltroContas,
  IConta,
  IResponseContas,
  ParametrosContas,
} from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Instituição", value: "instituicao", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Moeda", value: "moeda", sortable: true },
  { text: "Saldo Inicial", value: "saldoInicial", sortable: true },
  { text: "Saldo Previsto", value: "saldoPrevisto", sortable: true },
  { text: "Saldo Atual", value: "saldoAtual", sortable: true },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalContaBancaria = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const abrirModalDeletar = ref(false);
const contaSelecionada = ref<{ id: string; nome: string } | null>(null);
const contaEditando = ref<IConta | null>(null);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];
const criarFiltroInicial = (): FiltroContas => ({
  busca: null,
  ativo: null,
  tipo: null,
});

const estadoInicial: ParametrosContas = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosContas => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosContas>(criarEstadoInicial());
const dataContas = ref<IResponseContas>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: IResponseContas) => {
  const { data, ...resto } = res;
  dataContas.value = { ...res };
  parametros.value = { ...parametros.value, ...resto };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalContaBancaria = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") contaEditando.value = null;
  }

  abriModalContaBancaria.value = !abriModalContaBancaria.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const conta = item as IConta;

  const maps = {
    editar: () => {
      contaEditando.value = conta;
      manipularModalContaBancaria("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      contaSelecionada.value = { id: conta.id, nome: conta.nome };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getTipoContaStyle = (tipo?: TipoConta) => {
  if (!tipo) {
    return {
      label: "",
      cor: "#424242",
      background: "",
    };
  }

  const styles = {
    CONTA_CORRENTE: {
      label: "Conta corrente",
      cor: "#3B82F6",
      background: "#EFF6FF",
    },

    POUPANCA: {
      label: "Poupança",
      cor: "#39704A",
      background: "#EEF5EA",
    },

    DINHEIRO: {
      label: "Dinheiro",
      cor: "#A56A00",
      background: "#FFF4D6",
    },

    INVESTIMENTO: {
      label: "Investimento",
      cor: "#8B5CF6",
      background: "#F5F3FF",
    },

    CARTEIRA: {
      label: "Carteira",
      cor: "#E05A6F",
      background: "#FFF1F3",
    },
  };

  return (
    styles[tipo as keyof typeof styles] ?? {
      label: tipo,
      cor: "#424242",
      background: "",
    }
  );
};

const getMoedaStyle = (moeda?: Moeda) => {
  if (!moeda) {
    return {
      cor: "#424242",
      background: "",
    };
  }

  const styles = {
    BRL: {
      cor: "#1B7A43",
      background: "#E6F4EA",
    },

    EUR: {
      cor: "#2563EB",
      background: "#EFF6FF",
    },

    USD: {
      cor: "#0E7490",
      background: "#ECFEFF",
    },
  };

  return styles[moeda];
};

const getStatusContaStyle = (ativo: boolean) => {
  return ativo
    ? {
        label: "Ativa",
        cor: "#4C6749",
        background: "#E7F2E5",
      }
    : {
        label: "Inativa",
        cor: "#DC2626",
        background: "#FEF2F2",
      };
};

export const useContaBancaria = () => {
  return {
    headers,
    options,
    parametros,
    dataContas,
    acao,
    abriModalContaBancaria,
    manipularModalContaBancaria,
    manipularResposta,
    resetarParametros,
    getTipoContaStyle,
    getMoedaStyle,
    getStatusContaStyle,
    abrirModalDeletar,
    contaSelecionada,
    contaEditando,
    opcoesMenu,
    executarOpcoesMenu,
  };
};
