import { ref } from "vue";
import type { Moeda, TipoCartao } from "@/utils/tipagem";
import type {
  FiltroCartoes,
  ICartao,
  IResponseCartoes,
  ParametrosCartoes,
} from "./tipagem";
import { useContaBancaria } from "../contasBancarias/useContasBancarias";

const options = [5, 10, 25, 50, 100];

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Conta", value: "conta", sortable: false },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Bandeira", value: "bandeira", sortable: true },
  { text: "Limite", value: "limite", sortable: true },
  { text: "Fechamento", value: "fechamentoDia", sortable: true },
  { text: "Vencimento", value: "vencimentoDia", sortable: true },
  { text: "Melhor Dia", value: "melhorDiaCompra", sortable: true },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalCartao = ref(false);
const abrirModalDeletar = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
const cartaoSelecionado = ref<{ id: string; nome: string } | null>(null);
const cartaoEditando = ref<ICartao | null>(null);

const opcoesMenu = [
  { label: "Editar", value: "editar" },
  { label: "Excluir", value: "excluir", color: "#ff0000" },
];

const criarFiltroInicial = (): FiltroCartoes => ({
  busca: null,
  ativo: null,
  tipo: null,
});

const estadoInicial: ParametrosCartoes = {
  paginacao: {
    pagina: 1,
    por_pagina: 10,
    total: 0,
    ultima_pagina: 0,
  },
  ordenacao: [],
  filtro: criarFiltroInicial(),
};

const criarEstadoInicial = (): ParametrosCartoes => ({
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const parametros = ref<ParametrosCartoes>(criarEstadoInicial());
const dataCartoes = ref<IResponseCartoes>({
  data: [],
  paginacao: { ...estadoInicial.paginacao },
  ordenacao: [...estadoInicial.ordenacao],
  filtro: criarFiltroInicial(),
});

const manipularResposta = (res: IResponseCartoes) => {
  const { data, ...resto } = res;
  dataCartoes.value = { ...res };
  parametros.value = { ...parametros.value, ...resto };
};

const resetarParametros = () => {
  parametros.value = criarEstadoInicial();
  filtrado.value = false;
};

const manipularModalCartao = (novaAcao?: "criar" | "editar") => {
  if (novaAcao) {
    acao.value = novaAcao;

    if (novaAcao === "criar") cartaoEditando.value = null;
  }

  abriModalCartao.value = !abriModalCartao.value;
};

const executarOpcoesMenu = (opcao: string, item: Record<string, any>) => {
  const cartao = item as ICartao;

  const maps = {
    editar: () => {
      cartaoEditando.value = cartao;
      manipularModalCartao("editar");
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      cartaoSelecionado.value = { id: cartao.id, nome: cartao.nome };
    },
  };

  const action = maps[opcao as keyof typeof maps];

  if (action) {
    action();
  }
};

const getTipoCartaoStyle = (tipo?: TipoCartao) => {
  if (!tipo) {
    return {
      label: "",
      cor: "#424242",
      background: "",
    };
  }

  const styles = {
    CREDITO: {
      label: "Crédito",
      cor: "#3B82F6",
      background: "#EFF6FF",
    },

    DEBITO: {
      label: "Débito",
      cor: "#A56A00",
      background: "#FFF4D6",
    },

    AMBOS: {
      label: "Ambos",
      cor: "#8B5CF6",
      background: "#F5F3FF",
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

const getStatusCartaoStyle = (ativo: boolean) => {
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

const getNomeConta = (contaId?: string | null) => {
  if (!contaId) return "----";

  const { dataContas } = useContaBancaria();
  const conta = dataContas.value.data.find((conta) => conta.id === contaId);

  return conta?.nome ?? "----";
};

const getMoedaDaConta = (contaId?: string | null): Moeda => {
  if (!contaId) return "BRL";

  const { dataContas } = useContaBancaria();
  const conta = dataContas.value.data.find((conta) => conta.id === contaId);

  return conta?.moeda ?? "BRL";
};

export const useCartoes = () => {
  return {
    headers,
    options,
    parametros,
    dataCartoes,
    acao,
    abriModalCartao,
    abrirModalDeletar,
    cartaoSelecionado,
    cartaoEditando,
    opcoesMenu,
    filtrado,
    manipularModalCartao,
    manipularResposta,
    resetarParametros,
    executarOpcoesMenu,
    getTipoCartaoStyle,
    getStatusCartaoStyle,
    getNomeConta,
    getMoedaDaConta,
  };
};
