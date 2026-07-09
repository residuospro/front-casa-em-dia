import { ref } from "vue";
import type { FormCiclo } from "./type";

const estadoInicial: FormCiclo = {
  nome: "",
  descricao: "",
  duracaoDias: 7,
  inicio: "",
  ativo: true,
  participantes: [],
  renovacaoAutomatica: false,
  revezamentoAutomatico: false,
};

const form = ref<FormCiclo>({ ...estadoInicial });
const acao = ref<"criar" | "editar">("criar");
const idCiclo = ref("");

const passos = [
  {
    titulo: "Crie um ciclo",
    texto: "Defina a duração e a data de início.",
  },

  {
    titulo: "Adicione tarefas",
    texto: "Crie tarefas em modo revezamento.",
  },

  {
    titulo: "Sistema distribui",
    texto: "As tarefas serão distribuídas entre os membros.",
  },

  {
    titulo: "Ciclo reinicia",
    texto: "Ao final, as tarefas serão redistribuídas.",
  },
];

const limparForm = () => {
  form.value = { ...estadoInicial };
};

export const useNovoCiclo = () => {
  return {
    form,
    passos,
    acao,
    idCiclo,
    limparForm,
  };
};
