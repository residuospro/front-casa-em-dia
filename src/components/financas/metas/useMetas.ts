import { ref } from "vue";
import type { StatusMetaFinanceira, TipoMetaFinanceira, TipoMovimentacaoMeta } from "@/utils/tipagem";
import type {
  FiltroMetas,
  IMetaFinanceira,
  IResponseMetas,
  ParametrosMetas,
} from "./tipagem";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Título", value: "titulo", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Valor objetivo", value: "valorObjetivo", sortable: true },
  { text: "Progresso", value: "valorAtual", sortable: true },
  { text: "Status", value: "status", sortable: true },
  { text: "Data limite", value: "dataLimite", sortable: true },
  { text: "Ações", value: "acoes", sortable: false },
];

const abrirModalMeta = ref(false);
const abrirModalVisualizar = ref(false);
const abrirModalMovimentacao = ref(false);
const abrirModalDeletar = ref(false);
const acao = ref<"criar" | "editar">("criar");
const filtrado = ref(false);
const metaDeletando = ref<{ id: string; titulo: string } | null>(null);
const metaConcluindo = ref<{ id: string; titulo: string } | null>(null);
const metaEditando = ref<IMetaFinanceira | null>(null);
const metaVisualizando = ref<IMetaFinanceira | null>(null);
const metaMovimentando = ref<IMetaFinanceira | null>(null);

const opcoesMenu = [
  { label: "Visualizar", value: "visualizar" },
  { label: "Movimentar", value: "movimentar" },
  { label: "Concluir", value: "concluir" },
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = (): FiltroMetas => ({
  busca: null,
  status: null,
  tipo: null,
});

const estadoInicial: ParametrosMetas = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosMetas => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosMetas>(criarEstadoInicial());
const dataMetas = ref<IResponseMetas>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: IResponseMetas) => {
  dataMetas.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalMeta = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") metaEditando.value = null;
  }

  abrirModalMeta.value = !abrirModalMeta.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const meta = item as IMetaFinanceira;

  const maps = {
    visualizar: () => {
      metaVisualizando.value = meta;
      abrirModalVisualizar.value = true;
    },
    movimentar: () => {
      metaMovimentando.value = meta;
      abrirModalMovimentacao.value = true;
    },
    concluir: () => {
      metaConcluindo.value = { id: meta.id, titulo: meta.titulo };
    },
    editar: () => {
      metaEditando.value = meta;
      manipularModalMeta("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      metaDeletando.value = { id: meta.id, titulo: meta.titulo };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getTipoMetaStyle = (tipo?: TipoMetaFinanceira) => {
  const styles: Record<TipoMetaFinanceira, { label: string; cor: string; background: string }> = {
    ECONOMIA: { label: "Economia", cor: "#166534", background: "#DCFCE7" },
    QUITAR_DIVIDA: { label: "Quitar dívida", cor: "#B45309", background: "#FEF3C7" },
    INVESTIMENTO: { label: "Investimento", cor: "#7C3AED", background: "#EDE9FE" },
    OBJETIVO: { label: "Objetivo", cor: "#1E40AF", background: "#DBEAFE" },
  };

  return (
    styles[tipo as keyof typeof styles] ?? {
      label: tipo ?? "",
      cor: "#424242",
      background: "",
    }
  );
};

const getStatusMetaStyle = (status?: StatusMetaFinanceira) => {
  const styles: Record<StatusMetaFinanceira, { label: string; cor: string; background: string }> = {
    EM_ANDAMENTO: { label: "Em andamento", cor: "#1D4ED8", background: "#EFF6FF" },
    CONCLUIDA: { label: "Concluída", cor: "#166534", background: "#DCFCE7" },
    CANCELADA: { label: "Cancelada", cor: "#991B1B", background: "#FEE2E2" },
  };

  return (
    styles[status as keyof typeof styles] ?? {
      label: status ?? "",
      cor: "#424242",
      background: "",
    }
  );
};

const getMovimentacaoStyle = (tipo?: TipoMovimentacaoMeta) => {
  return tipo === "SAIDA"
    ? { label: "Saída", cor: "#DC2626", background: "#FEF2F2" }
    : { label: "Entrada", cor: "#166534", background: "#DCFCE7" };
};

export const useMetas = () => {
  return {
    headers,
    options,
    parametros,
    dataMetas,
    acao,
    abrirModalMeta,
    abrirModalVisualizar,
    abrirModalMovimentacao,
    abrirModalDeletar,
    metaDeletando,
    metaConcluindo,
    metaEditando,
    metaVisualizando,
    metaMovimentando,
    opcoesMenu,
    filtrado,
    manipularModalMeta,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getTipoMetaStyle,
    getStatusMetaStyle,
    getMovimentacaoStyle,
  };
};