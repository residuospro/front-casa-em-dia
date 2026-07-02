import { ref } from "vue";
import type { IFamiliaPessoa } from "../tipagem";
import { usePerfil } from "@/composables/usePerfil";
import { useEditarMembro } from "../editarMembro/useEditarMembro";

const { perfil } = usePerfil();
const { setarMembroParaEdicao } = useEditarMembro();
const dataMembrosFamiliares = ref<IFamiliaPessoa[]>([]);
const membro = ref<IFamiliaPessoa | null>(null);
const abrirModalDeletar = ref(false);
const sairDaFamilia = ref(false);
const filtroAplicado = ref(false);
const buscarMembro = ref("");

const fecharModalDeletar = () => {
  abrirModalDeletar.value = false;
  sairDaFamilia.value = false;
};

const estadoInicialMenuItems = [
  { label: "Editar", value: "editar", disabled: false },
  { label: "Remover", value: "remover", disabled: false },
];

const menuItems = ref([...estadoInicialMenuItems]);

const onMenuSelect = async (
  membroFamiliar: IFamiliaPessoa,
  acao: string,
  reenviarConvite: (membroId?: string, familiaId?: string) => Promise<void>,
  aceitar: (membro: IFamiliaPessoa) => Promise<void>,
  recusar: (membro: IFamiliaPessoa) => Promise<void>,
) => {
  membro.value = membroFamiliar;

  const acoes: Record<string, () => Promise<void> | void> = {
    editar: () => {
      setarMembroParaEdicao(membroFamiliar);
    },

    remover: () => {
      if (perfil.value?.id === membroFamiliar?.usuario?.id) {
        sairDaFamilia.value = true;
      }

      abrirModalDeletar.value = true;
    },

    "reenviar-convite": async () => {
      await reenviarConvite(membroFamiliar.id, membroFamiliar.familiaId);
    },

    "aceitar-convite": async () => {
      await aceitar(membroFamiliar);
    },

    "recusar-convite": async () => {
      await recusar(membroFamiliar);
    },
  };

  await acoes[acao]?.();
};

const ajustarMenuItens = (membroFamiliar: IFamiliaPessoa) => {
  if (!membroFamiliar.conviteEnviado) {
    menuItems.value.push({
      label: "Reenviar convite",
      value: "reenviar-convite",
      disabled: true,
    });
  } else if (
    membroFamiliar.conviteEnviado &&
    membroFamiliar.status === "PENDENTE" &&
    perfil.value?.id === membroFamiliar?.usuario?.id
  ) {
    menuItems.value.push(
      {
        label: "Aceitar convite",
        value: "aceitar-convite",
        disabled: false,
      },
      {
        label: "Recusar convite",
        value: "recusar-convite",
        disabled: false,
      },
    );
  } else if (perfil.value?.id === membroFamiliar?.usuario?.id) {
    menuItems.value = menuItems.value.map((item) =>
      item.value === "remover" ? { ...item, label: "Sair da família" } : item,
    );
  } else {
    menuItems.value = [...estadoInicialMenuItems];
  }
};

export const useListaMembros = () => {
  return {
    dataMembrosFamiliares,
    membro,
    abrirModalDeletar,
    sairDaFamilia,
    menuItems,
    filtroAplicado,
    buscarMembro,
    onMenuSelect,
    fecharModalDeletar,
    ajustarMenuItens,
  };
};
