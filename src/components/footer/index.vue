<template>
  <nav class="h-20 bg-white border-t flex items-center justify-evenly px-2">
    <button
      v-for="item in menu"
      :key="item.label || 'plus'"
      class="flex flex-col items-center justify-center gap-1"
      @click="redirect(item.route)"
    >
      <div
        v-if="item.floating"
        class="w-16 h-16 sm:!w-10 sm:!h-10 rounded-full bg-green-700 flex items-center justify-center shadow-lg"
      >
        <svg-icon type="mdi" :path="item.icon" class="text-white" />
      </div>

      <div
        v-else-if="item.notificacao"
        class="relative cursor-pointer flex flex-col justify-center items-center gap-1.5"
        @click="() => router.push('/notificacoes')"
      >
        <div
          v-if="totalNaoLidas > 0"
          class="text-white bg-red-600 rounded-full text-center text-[0.5rem] w-4 absolute z-30 top-1 right-4"
        >
          {{ totalNaoLidas }}
        </div>

        <svg-icon
          type="mdi"
          :path="item.icon"
          :class="item.route === itemAtivo ? 'text-green-700' : 'text-gray-500'"
        />

        <span
          class="text-xs"
          :class="
            item.route === itemAtivo
              ? 'text-green-700 font-medium'
              : 'text-gray-500'
          "
        >
          {{ item.label }}
        </span>
      </div>

      <template v-else>
        <svg-icon
          type="mdi"
          :path="item.icon"
          :class="item.route === itemAtivo ? 'text-green-700' : 'text-gray-500'"
        />

        <span
          class="text-xs"
          :class="
            item.route === itemAtivo
              ? 'text-green-700 font-medium'
              : 'text-gray-500'
          "
        >
          {{ item.label }}
        </span>
      </template>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { useNotificacao } from "@/components/notificacao/useNotificacao";

const { totalNaoLidas } = useNotificacao();

import {
  mdiHome,
  mdiClipboardTextOutline,
  mdiPlus,
  mdiBellOutline,
  mdiCalculatorVariantOutline,
} from "@mdi/js";

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  floating?: boolean;
  calendario?: boolean;
  notificacao?: boolean;
}

const router = useRouter();
const menu = ref<MenuItem[]>([
  {
    label: "Início",
    icon: mdiHome,
    route: "/home",
  },
  {
    label: "Tarefas",
    icon: mdiClipboardTextOutline,
    route: "/minhas-tarefas",
    calendario: false,
  },
  {
    label: "",
    icon: mdiPlus,
    floating: true,
    route: "/minhas-tarefas/nova-tarefa",
  },
  {
    label: "Finanças",
    icon: mdiCalculatorVariantOutline,
    route: "/financas",
    calendario: true,
  },
  {
    label: "Notificações",
    icon: mdiBellOutline,
    route: "/notificacoes",
    notificacao: true,
  },
]);

const itemAtivo = ref("/home");

const redirect = (rota?: string) => {
  router.push(rota || "/home");
};

onMounted(() => {
  itemAtivo.value = router.currentRoute.value.fullPath;

  console.log("ite", itemAtivo.value);
});
</script>
