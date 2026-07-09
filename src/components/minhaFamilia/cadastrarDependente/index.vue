<template>
  <form
    class="bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col gap-2 p-4 h-full w-full flex-1"
    @submit.prevent="cadastrarNovoDependente(perfil.familiaId)"
  >
    <Input
      label="Nome"
      v-model="novoDependente.nome"
      placeholder="Digite o nome completo"
    />

    <Select
      label="Gênero"
      placeholder="Selecione"
      v-model="novoDependente.genero"
      :items="opcoesGenero"
    />

    <Select
      label="Tipo de pessoa"
      placeholder="Selecione"
      v-model="novoDependente.tipoPessoa"
      :items="opcoesMembroFamiliar"
    />

    <Input
      type="file"
      accept="img/*"
      estilo="light"
      label="Selecione uma foto"
      v-model="novoDependente.fotoPerfil"
    />

    <div
      class="rounded-xl bg-[#EEF5EA] border border-[#53864C]/20 p-4 flex gap-3"
    >
      <span class="text-xl"> 🛡️ </span>

      <div>
        <p class="text-sm font-medium text-[#24572E]">
          Este membro não terá acesso à aplicação.
        </p>

        <p class="text-xs text-black/60 mt-1">
          Você será responsável por criar, organizar e acompanhar as tarefas
          dele.
        </p>
      </div>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="button"
        class="flex-1 h-12 rounded-xl border border-black/10 text-black/70"
      >
        Limpar
      </button>

      <button
        type="submit"
        class="flex-1 h-12 rounded-xl bg-[#53864C] text-white font-medium hover:scale-[1.02] transition"
      >
        Cadastrar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useCadastrarDependente } from "./useCadastrarDependente";
import { useApiCadastrarDependente } from "./useApiCadastrarDependente";
import { usePerfil } from "@/store/usePerfil";
import { useMinhaFamilia } from "../useMinhaFamilia";

const { cadastrarNovoDependente } = useApiCadastrarDependente();
const { novoDependente } = useCadastrarDependente();
const { opcoesMembroFamiliar, opcoesGenero, opcoesPermissao } =
  useMinhaFamilia();

const { perfil } = usePerfil();
</script>
