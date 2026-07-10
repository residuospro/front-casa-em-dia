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
const estadoInicial = [
  { label: "Editar", value: "editar", disabled: false },
  { label: "Excluir", value: "excluir", disabled: false },
];

const opcoesMenuCicloAtivo = ref([...estadoInicial]);
const opcoesMenu = ref([...estadoInicial]);

const ajustarOpçoesMenu = (ciclo: IResponseCiclos) => {
  console.log("aquuiii", ciclo);

  const existente = opcoesMenuCicloAtivo.value.some(
    (opcao) => opcao.value === "renovar-ciclo",
  );

  if (ciclo.ativo && ciclo.expirado && !existente) {
    opcoesMenuCicloAtivo.value.push({
      label: "Renovar ciclo",
      value: "renovar-ciclo",
      disabled: false,
    });

    return;
  }

  opcoesMenuCicloAtivo.value = [...estadoInicial];
};

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
  renovadoEm: string | null,
): Date => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataInicio = new Date(renovadoEm ?? inicio);
  dataInicio.setHours(0, 0, 0, 0);

  const diasPassados = Math.floor(
    (hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diasPassados <= 0) {
    return dataInicio;
  }

  const ciclosCompletos = Math.floor(diasPassados / duracaoDias);

  const renovacao = new Date(dataInicio);
  renovacao.setDate(dataInicio.getDate() + ciclosCompletos * duracaoDias);

  return renovacao;
};

const cicloAtivo = computed(() =>
  dataCiclos.value.find((ciclo) => ciclo.ativo),
);

const ciclosInativo = computed(() =>
  dataCiclos.value.filter((ciclo) => !ciclo.ativo),
);

const acoesMenuContext = (
  acao: string,
  id: string,
  nome: string,
  renovarCiclo: (cicloId: string) => Promise<void>,
) => {
  const mapsMenu = {
    editar: () => {
      router.push({ name: "novo-ciclo", query: { id } });
    },
    excluir: () => {
      abrirModalDeletar.value = true;
      ciclo.value = {
        nome,
        id,
      };
    },
    "renovar-ciclo": async () => {
      await renovarCiclo(id);
    },
  };

  const executar = mapsMenu[acao as keyof typeof mapsMenu];

  if (executar) executar();
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
    opcoesMenuCicloAtivo,
    calcularProgressoCiclo,
    diasDesdeInicio,
    calcularProximaRenovacao,
    acoesMenuContext,
    ajustarOpçoesMenu,
  };
};
