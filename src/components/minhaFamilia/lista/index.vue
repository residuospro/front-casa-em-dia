<template>
  <Modal
    :abrir-modal="abrirModalDeletar"
    :titulo="sairDaFamilia ? 'Sair da família' : 'Deletar membro'"
    subtitulo=""
    :texto-botao="sairDaFamilia ? 'Sair' : 'Deletar'"
    @fechar-modal="
      () => {
        abrirModalDeletar = false;
        sairDaFamilia = false;
      }
    "
    :salvar="() => removerMembro(membro?.id, membro?.familiaId)"
  >
    <span class="text-red-600 font-medium" v-if="!sairDaFamilia">
      Tem certeza que deseja deletar o membro {{ membro?.nome }}?
    </span>

    <span class="text-red-600 font-medium" v-else>
      Tem certeza que deseja sair da família?
    </span>
  </Modal>

  <EditarMembro />

  <div class="bg-white rounded-2xl border shadow-sm w-full">
    <div class="p-5 border-b flex flex-col gap-2">
      <h2 class="font-semibold text-lg">Membros cadastrados</h2>

      <Input
        label="Buscar membro"
        placeholder="Digite nome ou email"
        v-model="buscarMembro"
      >
        <template #trailing>
          <button
            v-if="filtroAplicado"
            type="button"
            @click="listarMembros(perfil.familiaId)"
            class="text-white/60 hover:text-emerald-300 transition"
          >
            <svg-icon type="mdi" :path="mdiClose" class="text-slate-500" />
          </button>
        </template>
      </Input>
    </div>

    <div>
      <div
        v-for="(membro, index) in dataMembrosFamiliares"
        :key="index"
        class="px-5 py-4 flex items-center justify-between border-b last:border-none"
      >
        <div class="flex items-center gap-4">
          <img
            v-if="membro?.fotoPerfil"
            :src="parseFotoPerfil(membro?.fotoPerfil)"
            class="object-cover w-8 h-8 rounded-full"
          />

          <div>
            <p class="font-medium text-[#1C1F1F]">
              {{ membro.nome }}
            </p>

            <p class="text-xs text-black/50">
              {{ membro?.usuario?.email }}
            </p>

            <div class="flex gap-2 mt-2 flex-wrap">
              <span
                class="px-2 py-1 rounded-full text-xs bg-[#EEF5EA] text-[#53864C]"
              >
                {{ membro.tipoPessoa }}
              </span>

              <span
                v-if="membro.permissao === 'ADMIN'"
                class="px-2 py-1 rounded-full text-xs bg-[#FFF4D8] text-[#A46B00]"
              >
                Admin
              </span>

              <span
                v-if="membro.dependente"
                class="px-2 py-1 rounded-full text-xs bg-[#FFF4D8] text-[#A46B00]"
              >
                Dependente
              </span>

              <span
                v-if="membro.status === 'PENDENTE'"
                class="px-2 py-1 rounded-full text-xs bg-[#E9E0FB] text-[#5D28B5]"
              >
                Aguardando aceite
              </span>

              <span
                v-if="membro.status === 'RECUSADO'"
                class="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700"
              >
                Convite Recusado
              </span>

              <span
                v-if="!membro.conviteEnviado"
                class="px-2 py-1 rounded-full text-xs bg-[#F43E01]/20 text-[#F43E01]"
              >
                Falha ao enviar o convite
              </span>
            </div>
          </div>
        </div>

        <MenuContexto
          :items="menuItems"
          @select="
            onMenuSelect(
              membro,
              $event,
              reenviarConvite,
              aceitarConvite,
              recusarConvite,
            )
          "
        >
          <button
            class="text-black/50 hover:text-black"
            @click="ajustarMenuItens(membro)"
          >
            ⋮
          </button>
        </MenuContexto>
      </div>
    </div>

    <div class="p-5 text-sm text-black/60">
      Total: {{ dataMembrosFamiliares.length }} membros
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, watchEffect } from "vue";
import { useApiListaMembros } from "./useApiListaMembros";
import { usePerfil } from "@/store/usePerfil";
import { useListaMembros } from "./useListaMembros";
import { useUtils } from "@/utils/useUtils";
import MenuContexto from "@/components/menuContexto/index.vue";
import EditarMembro from "@/components/minhaFamilia/editarMembro/index.vue";
import Modal from "@/components/modal/index.vue";
import Input from "@/components/input/index.vue";
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose } from "@mdi/js";

const {
  listarMembros,
  removerMembro,
  buscarMembroPorNomeOuEmail,
  reenviarConvite,
  aceitarConvite,
  recusarConvite,
} = useApiListaMembros();
const { perfil } = usePerfil();
const {
  dataMembrosFamiliares,
  abrirModalDeletar,
  sairDaFamilia,
  membro,
  menuItems,
  filtroAplicado,
  buscarMembro,
  ajustarMenuItens,
  onMenuSelect,
} = useListaMembros();
const { parseFotoPerfil } = useUtils();

watchEffect(async () => {
  if (perfil.familiaId) await listarMembros(perfil.familiaId);
});

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => buscarMembro.value,
  (valor) => {
    if (valor) {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        await buscarMembroPorNomeOuEmail(valor, perfil.familiaId);
      }, 500);
    }
  },
  { deep: true },
);
</script>
