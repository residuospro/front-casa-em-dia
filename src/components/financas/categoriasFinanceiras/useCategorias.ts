import { ref } from "vue";
import type { StatusCategoria, TipoCategoriaFinanceira } from "@/utils/tipagem";
import type {
  FiltroCategorias,
  ICategoria,
  IResponseCategorias,
  ParametrosCategorias,
} from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Cor", value: "cor", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalCategoria = ref(false);
const abrirModalDeletar = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const categoriaSelecionada = ref<{ id: string; nome: string } | null>(null);
const categoriaEditando = ref<ICategoria | null>(null);
const incluirArquivadas = ref(false);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = (): FiltroCategorias => ({
  busca: null,
  ativo: null,
  tipo: null,
});

const estadoInicial: ParametrosCategorias = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosCategorias => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosCategorias>(criarEstadoInicial());
const dataCategorias = ref<IResponseCategorias>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: IResponseCategorias) => {
  const { data, ...resto } = res;
  dataCategorias.value = { ...res };
  parametros.value = { ...parametros.value, ...resto };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalCategoria = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") categoriaEditando.value = null;
  }

  abriModalCategoria.value = !abriModalCategoria.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const categoria = item as ICategoria;

  const maps = {
    editar: () => {
      categoriaEditando.value = categoria;
      manipularModalCategoria("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      categoriaSelecionada.value = { id: categoria.id, nome: categoria.nome };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getTipoCategoriaStyle = (tipo?: TipoCategoriaFinanceira) => {
  if (!tipo) {
    return { label: "", cor: "#424242", background: "" };
  }

  const styles = {
    RECEITA: {
      label: "Receita",
      cor: "#39704A",
      background: "#EEF5EA",
    },
    DESPESA: {
      label: "Despesa",
      cor: "#DC2626",
      background: "#FEF2F2",
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

const getStatusCategoriaStyle = (status?: StatusCategoria) => {
  if (!status) {
    return { label: "", cor: "#424242", background: "" };
  }

  const styles = {
    ATIVA: {
      label: "Ativa",
      cor: "#4C6749",
      background: "#E7F2E5",
    },
    ARQUIVADA: {
      label: "Arquivada",
      cor: "#A56A00",
      background: "#FFF4D6",
    },
  };

  return styles[status];
};

export const useCategorias = () => {
  return {
    headers,
    options,
    parametros,
    dataCategorias,
    acao,
    incluirArquivadas,
    abriModalCategoria,
    abrirModalDeletar,
    categoriaSelecionada,
    categoriaEditando,
    opcoesMenu,
    filtrado,
    manipularModalCategoria,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getTipoCategoriaStyle,
    getStatusCategoriaStyle,
  };
};
