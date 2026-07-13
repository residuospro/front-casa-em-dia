<template>
  <div
    v-if="needRefresh"
    role="alert"
    aria-labelledby="toast-message"
    class="fixed bottom-0 right-0 m-4 p-3 grid bg-white text-left border border-ce_amarelo_D49600 rounded shadow-[3px_4px_5px_0_rgba(0,0,0,0.2)] z-30"
  >
    <div class="flex items-center gap-2">
      <img src="/alertWarn.svg" alt="Icone de aviso" />
      <div class="flex flex-col">
        <span class="font-semibold text-ce_cinza_525252">
          Novo conteúdo disponível!
        </span>
        <span class="text-ce_cinza_525252 text-sm">
          O aplicativo será atualizado em
          <span class="font-semibold text-ce_amarelo_D49600"
            >{{ contador }}s</span
          >
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAtualizarVersao } from "./useAtualizarVersao";

const { needRefresh, contador } = useAtualizarVersao();
</script>
