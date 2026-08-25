import { computed, ref, watch } from "vue";
import { useLancamentos } from "../useLancamentos";
import { useContaBancaria } from "../../contasBancarias/useContasBancarias";
import { useCategorias } from "../../categoriasFinanceiras/useCategorias";
import { useCentroCustos } from "../../centrosCusto/useCentroCustos";
import { useCartoes } from "../../cartoes/useCartoes";
import { useTags } from "../../tags/useTags";
import type { TipoLancamento, FormaPagamento } from "@/utils/tipagem";

const estadoInicialForm = () => ({
  tipo: "DESPESA" as TipoLancamento,
  titulo: "",
  descricao: "",
  valor: 0,
  dataHora: new Date().toISOString().slice(0, 16),
  contaOrigemId: "",
  contaDestinoId: "",
  categoriaId: "",
  subcategoriaId: "",
  centroCustoId: "",
  cartaoId: "",
  formaPagamento: "" as FormaPagamento | "",
  responsavelId: "",
  tagsIds: [] as string[],
  observacoes: "",
  localizacao: "",
});

const formLancamento = ref(estadoInicialForm());

const {
  acao,
  abriModalLancamento,
  lancamentoEditando,
} = useLancamentos();
const { dataContas } = useContaBancaria();
const { dataCategorias } = useCategorias();
const { dataCentrosCusto } = useCentroCustos();
const { dataCartoes } = useCartoes();
const { dataTags } = useTags();

const opcoesContas = computed(() =>
  dataContas.value.data.map((c) => ({ text: c.nome, value: c.id })),
);

const opcoesCategorias = computed(() =>
  dataCategorias.value.data.map((c) => ({ text: c.nome, value: c.id })),
);

const opcoesCentrosCusto = computed(() =>
  dataCentrosCusto.value.data.map((c) => ({ text: c.nome, value: c.id })),
);

const opcoesCartoes = computed(() =>
  dataCartoes.value.data.map((c) => ({ text: c.nome, value: c.id })),
);

const opcoesTags = computed(() =>
  dataTags.value.data.map((t) => ({ text: t.nome, value: t.id })),
);

const opcoesFormaPagamento = [
  { text: "PIX", value: "PIX" },
  { text: "Dinheiro", value: "DINHEIRO" },
  { text: "Débito", value: "DEBITO" },
  { text: "Crédito", value: "CREDITO" },
  { text: "Boleto", value: "BOLETO" },
  { text: "Transferência", value: "TRANSFERENCIA" },
  { text: "Outro", value: "OUTRO" },
];

const opcoesTipo = [
  { text: "Receita", value: "RECEITA" },
  { text: "Despesa", value: "DESPESA" },
  { text: "Transferência", value: "TRANSFERENCIA" },
  { text: "Ajuste", value: "AJUSTE" },
];

const mostraContaDestino = () => formLancamento.value.tipo === "TRANSFERENCIA";
const mostraCategoria = () =>
  formLancamento.value.tipo === "RECEITA" ||
  formLancamento.value.tipo === "DESPESA";

watch(abriModalLancamento, (aberto) => {
  if (!aberto) return;

  if (acao.value === "editar" && lancamentoEditando.value) {
    const l = lancamentoEditando.value;

    formLancamento.value = {
      tipo: l.tipo,
      titulo: l.titulo,
      descricao: l.descricao ?? "",
      valor: Number(l.valor),
      dataHora: new Date(l.dataHora).toISOString().slice(0, 16),
      contaOrigemId: l.contaOrigemId,
      contaDestinoId: l.contaDestinoId ?? "",
      categoriaId: l.categoriaId ?? "",
      subcategoriaId: l.subcategoriaId ?? "",
      centroCustoId: l.centroCustoId ?? "",
      cartaoId: l.cartaoId ?? "",
      formaPagamento: (l.formaPagamento as FormaPagamento) ?? "",
      responsavelId: l.responsavelId,
      tagsIds: l.tags?.map((t) => t.tag.id) ?? [],
      observacoes: l.observacoes ?? "",
      localizacao: l.localizacao ?? "",
    };
  } else {
    formLancamento.value = estadoInicialForm();
  }
});

export const useNovoLancamento = () => {
  return {
    formLancamento,
    opcoesContas,
    opcoesCategorias,
    opcoesCentrosCusto,
    opcoesCartoes,
    opcoesTags,
    opcoesFormaPagamento,
    opcoesTipo,
    mostraContaDestino,
    mostraCategoria,
  };
};
