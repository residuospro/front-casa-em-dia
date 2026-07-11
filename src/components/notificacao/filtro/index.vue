<template>
  <div
    class="flex xl:!flex-row xl:!items-center justify-between flex-col gap-3"
  >
    <div class="flex gap-3 sm:flex-col">
      <Button
        variant="outline"
        @click="filtraNotificacoes('todas')"
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'todas' ? 'border-[#53864C] text-[#53864C]' : ''
        "
      >
        Todas {{ notificacoes.length }}
      </Button>

      <Button
        variant="outline"
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'nao-lidas'
            ? 'border-[#53864C] text-[#53864C]'
            : ''
        "
        @click="filtraNotificacoes('nao-lidas')"
      >
        Não lidas {{ totalNaoLidas }}
      </Button>

      <Button
        variant="outline"
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'lidas' ? 'border-[#53864C] text-[#53864C]' : ''
        "
        @click="filtraNotificacoes('lidas')"
      >
        Lidas {{ totalLidas }}
      </Button>
    </div>

    <div class="flex items-center gap-2 sm:flex-col">
      <Button
        variant="outline"
        :disabled="notificacoes.length === 0"
        class="px-4 py-2 rounded-full border text-sm sm:w-full"
        :class="
          notificacoes.length > 0
            ? 'border-[#53864C] text-[#53864C]'
            : 'border-slate-300 text-slate-400'
        "
        @click="marcarTodasComoLido"
      >
        Marcar todas como lidas
      </Button>

      <button
        :disabled="notificacoes.length === 0"
        @click="deletarTodasNotificacoes"
        class="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors sm:w-full"
      >
        Excluir todas
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificacao } from "../useNotificacao";
import { useApiNotificacao } from "../useApiNotificacao";
import Button from "@/components/botao/index.vue";

const {
  notificacoes,
  filtroSelecionado,
  totalNaoLidas,
  totalLidas,
  filtraNotificacoes,
} = useNotificacao();

const { marcarTodasComoLido, deletarTodasNotificacoes } = useApiNotificacao();
</script>
