<template>
  <div class="w-full bg-white rounded-3xl shadow-2xl">
    <div class="p-4 flex items-center justify-between border-b">
      <h1 class="text-xl font-semibold text-gray-900">Membros da família</h1>
      <button
        @click="router.push('/minha-familia')"
        class="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
      >
        Ver todos
        <span aria-hidden="true">→</span>
      </button>
    </div>

    <div class="divide-y divide-gray-100">
      <div
        v-for="membro in membros"
        :key="membro.id"
        class="py-2 px-4 flex items-center gap-2 hover:bg-gray-50 transition-colors group"
      >
        <img
          :src="parseFotoPerfil(membro.fotoPerfil || '')"
          :alt="membro.nome"
          class="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
        />

        <div class="flex-1 min-w-0 flex flex-row justify-between">
          <span
            :title="membro.nome"
            class="font-medium text-gray-900 text-[17px] truncate max-w-[80px] sm:max-w-[120px] md:max-w-[180px]"
          >
            {{ membro.nome }}
          </span>

          <span
            v-if="membro.permissao === 'ADMIN'"
            class="px-2 py-1 rounded-full text-xs bg-[#FFF4D8] text-[#A46B00] capitalize"
          >
            {{ membro.permissao.toLocaleLowerCase() }}
          </span>

          <span
            v-else
            class="px-2 py-1 rounded-full text-xs bg-[#FFF4D8] text-[#A46B00] capitalize"
          >
            {{
              membro.permissao === "USUARIO"
                ? "Usuário"
                : String(membro.permissao).toLocaleLowerCase()
            }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useListaMembros } from "@/components/minhaFamilia/lista/useListaMembros";
import { useRouter } from "vue-router";
import { useUtils } from "@/utils/useUtils";

const { parseFotoPerfil } = useUtils();
const { dataMembrosFamiliares } = useListaMembros();
const router = useRouter();
const membros = computed(() => dataMembrosFamiliares.value.slice(0, 4));
</script>
