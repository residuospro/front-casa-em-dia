import { ref } from "vue";
import type { ITag } from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true, width: "10rem" },
  { text: "Cor", value: "cor", sortable: false, width: "2rem" },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalTag = ref(false);
const abrirModalDeletar = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const tagSelecionada = ref<{ id: string; nome: string } | null>(null);
const tagEditando = ref<ITag | null>(null);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = () => ({
  busca: null as string | null,
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
const dataTags = ref({
  data: [] as ITag[],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: typeof dataTags.value) => {
  dataTags.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalTag = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") tagEditando.value = null;
  }

  abriModalTag.value = !abriModalTag.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const tag = item as ITag;

  const maps = {
    editar: () => {
      tagEditando.value = tag;
      manipularModalTag("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      tagSelecionada.value = {
        id: tag.id,
        nome: tag.nome,
      };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

export const useTags = () => {
  return {
    headers,
    options,
    parametros,
    dataTags,
    acao,
    abriModalTag,
    abrirModalDeletar,
    tagSelecionada,
    tagEditando,
    opcoesMenu,
    filtrado,
    manipularModalTag,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
  };
};
