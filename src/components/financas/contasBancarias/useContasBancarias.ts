import { ref } from "vue";
import type {
  FiltroContas,
  IResponseContas,
  ParametrosContas,
} from "./tipagem";

const headers = [
  { text: "Nome", value: "nome", sortable: true },
  { text: "Instituição", value: "instituicao", sortable: true },
  { text: "Tipo", value: "tipo", sortable: true },
  { text: "Moeda", value: "moeda", sortable: true },
  { text: "Saldo Inicial", value: "saldoInicial", sortable: true },
  { text: "Saldo Atual", value: "saldoAtual", sortable: true },
  { text: "Saldo Previsto", value: "saldoPrevisto", sortable: true },
  { text: "Status", value: "ativo", sortable: true },
  { text: "Ações", value: "acoes", sortable: true },
];

const abriModalContaBancaria = ref(false);
const filtrado = ref(false);
const acao = ref<"criar" | "editar">("criar");
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

const manipularModalContaBancaria = () => {
  abriModalContaBancaria.value = !abriModalContaBancaria.value;
};

export const useContaBancaria = () => {
  return {
    headers,
    parametros,
    dataContas,
    acao,
    abriModalContaBancaria,
    manipularModalContaBancaria,
    manipularResposta,
    resetarParametros,
  };
};
