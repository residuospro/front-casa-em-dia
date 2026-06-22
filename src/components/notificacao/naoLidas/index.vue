<template>
  <div
    class="relative cursor-pointer"
    @click="() => router.push('/notificacao')"
  >
    <div
      v-if="notificacoesNaoLidas > 0"
      class="text-white bg-red-600 rounded-full text-center text-[0.5rem] w-4 absolute z-30 top-2 right-0"
    >
      {{ notificacoesNaoLidas }}
    </div>

    <svg-icon type="mdi" :path="mdiBellOutline" class="w-7 h-7" />
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiBellOutline } from "@mdi/js";
import { useRouter } from "vue-router";
import { useApiNotificacao } from "../useApiNotificacao";
import { useNotificacao } from "../useNotificacao";
import { onMounted } from "vue";

const router = useRouter();
const { obterNotificacoesNaoLidas } = useApiNotificacao();
const { notificacoesNaoLidas } = useNotificacao();

onMounted(async () => {
  await obterNotificacoesNaoLidas();
});
</script>
