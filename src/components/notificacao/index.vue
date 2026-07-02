<template>
  <div class="flex flex-col justify-center gap-3 px-2 items-center">
    
    <Header />

    <Filtro />

    <div
      v-for="notificacao in notificacoesFiltradas"
      :key="notificacao.id"
      class="rounded-2xl border p-5 shadow-lg transition"
      :class="
        !notificacao.lido
          ? 'border-[#53864C]/30 bg-[#EEF5EA]/40'
          : 'border-[#ECE4D8] bg-white'
      "
    >
      <div class="flex items-start gap-4">
        <div class="flex-1">
          <div
            v-if="notificacao.remetente"
            class="flex items-center justify-between w-full mb-3"
          >
            <div class="flex items-center gap-3">
              <img
                :src="parseFotoPerfil(notificacao.remetente.fotoPerfil)"
                class="w-9 h-9 rounded-full object-cover"
              />

              <div>
                <p class="text-sm font-medium">
                  {{ notificacao.remetente.nome }}
                </p>

                <p class="text-xs text-black/50">enviou uma notificação</p>
              </div>
            </div>

            <MenuContexto
              :items="menuItens"
              @select="
                onMenuSelect(
                  notificacao.id,
                  $event,
                  marcarComoLido,
                  excluirNotificacao,
                )
              "
            >
              <button class="text-black/50 hover:text-black">⋮</button>
            </MenuContexto>
          </div>

          <div class="flex justify-between">
            <h3 class="font-semibold text-[#1C1F1F]">
              {{ notificacao.titulo }}
            </h3>

            <span class="text-[#53864C]">{{
              notificacao.lido ? "Lida" : ""
            }}</span>
          </div>

          <p class="text-sm text-black/60 mt-1">
            {{ notificacao.mensagem }}
          </p>

          <div v-if="acoes(notificacao).length" class="flex gap-3 mt-5">
            <button
              v-for="acao in acoes(notificacao, aceitar, recusar)"
              :key="acao.text"
              @click="acao.action"
              class="px-5 h-10 rounded-xl text-sm font-medium"
              :class="acao.class"
            >
              {{ acao.text }}
            </button>
          </div>

          <p class="mt-4 text-xs text-black/40">
            {{ formatarData(notificacao.criadoEm) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="notificacoes.length === 0" class="text-center py-20">
      <div class="text-6xl mb-4">🔔</div>
      <h3 class="text-lg font-semibold text-[#1C1F1F]">Nenhuma notificação</h3>
      <p class="text-sm text-black/60 mt-1">
        Você não tem notificações no momento.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUtils } from "@/utils/useUtils";
import { useNotificacao } from "./useNotificacao.ts";
import { useApiNotificacao } from "./useApiNotificacao.ts";
import Header from "./header/index.vue";
import Filtro from "./filtro/index.vue";
import MenuContexto from "@/components/menuContexto/index.vue";

const { parseFotoPerfil, formatarData } = useUtils();
const {
  notificacoes,
  notificacoesFiltradas,
  menuItens,
  onMenuSelect,
  iconeTipo,
  acoes,
} = useNotificacao();
const { aceitar, recusar, marcarComoLido, excluirNotificacao } =
  useApiNotificacao();
</script>
