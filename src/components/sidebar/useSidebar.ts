import { ref } from "vue";
import {
  mdiHomeOutline,
  mdiAccountGroupOutline,
  mdiBellOutline,
  mdiListBoxOutline,
  mdiCalculatorVariantOutline,
  mdiAutorenew,
  mdiAccountDetailsOutline,
} from "@mdi/js";

export interface NavItem {
  label: string;
  path?: string;
  icone?: string;
  children?: NavItem[];
}

const sidebarAberto = ref(false);

const toggleSidebar = () => {
  sidebarAberto.value = !sidebarAberto.value;
};

const fecharSidebar = () => {
  sidebarAberto.value = false;
};

const abrirSidebar = () => {
  sidebarAberto.value = true;
};

const navItens: NavItem[] = [
  { label: "Início", path: "/home", icone: mdiHomeOutline },
  {
    label: "Minha família",
    path: "/minha-familia",
    icone: mdiAccountGroupOutline,
  },
  { label: "Notificações", path: "/notificacoes", icone: mdiBellOutline },
  {
    label: "Meus ciclos",
    icone: mdiAutorenew,
    children: [
      { label: "Ciclos", path: "/ciclos" },
      { label: "Novo ciclo", path: "/ciclos/novo-ciclo" },
    ],
  },
  {
    label: "Minhas tarefas",
    icone: mdiListBoxOutline,
    children: [
      { label: "Tarefas", path: "/minhas-tarefas" },
      { label: "Nova tarefa", path: "/minhas-tarefas/nova-tarefa" },
    ],
  },
  {
    label: "Finanças",
    icone: mdiCalculatorVariantOutline,
    children: [
      { label: "Contas", path: "/financas/contas" },
      { label: "Cartões", path: "/financas/cartoes" },
      { label: "Categorias", path: "/financas/categorias" },
      { label: "Subcategorias", path: "/financas/subcategorias" },
      { label: "Centros de Custo", path: "/financas/centros-custo" },
      { label: "Tags", path: "/financas/tags" },
    ],
  },
  {
    label: "Editar perfil",
    path: "/perfil/editar",
    icone: mdiAccountDetailsOutline,
  },
];

export const useSidebar = () => {
  return {
    sidebarAberto,
    navItens,
    toggleSidebar,
    fecharSidebar,
    abrirSidebar,
  };
};
