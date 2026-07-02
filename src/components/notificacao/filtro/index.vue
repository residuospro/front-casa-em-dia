<template>
  <div
    class="flex xl:!flex-row xl:!items-center justify-between flex-col gap-3"
  >
    <div class="flex gap-3">
      <button
        @click="filtraNotificacoes('todas')"
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'todas' ? 'border-[#53864C] text-[#53864C]' : ''
        "
      >
        Todas {{ notificacoes.length }}
      </button>

      <button
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'nao-lidas'
            ? 'border-[#53864C] text-[#53864C]'
            : ''
        "
        @click="filtraNotificacoes('nao-lidas')"
      >
        Não lidas {{ totalNaoLidas }}
      </button>

      <button
        class="px-4 py-2 rounded-full border text-sm"
        :class="
          filtroSelecionado === 'lidas' ? 'border-[#53864C] text-[#53864C]' : ''
        "
        @click="filtraNotificacoes('lidas')"
      >
        Lidas {{ totalLidas }}
      </button>
    </div>

    <button
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
    </button>
  </div>
</template>

<script setup lang="ts">
import { useNotificacao } from "../useNotificacao";
import { useApiNotificacao } from "../useApiNotificacao";

const {
  notificacoes,
  filtroSelecionado,
  totalNaoLidas,
  totalLidas,
  filtraNotificacoes,
} = useNotificacao();

const { marcarTodasComoLido } = useApiNotificacao();
</script>
