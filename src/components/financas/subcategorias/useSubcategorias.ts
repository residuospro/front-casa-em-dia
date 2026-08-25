import { ref } from "vue";
import type { ISubcategoria } from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Categoria", value: "categoria", sortable: false },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalSubcategoria = ref(false);
const abrirModalDeletar = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const subcategoriaSelecionada = ref<{ id: string; nome: string } | null>(null);
const subcategoriaEditando = ref<ISubcategoria | null>(null);
const categoriaSelecionadaId = ref<string | null>(null);

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
const dataSubcategorias = ref({
  data: [] as ISubcategoria[],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: typeof dataSubcategorias.value) => {
  dataSubcategorias.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalSubcategoria = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") subcategoriaEditando.value = null;
  }

  abriModalSubcategoria.value = !abriModalSubcategoria.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const subcategoria = item as ISubcategoria;

  const maps = {
    editar: () => {
      subcategoriaEditando.value = subcategoria;
      manipularModalSubcategoria("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      subcategoriaSelecionada.value = {
        id: subcategoria.id,
        nome: subcategoria.nome,
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

export const useSubcategorias = () => {
  return {
    headers,
    options,
    parametros,
    dataSubcategorias,
    acao,
    categoriaSelecionadaId,
    abriModalSubcategoria,
    abrirModalDeletar,
    subcategoriaSelecionada,
    subcategoriaEditando,
    opcoesMenu,
    filtrado,
    manipularModalSubcategoria,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getAtivoStyle,
  };
};
