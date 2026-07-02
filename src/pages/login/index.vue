<template>
  <div
    class="relative min-h-screen w-full overflow-hidden flex justify-center px-4 py-16"
  >
    <!-- Fundo da aplicação -->
    <img
      src="/fundoAplicacao.png"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
    />

    <!-- Overlay -->
    <div class="absolute inset-0" />

    <!-- Card -->
    <div
      class="relative z-10 w-full max-w-md rounded-[32px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,.55)]"
    >
      <!-- Fundo interno do card -->
      <img
        src="/fundoLogin.png"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Glass -->
      <div class="relative p-8">
        <!-- Logo / Ícone -->
        <div class="flex flex-col items-center mb-8">
          <div class="flex flex-col justify-center items-center w-full gap-2">
            <img src="/icone.png" alt="Casa" class="w-20 h-20" />
            <h1 class="text-3xl font-semibold text-[#357043] tracking-tight">
              Casa em dia
            </h1>
            <p class="text-sm text-[#1C1F1F]">
              Organize sua rotina em um só lugar
            </p>
          </div>
        </div>

        <form
          class="flex flex-col w-full justify-center gap-3 bg-[#FBF9F6] border rounded-lg p-4"
          @submit.prevent="login"
        >
          <div class="w-full flex flex-col justify-center items-center mb-2">
            <span class="text-lg font-medium">Bem-vindo de volta!</span>
            <span class="text-sm">
              Faça login para acessar as funcionalidades
            </span>
          </div>

          <Input
            label="E-mail"
            v-model="usuario.email"
            type="email"
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            v-model="usuario.senha"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
          >
            <template #trailing>
              <button
                type="button"
                @click="togglePassword"
                class="text-white/60 hover:text-emerald-300 transition"
              >
                <svg-icon
                  type="mdi"
                  :path="showPassword ? mdiEyeOffOutline : mdiEyeOutline"
                  class="text-slate-500"
                />
              </button>
            </template>
          </Input>

          <button
            type="submit"
            :disabled="loading"
            class="w-full h-12 rounded-xl bg-[#53864C] text-white font-medium hover:scale-[1.02] transition"
          >
            {{ loading ? "Entrando..." : "Entrar" }}
          </button>

          <!-- Divider -->

          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-black/20" />

            <span class="text-xs text-black/50"> ou </span>

            <div class="flex-1 h-px bg-black/20" />
          </div>

          <!-- Cadastro -->

          <button
            type="button"
            @click="irParaCadastro"
            class="w-full h-12 rounded-xl border border-[#53864C] text-[#53864C] transition"
          >
            Criar conta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<route lang="json">
{
  "meta": {
    "title": "login",
    "layout": "Auth",
    "auth": false
  }
}
</route>

<script setup lang="ts">
import { useRouter } from "vue-router";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import Input from "@/components/input/index.vue";

import { useLogin } from "./useLogin";
import { useApiLogin } from "./useApiLogin";

const router = useRouter();

const { usuario, showPassword, loading, togglePassword } = useLogin();

const { login } = useApiLogin();

const irParaCadastro = () => {
  router.push("/cadastro");
};
</script>
