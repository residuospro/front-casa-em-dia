<template>
  <div class="flex items-start w-full">
    <div class="w-full max-w-2xl bg-white rounded-2xl p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-semibold text-[#1C1F1F]">Editar perfil</h1>
          <p class="text-sm text-black/50">Altere seus dados pessoais</p>
        </div>

        <button
          @click="router.push('/home')"
          class="text-sm text-[#53864C] font-medium hover:underline"
        >
          Voltar
        </button>
      </div>

      <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
        <!-- Foto -->
        <div class="flex flex-col items-center gap-3">
          <div class="relative">
            <div
              class="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-[#53864C]/20"
            >
              <img
                v-if="fotoPreview && !usuario.fotoPerfil"
                :src="parseFotoPerfil(fotoPreview)"
                alt=""
                class="w-full h-full object-cover"
              />
              <img
                v-else-if="usuario.fotoPerfil && fotoPreview"
                :src="fotoPreview"
                alt=""
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg-icon type="mdi" :path="mdiCameraOutline" size="32" />
              </div>
            </div>

            <label
              for="fotoInput"
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-[#53864C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#39704A] transition shadow-md"
            >
              <svg-icon
                type="mdi"
                :path="mdiPencilOutline"
                class="text-white"
                size="16"
              />
            </label>

            <input
              id="fotoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFotoChange"
            />
          </div>

          <span class="text-xs text-gray-400"
            >Clique no lápis para alterar sua foto</span
          >
        </div>

        <!-- Nome -->
        <div>
          <Input
            label="Nome"
            v-model="usuario.nome"
            placeholder="Seu nome completo"
          />
          <p v-if="erros.nome" class="text-xs text-red-500 mt-1">
            {{ erros.nome }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <Input
            label="E-mail"
            v-model="usuario.email"
            type="email"
            placeholder="seu@email.com"
          />
          <p v-if="erros.email" class="text-xs text-red-500 mt-1">
            {{ erros.email }}
          </p>
        </div>

        <!-- Celular -->
        <div>
          <Input
            label="Celular"
            v-model="usuario.celular"
            type="text"
            placeholder="(11)99999-9999"
            v-maska="'(##)#####-####'"
          />
          <p v-if="erros.celular" class="text-xs text-red-500 mt-1">
            {{ erros.celular }}
          </p>
        </div>

        <!-- Senha -->
        <div>
          <Input
            label="Nova senha"
            v-model="usuario.senha"
            :type="showSenha ? 'text' : 'password'"
            placeholder="Deixe em branco para manter a atual"
          >
            <template #trailing>
              <button type="button" @click="toggleShowSenha">
                <svg-icon
                  type="mdi"
                  :path="showSenha ? mdiEyeOffOutline : mdiEyeOutline"
                  class="text-slate-500"
                />
              </button>
            </template>
          </Input>
          <p v-if="erros.senha" class="text-xs text-red-500 mt-1">
            {{ erros.senha }}
          </p>
        </div>

        <!-- Confirmar Senha -->
        <div>
          <Input
            label="Confirmar nova senha"
            v-model="usuario.confirmarSenha"
            :type="showConfirmarSenha ? 'text' : 'password'"
            placeholder="Repita a nova senha"
          >
            <template #trailing>
              <button type="button" @click="toggleShowConfirmarSenha">
                <svg-icon
                  type="mdi"
                  :path="showConfirmarSenha ? mdiEyeOffOutline : mdiEyeOutline"
                  class="text-slate-500"
                />
              </button>
            </template>
          </Input>
          <p v-if="erros.confirmarSenha" class="text-xs text-red-500 mt-1">
            {{ erros.confirmarSenha }}
          </p>
        </div>

        <!-- Gênero + Tipo Pessoa -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Select
              label="Gênero"
              v-model="usuario.genero"
              placeholder="Selecione"
              :items="opcoesGenero"
            />
            <p v-if="erros.genero" class="text-xs text-red-500 mt-1">
              {{ erros.genero }}
            </p>
          </div>

          <div>
            <Select
              label="Tipo de pessoa"
              v-model="usuario.tipoPessoa"
              placeholder="Selecione"
              :items="opcoesMembroFamiliar"
            />
            <p v-if="erros.tipoPessoa" class="text-xs text-red-500 mt-1">
              {{ erros.tipoPessoa }}
            </p>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            :disabled="loading || !formularioValido"
            class="!w-full sm:!w-auto"
          >
            {{ loading ? "Salvando..." : "Salvar alterações" }}
          </Button>

          <Button
            type="button"
            variant="outline"
            @click="router.push('/home')"
            class="!w-full sm:!w-auto"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEditarPerfil } from "./useEditarPerfil";
import { useApiEditarPerfil } from "./useApiEditarPerfil";
import { usePerfil } from "@/store/usePerfil";
import { useMinhaFamilia } from "@/components/minhaFamilia/useMinhaFamilia";
import { useUtils } from "@/utils/useUtils";
import Input from "@/components/input/index.vue";
import Select from "@/components/select/index.vue";
import Button from "@/components/botao/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { vMaska } from "maska/vue";
import {
  mdiEyeOffOutline,
  mdiEyeOutline,
  mdiCameraOutline,
  mdiPencilOutline,
} from "@mdi/js";

const router = useRouter();
const { parseFotoPerfil } = useUtils();
const { perfil } = usePerfil();
const { opcoesGenero, opcoesMembroFamiliar } = useMinhaFamilia();

const {
  usuario,
  fotoPreview,
  showSenha,
  showConfirmarSenha,
  loading,
  erros,
  formularioValido,
  toggleShowSenha,
  toggleShowConfirmarSenha,
  validar,
  setarFotoPreview,
  setarUsuario,
} = useEditarPerfil();
const { atualizarPerfil } = useApiEditarPerfil();

const handleFotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    usuario.value.fotoPerfil = file;
    setarFotoPreview(file);
  }
};

const handleSubmit = () => {
  validar();

  if (formularioValido.value) {
    atualizarPerfil();
  }
};

onMounted(() => {
  setarUsuario(perfil);
  setarFotoPreview(perfil.fotoPerfil);
});
</script>
