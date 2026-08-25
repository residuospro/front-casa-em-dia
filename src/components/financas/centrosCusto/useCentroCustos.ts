import { ref } from "vue";
import type { ICentroCusto } from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Cor", value: "cor", sortable: false },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalCentroCusto = ref(false);
const abrirModalDeletar = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const centroCustoSelecionado = ref<{ id: string; nome: string } | null>(null);
const centroCustoEditando = ref<ICentroCusto | null>(null);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = () => ({
  busca: null as string | null,
  ativo: null as boolean | null,
});

const estadoInicial = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [] as { coluna: string; direcao: "asc" | "desc" }[],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = () => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref(criarEstadoInicial());
const dataCentrosCusto = ref({
  data: [] as ICentroCusto[],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: typeof dataCentrosCusto.value) => {
  dataCentrosCusto.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalCentroCusto = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") centroCustoEditando.value = null;
  }

  abriModalCentroCusto.value = !abriModalCentroCusto.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const centroCusto = item as ICentroCusto;

  const maps = {
    editar: () => {
      centroCustoEditando.value = centroCusto;
      manipularModalCentroCusto("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      centroCustoSelecionado.value = {
        id: centroCusto.id,
        nome: centroCusto.nome,
      };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getAtivoStyle = (ativo: boolean) => {
  return ativo
    ? {
        label: "Ativo",
        cor: "#4C6749",
        background: "#E7F2E5",
      }
    : {
        label: "Inativo",
        cor: "#DC2626",
        background: "#FEF2F2",
      };
};

export const useCentroCustos = () => {
  return {
    headers,
    options,
    parametros,
    dataCentrosCusto,
    acao,
    abriModalCentroCusto,
    abrirModalDeletar,
    centroCustoSelecionado,
    centroCustoEditando,
    opcoesMenu,
    filtrado,
    manipularModalCentroCusto,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getAtivoStyle,
  };
};
