<template>
  <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
    <div class="flex items-center justify-between p-4">
      <h2 class="text-xl font-bold text-slate-900">Notificações não lidas</h2>

      <span
        class="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold"
      >
        {{ totalNaoLidas }}
      </span>
    </div>

    <div
      v-for="notificacao in notificacoesNaoLidas.slice(0, 3)"
      :key="notificacao.id"
      class="flex items-center gap-4 p-4 border-t first:border-t-0 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div class="w-2 h-2 rounded-full bg-green-600 shrink-0" />

      <div
        class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        :class="notificacaoClasses[notificacao.tipo]"
      >
        <svg-icon type="mdi" :path="notificacaoIcones[notificacao.tipo]" />
      </div>

      <div class="flex-1 min-w-0 text-sm">
        <h3 class="font-semibold text-slate-900">
          {{ notificacao.titulo }}
        </h3>

        <p class="text-slate-500 mt-1">
          {{ notificacao.mensagem }}
        </p>

        <span class="text-sm text-slate-400 mt-2 block">
          {{ formatarData(notificacao.criadoEm) }}
        </span>
      </div>
    </div>

    <div class="border-t">
      <button
        @click="router.push('/notificacoes')"
        class="w-full py-5 text-green-600 font-semibold hover:bg-gray-50 transition-colors"
      >
        Ver todas as notificações →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiAccountPlusOutline,
  mdiClockAlertOutline,
  mdiCheckboxMarkedCircleOutline,
  mdiClipboardTextClockOutline,
} from "@mdi/js";
import { useNotificacao } from "@/components/notificacao/useNotificacao";
import { TipoNotificacaoValues, type TipoNotificacao } from "@/utils/tipagem";
import { useRouter } from "vue-router";
import { useUtils } from "@/utils/useUtils";

const { formatarData } = useUtils();

const router = useRouter();
const { totalNaoLidas, notificacoesNaoLidas } = useNotificacao();

const notificacaoIcones: Record<TipoNotificacao, string> = {
  [TipoNotificacaoValues.CONVITE_FAMILIA]: mdiAccountPlusOutline,
  [TipoNotificacaoValues.CICLO_VENCIDO]: mdiClockAlertOutline,
  [TipoNotificacaoValues.EXECUCAO_TAREFA]: mdiCheckboxMarkedCircleOutline,
  [TipoNotificacaoValues.TAREFA_ATRIBUIDA]: mdiClipboardTextClockOutline,
};

const notificacaoClasses: Record<TipoNotificacao, string> = {
  [TipoNotificacaoValues.CONVITE_FAMILIA]: "bg-green-100 text-green-700",

  [TipoNotificacaoValues.CICLO_VENCIDO]: "bg-red-100 text-red-600",

  [TipoNotificacaoValues.EXECUCAO_TAREFA]: "bg-blue-100 text-blue-600",

  [TipoNotificacaoValues.TAREFA_ATRIBUIDA]: "bg-amber-100 text-amber-600",
};
</script>
