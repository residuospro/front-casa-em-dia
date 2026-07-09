import { ref } from "vue";
import {
  mdiHomeOutline,
  mdiAccountGroupOutline,
  mdiBellOutline,
  mdiListBoxOutline,
  mdiCalculatorVariantOutline,
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
    label: "Minhas tarefas",
    icone: mdiListBoxOutline,
    children: [
      { label: "Tarefas", path: "/minhas-tarefas" },
      { label: "Nova tarefa", path: "/minhas-tarefas/nova-tarefa" },
      { label: "Ciclos", path: "/minhas-tarefas/ciclos" },
      { label: "Novo ciclo", path: "/minhas-tarefas/novo-ciclo" },
    ],
  },
  { label: "Finanças", path: "/financas", icone: mdiCalculatorVariantOutline },
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
