import { ref } from "vue";
import type { IFamilia } from "./tipagem";
import type { IOpcoes } from "@/utils/interfaces";

const opcoesMembroFamiliar = [
  {
    text: "Marido",
    value: "MARIDO",
  },
  {
    text: "Esposa",
    value: "ESPOSA",
  },
  {
    text: "Filho",
    value: "FILHO",
  },
  {
    text: "Filha",
    value: "FILHA",
  },
  {
    text: "Outro",
    value: "OUTRO",
  },
];

const opcoesGenero = [
  {
    text: "Masculino",
    value: "MASCULINO",
  },
  {
    text: "Feminino",
    value: "FEMININO",
  },
  {
    text: "Outro",
    value: "OUTRO",
  },
];

const opcoesPermissao = [
  {
    text: "Administrador(a)",
    value: "ADMIN",
  },
  {
    text: "Usuário",
    value: "USUARIO",
  },
];

const abaAtiva = ref("criar-dependente");
const tabs = [
  { label: "Criar dependente", value: "criar-dependente" },
  { label: "Convidar membro", value: "convidar-membro" },
];
const dataFamilia = ref<IFamilia[]>([]);
const editando = ref(false);
const opcoesFamiliares = ref<IOpcoes[]>([]);
const abrirModalDeletar = ref(false);

const permitirEdicao = () => {
  editando.value = !editando.value;
};

export const useMinhaFamilia = () => {
  return {
    opcoesMembroFamiliar,
    dataFamilia,
    editando,
    opcoesGenero,
    opcoesPermissao,
    abaAtiva,
    tabs,
    abrirModalDeletar,
    opcoesFamiliares,
    permitirEdicao,
  };
};
