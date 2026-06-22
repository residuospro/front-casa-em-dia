<template>
  <div class="space-y-4">
    <Input v-model="nome" label="Nome da família" placeholder="Digite" />

    <div class="flex gap-3">
      <button class="flex-1 h-11 rounded-xl border" @click="permitirEdicao">
        Cancelar
      </button>

      <button
        class="flex-1 h-11 rounded-xl bg-[#53864C] text-white"
        @click="atualizarFamilia"
      >
        Atualizar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/input/index.vue";
import { useMinhaFamilia } from "../useMinhaFamilia";
import { useEditarFamilia } from "./useEditarFamilia";

const { permitirEdicao } = useMinhaFamilia();
const { nome, atualizarFamilia } = useEditarFamilia();
</script>
