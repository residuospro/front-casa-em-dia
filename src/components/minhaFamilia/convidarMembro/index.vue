<template>
  <form
    class="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col gap-2 p-4 h-full"
    @submit.prevent="convidarMembro"
  >
    <Input
      label="Email"
      v-model="novoMembro.email"
      type="email"
      placeholder="Digite o email"
    />
    <Select
      label="Permissão"
      placeholder="Selecione"
      v-model="novoMembro.permissao"
      :items="opcoesPermissao"
    />
    <Select
      label="Tipo de pessoa"
      placeholder="Selecione"
      v-model="novoMembro.tipoPessoa"
      :items="opcoesMembroFamiliar"
    />

    <div
      class="rounded-xl bg-[#EEF5EA] border border-[#53864C]/20 p-4 flex gap-3"
    >
      <span class="text-xl"> ✉️ </span>

      <div>
        <p class="text-sm font-medium text-[#24572E]">
          O membro receberá um convite
        </p>

        <p class="text-xs text-black/60 mt-1">
          Será enviado um email convidando-o para fazer parte da família.
        </p>
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="button"
        @click="limparNovoMembro"
        class="flex-1 h-12 rounded-xl border border-black/10 text-black/70"
      >
        Limpar
      </button>

      <button
        type="submit"
        class="flex-1 h-12 rounded-xl bg-[#53864C] text-white font-medium hover:scale-[1.02] transition"
      >
        Convidar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useConvidarMembro } from "./useConvidarMembro";
import { useMinhaFamilia } from "../useMinhaFamilia";
import { useApiConvidarMembro } from "./useApiConvidarMembro";

const { opcoesMembroFamiliar, opcoesPermissao } = useMinhaFamilia();
const { convidarMembro } = useApiConvidarMembro();
const { novoMembro, limparNovoMembro } = useConvidarMembro();
</script>
