import { ref } from "vue";
import type { ILancamento } from "./tipagem";
import { StatusLancamentoValues } from "@/utils/tipagem";
import type {
  TipoLancamento,
  StatusLancamento,
} from "@/utils/tipagem";

const statusOrdem: Record<StatusLancamento, number> = {
  PENDENTE: 0,
  PAGO: 1,
  CANCELADO: 2,
  IGNORADO: 3,
};

const transicoesPermitidas: Record<StatusLancamento, StatusLancamento[]> = {
  PENDENTE: [StatusLancamentoValues.PAGO, StatusLancamentoValues.CANCELADO, StatusLancamentoValues.IGNORADO],
  PAGO: [StatusLancamentoValues.PENDENTE, StatusLancamentoValues.CANCELADO, StatusLancamentoValues.IGNORADO],
  CANCELADO: [StatusLancamentoValues.PENDENTE],
  IGNORADO: [StatusLancamentoValues.PENDENTE],
};

const proximoStatus: Record<StatusLancamento, StatusLancamento> = {
  PENDENTE: StatusLancamentoValues.PAGO,
  PAGO: StatusLancamentoValues.PENDENTE,
  CANCELADO: StatusLancamentoValues.PENDENTE,
  IGNORADO: StatusLancamentoValues.PENDENTE,
};

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Data", value: "dataHora", sortable: true },
  { text: "Título", value: "titulo", sortable: false },
  { text: "Tipo", value: "tipo", sortable: false },
  { text: "Valor", value: "valor", sortable: true },
  { text: "Conta", value: "contaOrigem", sortable: false },
  { text: "Status", value: "status", sortable: false },
  { text: "Ações", value: "acoes", sortable: false },
];

const abriModalLancamento = ref(false);
const abrirModalDeletar = ref(false);
const abrirModalVisualizar = ref(false);
const abrirModalStatus = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const lancamentoSelecionado = ref<{ id: string; titulo: string } | null>(null);
const lancamentoEditando = ref<ILancamento | null>(null);
const lancamentoVisualizando = ref<ILancamento | null>(null);
const lancamentoStatusAlteracao = ref<ILancamento | null>(null);
const novoStatus = ref<StatusLancamento | null>(null);

const opcoesMenu = [
  { label: "Visualizar", value: "visualizar" },
  { label: "Editar", value: "editar" },
  { label: "Alterar status", value: "alterar-status" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = () => ({
  busca: null as string | null,
  tipo: null as TipoLancamento[] | null,
  status: null as StatusLancamento[] | null,
  inicio: null as string | null,
  fim: null as string | null,
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
const dataLancamentos = ref({
  data: [] as ILancamento[],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: typeof dataLancamentos.value) => {
  dataLancamentos.value = { ...res };
  parametros.value = { ...parametros.value, ...res };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalLancamento = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") lancamentoEditando.value = null;
  }

  abriModalLancamento.value = !abriModalLancamento.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const lancamento = item as ILancamento;

  const maps = {
    visualizar: () => {
      lancamentoVisualizando.value = lancamento;
      abrirModalVisualizar.value = true;
    },
    editar: () => {
      lancamentoEditando.value = lancamento;
      manipularModalLancamento("editar");
    },
    "alterar-status": () => {
      alterarStatusLancamento(lancamento);
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      lancamentoSelecionado.value = {
        id: lancamento.id,
        titulo: lancamento.titulo,
      };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const alterarStatusLancamento = (lancamento: ILancamento) => {
  lancamentoStatusAlteracao.value = lancamento;
  novoStatus.value = proximoStatus[lancamento.status];
  abrirModalStatus.value = true;
};

const statusPermitidos = (status: StatusLancamento) => {
  return [...transicoesPermitidas[status]].sort(
    (a, b) => statusOrdem[a] - statusOrdem[b],
  );
};

const fecharModalStatus = () => {
  abrirModalStatus.value = false;
  lancamentoStatusAlteracao.value = null;
  novoStatus.value = null;
};

const getTipoStyle = (tipo: TipoLancamento) => {
  const map: Record<TipoLancamento, { label: string; cor: string; background: string }> = {
    RECEITA: { label: "Receita", cor: "#166534", background: "#DCFCE7" },
    DESPESA: { label: "Despesa", cor: "#991B1B", background: "#FEE2E2" },
    TRANSFERENCIA: { label: "Transferência", cor: "#1E40AF", background: "#DBEAFE" },
    AJUSTE: { label: "Ajuste", cor: "#92400E", background: "#FEF3C7" },
  };
  return map[tipo] ?? { label: tipo, cor: "#000", background: "#F3F4F6" };
};

const getStatusStyle = (status: StatusLancamento) => {
  const map: Record<StatusLancamento, { label: string; cor: string; background: string }> = {
    PENDENTE: { label: "Pendente", cor: "#92400E", background: "#FEF3C7" },
    PAGO: { label: "Pago", cor: "#166534", background: "#DCFCE7" },
    CANCELADO: { label: "Cancelado", cor: "#991B1B", background: "#FEE2E2" },
    IGNORADO: { label: "Ignorado", cor: "#6B7280", background: "#F3F4F6" },
  };
  return map[status] ?? { label: status, cor: "#000", background: "#F3F4F6" };
};

export const useLancamentos = () => {
  return {
    headers,
    options,
    parametros,
    dataLancamentos,
    acao,
    abriModalLancamento,
    abrirModalDeletar,
    abrirModalVisualizar,
    abrirModalStatus,
    lancamentoSelecionado,
    lancamentoEditando,
    lancamentoVisualizando,
    lancamentoStatusAlteracao,
    novoStatus,
    opcoesMenu,
    filtrado,
    manipularModalLancamento,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    statusPermitidos,
    fecharModalStatus,
    getTipoStyle,
    getStatusStyle,
  };
};
