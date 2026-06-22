<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-col">
        <h2 class="font-semibold text-lg">Nenhuma família cadastrada</h2>

        <p class="text-sm text-black/60">
          Crie uma família para começar a organizar sua rotina.
        </p>
      </div>

      <div
        class="w-16 h-16 rounded-full bg-[#EEF5EA] flex items-center justify-center mx-auto text-3xl"
      >
        🏡
      </div>
    </div>

    <Input
      v-model="familia.nome"
      label="Nome da família"
      placeholder="Digite"
    />

    <Select
      v-model="familia.tipoPessoa"
      label="Quem é você na família?"
      :items="opcoesMembroFamiliar"
      placeholder="Selecionar"
    />

    <button
      class="w-full h-11 rounded-xl bg-[#53864C] text-white font-medium"
      @click="criarFamilia"
    >
      Criar família
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCriarFamilia } from "./useCriarFamilia";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useMinhaFamilia } from "../useMinhaFamilia";

const { familia, criarFamilia } = useCriarFamilia();
const { opcoesMembroFamiliar } = useMinhaFamilia();
</script>
