import { computed, ref } from "vue";
import type { IResponseCiclos } from "./type";
import router from "@/router";
import type { IOpcoes } from "@/utils/interfaces";

const dataCiclos = ref<IResponseCiclos[]>([]);
const abrirModalDeletar = ref(false);
const opcaoCiclo = ref<IOpcoes[]>([]);
const ativo = ref(false);
const ciclo = ref({
  nome: "",
  id: "",
});
const opcoesMenu = [
  { label: "Editar", value: "editar", disabled: false },
  { label: "Excluir", value: "excluir", disabled: false },
];

const calcularProgressoCiclo = (inicio: Date, duracaoDias: number) => {
  const hoje = new Date();

  const inicioData = new Date(inicio);

  inicioData.setHours(0, 0, 0, 0);
  hoje.setHours(0, 0, 0, 0);

  const diffMs = hoje.getTime() - inicioData.getTime();

  const diasPassados = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diasPassados <= 0) {
    return 0;
  }

  const progresso = ((diasPassados - 1) / duracaoDias) * 100;

  return Math.round(progresso);
};

const diasDesdeInicio = (
  inicio: Date | string,
  duracaoDias: number,
): number => {
  const hoje = new Date();
  const dataInicio = new Date(inicio);

  hoje.setHours(0, 0, 0, 0);
  dataInicio.setHours(0, 0, 0, 0);

  const diferenca = hoje.getTime() - dataInicio.getTime();

  const diasPassados = Math.floor(diferenca / (1000 * 60 * 60 * 24));

  // primeiro dia conta como 1
  const diaAtual = diasPassados + 1;

  return Math.min(diaAtual, duracaoDias);
};

const calcularProximaRenovacao = (
  inicio: Date | string,
  duracaoDias: number,
): Date => {
  const hoje = new Date();
  const dataInicio = new Date(inicio);

  hoje.setHours(0, 0, 0, 0);
  dataInicio.setHours(0, 0, 0, 0);

  let proximaData = new Date(dataInicio);

  while (proximaData <= hoje) {
    proximaData.setDate(proximaData.getDate() + duracaoDias);
  }

  return proximaData;
};

const cicloAtivo = computed(() =>
  dataCiclos.value.find((ciclo) => ciclo.ativo),
);

const ciclosInativo = computed(() =>
  dataCiclos.value.filter((ciclo) => !ciclo.ativo),
);

const acoesMenuContext = (acao: string, id: string, nome: string) => {
  if (acao === "editar") {
    router.push({ name: "novo-ciclo", query: { id } });
  } else if (acao === "excluir") {
    abrirModalDeletar.value = true;
    ciclo.value = {
      nome,
      id,
    };
  }
};

export const useCiclos = () => {
  return {
    dataCiclos,
    cicloAtivo,
    ciclosInativo,
    opcoesMenu,
    ciclo,
    abrirModalDeletar,
    ativo,
    opcaoCiclo,
    calcularProgressoCiclo,
    diasDesdeInicio,
    calcularProximaRenovacao,
    acoesMenuContext,
  };
};
