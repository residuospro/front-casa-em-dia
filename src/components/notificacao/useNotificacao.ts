import { computed, ref, watch } from "vue";
import type { INotificacao, TipoFiltro } from "./tipagem";

import { Socket } from "socket.io-client";
import router from "@/router";

const notificacoes = ref<INotificacao[]>([]);
const notificacoesFiltradas = ref<INotificacao[]>([]);
const filtroSelecionado = ref<TipoFiltro>("todas");
const socket = ref<Socket | null>(null);

const menuItens = [
  { label: "Marcar como lido", value: "marcar-lido", disabled: false },
  { label: "Excluir", value: "excluir", disabled: false },
];

function solicitarPermissaoNotificacao() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function mostrarNotificacaoOS(notificacao: INotificacao) {
  if (!("Notification" in window) || Notification.permission !== "granted")
    return;

  const title = notificacao.remetente
    ? `${notificacao.remetente.nome} te enviou uma notificação`
    : notificacao.titulo;

  const notif = new Notification(title, {
    body: notificacao.mensagem,
    icon: notificacao.remetente?.fotoPerfil || "/icone.png",
    tag: notificacao.id,
  });

  notif.onclick = () => {
    window.focus();
    window.location.href = "/notificacao";
  };
}

const onMenuSelect = (
  notificacaoId: string,
  acao: string,
  marcarComoLido: (notificacaoId: string) => Promise<void>,
  excluirNotificacao: (notificacaoId: string) => Promise<void>,
) => {
  if (acao === "marcar-lido") {
    marcarComoLido(notificacaoId);
  } else if (acao === "excluir") {
    excluirNotificacao(notificacaoId);
  }
};

const iconeTipo = (tipo: string) => {
  switch (tipo) {
    case "CONVITE_FAMILIA":
      return "🏡";
    case "TAREFA":
      return "✅";
    case "EVENTO":
      return "📅";
    default:
      return "🔔";
  }
};

const acoes = (
  notificacao: INotificacao,
  aceitar?: (notificacao: INotificacao) => Promise<void>,
  recusar?: (notificacao: INotificacao) => Promise<void>,
) => {
  if (notificacao.tipo === "CONVITE_FAMILIA") {
    return [
      {
        text: "Aceitar",
        action: () => {
          if (aceitar) aceitar(notificacao);
        },
        class: "bg-[#53864C] text-white",
      },
      {
        text: "Recusar",
        action: () => {
          if (recusar) recusar(notificacao);
        },
        class: "border border-red-300 text-red-600",
      },
    ];
  }
  if (
    notificacao.tipo === "EXECUCAO_TAREFA" ||
    notificacao.tipo === "TAREFA_ATRIBUIDA"
  ) {
    return [
      {
        text: "Visualizar tarefa",
        action: () =>
          router.push({
            name: "minhas-tarefas.visualizar-tarefa",
            query: { id: notificacao.dados.tarefaId },
          }),
        class: "bg-[#53864C] text-white",
      },
    ];
  }

  return [];
};

const filtraNotificacoes = (tipo: TipoFiltro) => {
  filtroSelecionado.value = tipo;

  if (tipo == "todas") {
    notificacoesFiltradas.value = notificacoes.value;
    return;
  } else if (tipo === "lidas") {
    notificacoesFiltradas.value = notificacoes.value.filter((n) => n.lido);
    return;
  } else {
    notificacoesFiltradas.value = notificacoes.value.filter((n) => !n.lido);
    return;
  }
};

watch(
  () => notificacoes.value,
  (valor) => {
    notificacoesFiltradas.value = valor;
  },
  { deep: true, immediate: true },
);

const totalLidas = computed(
  () => notificacoes.value.filter((n) => n.lido).length,
);

const totalNaoLidas = computed(
  () => notificacoes.value.filter((n) => !n.lido).length,
);

const notificacoesNaoLidas = computed(() =>
  notificacoes.value.filter((n) => !n.lido),
);

export const useNotificacao = () => {
  return {
    notificacoes,
    socket,
    menuItens,
    notificacoesFiltradas,
    filtroSelecionado,
    totalLidas,
    totalNaoLidas,
    notificacoesNaoLidas,
    onMenuSelect,
    iconeTipo,
    acoes,
    filtraNotificacoes,
    mostrarNotificacaoOS,
    solicitarPermissaoNotificacao,
  };
};
