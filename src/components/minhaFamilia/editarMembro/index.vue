<template>
  <Modal
    :abrir-modal="abrirModalEdicao"
    titulo="Editar membro"
    texto-botao="Atualizar"
    @fechar-modal="
      () => {
        abrirModalEdicao = false;
        isDependente = false;
      }
    "
    :salvar="
      () => atualizarMembro(listarMembros, membro?.id, membro?.familiaId)
    "
  >
    <div class="flex flex-col justify-center gap-2">
      <Input
        label="Nome"
        v-model="dependenteAtualizado.nome"
        placeholder="Digite o nome completo"
        v-if="membro?.dependente"
      />

      <Select
        label="Gênero"
        placeholder="Selecione"
        v-model="dependenteAtualizado.genero"
        :items="opcoesGenero"
        v-if="membro?.dependente"
      />

      <Select
        label="Tipo de pessoa"
        placeholder="Selecione"
        :model-value="membro?.tipoPessoa"
        :items="opcoesMembroFamiliar"
        @update:model-value="
          (valor) =>
            isDependente
              ? (dependenteAtualizado.tipoPessoa = valor as string)
              : (membroAtualizado.tipoPessoa = valor as string)
        "
      />

      <Select
        label="Permissão"
        placeholder="Selecione"
        v-model="membroAtualizado.permissao"
        :items="opcoesPermissao"
        v-if="!membro?.dependente"
      />

      <Input
        type="file"
        accept="img/*"
        estilo="light"
        label="Selecione uma foto"
        v-model="dependenteAtualizado.fotoPerfil"
        v-if="membro?.dependente"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/modal/index.vue";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import { useApiListaMembros } from "../lista/useApiListaMembros";
import { useMinhaFamilia } from "../useMinhaFamilia";
import { useListaMembros } from "../lista/useListaMembros";
import { useEditarMembro } from "./useEditarMembro";
import { useApiEditarMembro } from "./useApiEditarMembro";

const { membro } = useListaMembros();
const {
  dependenteAtualizado,
  abrirModalEdicao,
  isDependente,
  membroAtualizado,
} = useEditarMembro();
const { atualizarMembro } = useApiEditarMembro();

const { listarMembros } = useApiListaMembros();
const { opcoesGenero, opcoesMembroFamiliar, opcoesPermissao } =
  useMinhaFamilia();
</script>
