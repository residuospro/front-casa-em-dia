import { ref } from "vue";
import {
  mdiHomeOutline,
  mdiAccountGroupOutline,
  mdiBellOutline,
} from "@mdi/js";

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

const navItens = [
  { label: "Início", path: "/home", icone: mdiHomeOutline },
  {
    label: "Minha família",
    path: "/minha-familia",
    icone: mdiAccountGroupOutline,
  },
  { label: "Notificações", path: "/notificacao", icone: mdiBellOutline },
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
