<template>
  <div
    class="relative min-h-screen w-full overflow-hidden flex justify-center px-4 py-10"
  >
    <img
      src="/fundoAplicacao.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />

    <div class="absolute inset-0" />

    <div
      class="relative z-10 w-full max-w-xl rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,.35)]"
    >
      <img
        src="/fundoLogin.png"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div class="relative p-8">
        <div class="flex flex-col items-center mb-6">
          <button
            type="button"
            @click="irParaLogin"
            class="absolute left-6 top-6 text-[#1C1F1F] flex gap-2 items-center"
          >
            ← Voltar
          </button>

          <img src="/icone.png" alt="Casa" class="w-20 h-20" />

          <h1 class="text-3xl font-semibold text-[#357043]">Casa em dia</h1>

          <span class="text-center mt-3 text-[#1C1F1F] font-medium">
            Vamos criar sua família
          </span>

          <p class="text-sm text-center mt-1 text-black/70">
            Preencha seus dados para criar sua conta
            <br />
            e sua família.
          </p>
        </div>

        <form
          class="flex flex-col gap-4 bg-[#FBF9F6] border rounded-2xl p-5"
          @submit.prevent="handleSubmit"
        >
          <Input
            label="Seu nome"
            v-model="usuario.nome"
            placeholder="Ex: José Silva"
          />

          <p v-if="erros.nome" class="text-xs text-red-500">
            {{ erros.nome }}
          </p>

          <Input
            label="E-mail"
            v-model="usuario.email"
            type="email"
            placeholder="seu@email.com"
          />

          <p v-if="erros.email" class="text-xs text-red-500">
            {{ erros.email }}
          </p>

          <Input
            label="Celular"
            v-model="usuario.celular"
            type="text"
            placeholder="(11)99999-9999"
            v-maska="'(##)#####-####'"
          />

          <p v-if="erros.celular" class="text-xs text-red-500">
            {{ erros.celular }}
          </p>

          <Input
            label="Senha"
            v-model="usuario.senha"
            :type="showSenha ? 'text' : 'password'"
            placeholder="Mínimo de 6 caracteres"
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

          <Input
            label="Confirmar Senha"
            v-model="usuario.confirmarSenha"
            :type="showConfirmarSenha ? 'text' : 'password'"
            placeholder="Mínimo de 6 caracteres"
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

          <div class="grid grid-cols-2 gap-3">
            <Select
              label="Selecione o seu gênero"
              v-model="usuario.genero"
              placeholder="Selecione"
              :items="[
                { text: 'Masculino', value: 'MASCULINO' },
                { text: 'Feminino', value: 'FEMININO' },
              ]"
            />

            <Input
              type="file"
              accept="img/*"
              estilo="light"
              label="Selecione sua foto"
              v-model="usuario.fotoPerfil"
            />
          </div>

          <div class="rounded-xl p-4 bg-[#EEF3E8] border border-[#53864C]/20">
            <div class="flex gap-3 items-start">
              <svg-icon
                type="mdi"
                :path="mdiShieldCheckOutline"
                class="text-[#53864C]"
                size="50"
              />

              <div>
                <p class="font-medium text-[#24572E]">
                  Você será o administrador da família
                </p>

                <p class="text-sm text-black/70">
                  Você poderá adicionar e gerenciar os membros depois.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading || !formularioValido"
            class="w-full h-12 rounded-xl bg-[#53864C] text-white font-medium hover:scale-[1.02] transition disabled:opacity-50"
          >
            {{ loading ? "Criando..." : "Criar minha família" }}
          </button>

          <div class="text-center text-sm text-black/70">
            Já tem uma conta?

            <button
              type="button"
              @click="irParaLogin"
              class="text-[#53864C] font-medium"
            >
              Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "cadastro",
    "layout": "Auth",
    "auth": false
  }
}
</route>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Input from "@/components/input/index.vue";
import { useCadastro } from "./useCadastro";
import { useApiCadastro } from "./useApiCadastro";
import Select from "@/components/select/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { vMaska } from "maska/vue";
import {
  mdiShieldCheckOutline,
  mdiEyeOffOutline,
  mdiEyeOutline,
} from "@mdi/js";

const router = useRouter();
const {
  usuario,
  showSenha,
  showConfirmarSenha,
  loading,
  erros,
  formularioValido,
  toggleShowSenha,
  toggleShowConfirmarSenha,
  validar,
  limparErros,
} = useCadastro();
const { cadastrar } = useApiCadastro();

const handleSubmit = () => {
  validar();

  if (formularioValido.value) {
    cadastrar();
  }
};

const irParaLogin = () => {
  limparErros();
  router.push("/login");
};
</script>
