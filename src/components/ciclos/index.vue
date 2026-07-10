<template>
  <ModalDeletar
    :abrir-modal="abrirModalDeletar"
    titulo="Deletar ciclo"
    subtitulo=""
    texto-botao="Deletar"
    @fechar-modal="() => (abrirModalDeletar = false)"
    :salvar="() => deletarCiclo()"
  >
    <span class="text-red-600 font-medium">
      Tem certeza que deseja deletar o ciclo {{ ciclo.nome }}?
    </span>
  </ModalDeletar>

  <div class="w-full flex flex-col gap-6 bg-white rounded-2xl p-6">
    <div
      class="flex items-center justify-between sm:flex-col sm:items-start gap-2 w-full"
    >
      <div>
        <h1 class="text-2xl font-semibold text-[#1C1F1F]">Ciclos</h1>

        <p class="text-sm text-black/50">
          Gerencie os ciclos de revezamento da sua família.
        </p>
      </div>

      <Button @click="router.push('/ciclos/novo-ciclo')" class="sm:!w-full">
        + Novo ciclo
      </Button>
    </div>

    <div class="border rounded-2xl p-5" v-if="cicloAtivo">
      <div class="flex flex-row items-center justify-between">
        <h2 class="font-semibold mb-4">Ciclo ativo</h2>

        <ce-context-menu
          :items="opcoesMenuCicloAtivo"
          @select="
            (acao) =>
              acoesMenuContext(
                acao,
                cicloAtivo?.id || '',
                cicloAtivo?.nome || '',
                renovarCiclo,
              )
          "
        >
          <button class="text-xl" @click="ajustarOpçoesMenu(cicloAtivo)">
            ⋮
          </button>
        </ce-context-menu>
      </div>

      <div class="flex gap-5 items-start sm:flex-col">
        <div
          class="w-16 h-16 rounded-full bg-[#EEF5EA] flex items-center justify-center text-[#53864C] text-3xl"
        >
          ↻
        </div>

        <div class="flex-1">
          <div class="flex gap-3 items-center">
            <h3 class="font-semibold">{{ cicloAtivo?.nome }}</h3>

            <span
              class="px-3 py-1 rounded-full bg-[#EEF5EA] text-[#53864C] text-xs"
            >
              Ativo
            </span>
          </div>

          <div class="mt-3 space-y-2 text-sm text-black/60">
            <p>📅 Iniciado em {{ formatarData(cicloAtivo?.inicio || "") }}</p>

            <p>🕒 Duração: {{ cicloAtivo?.duracaoDias }} dias</p>

            <p>
              📅 Renovado em: {{ formatarData(cicloAtivo?.renovadoEm || "") }}
            </p>

            <p>
              ↻ Próxima renovação:
              {{ formatarData(cicloAtivo?.proximaRenovacao || "") }}
            </p>

            <Toogle
              :model-value="cicloAtivo?.ativo"
              label="Ativo"
              @update:model-value="
                (valor) => atualizarStatusCiclo(cicloAtivo?.id || '', valor)
              "
            />
          </div>
        </div>

        <div class="flex flex-col justify-center">
          <ce-progress-indicator
            :progress="
              calcularProgressoCiclo(
                new Date(cicloAtivo?.renovadoEm || cicloAtivo?.inicio || ''),
                cicloAtivo?.duracaoDias || 0,
              )
            "
            variant="circle"
            :label="`${diasDesdeInicio(new Date(cicloAtivo?.inicio || ''), cicloAtivo?.duracaoDias)} de ${cicloAtivo?.duracaoDias} dias`"
          />
        </div>
      </div>
    </div>

    <div>
      <h2 class="font-semibold mb-3 px-2">Outros ciclos</h2>

      <div class="space-y-3">
        <div
          v-for="(ciclo, index) in ciclosInativo"
          :key="index"
          class="bg-white border rounded-xl p-4 flex items-center gap-4"
        >
          <div
            class="w-12 h-12 rounded-full bg-[#EEF5EA] flex items-center justify-center text-[#53864C] text-xl"
          >
            ↻
          </div>

          <div class="flex-1">
            <p class="font-medium">
              {{ ciclo.nome }}
            </p>

            <p class="text-sm text-black/50">
              Duração: {{ ciclo.duracaoDias }} dias
            </p>
          </div>

          <div class="flex items-center gap-3">
            <Toogle
              @update:model-value="
                (valor) => atualizarStatusCiclo(ciclo.id, valor)
              "
              label="Ativo"
            />

            <span class="px-3 py-1 rounded-md bg-black/5 text-xs text-black/60">
              Inativo
            </span>
          </div>

          <ce-context-menu
            :items="opcoesMenu"
            @select="
              (acao) =>
                acoesMenuContext(acao, ciclo.id, ciclo.nome, renovarCiclo)
            "
          >
            <button class="text-xl">⋮</button>
          </ce-context-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCiclos } from "./useCiclos";
import Toogle from "@/components/toggle/index.vue";
import {
  CeProgressIndicator,
  CeContextMenu,
} from "@comercti/vue-components-hmg";
import { useApiCiclos } from "./useApiCiclos";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUtils } from "@/utils/useUtils";
import ModalDeletar from "@/components/modal/index.vue";
import Button from "@/components/botao/index.vue";

const router = useRouter();
const { formatarData } = useUtils();
const { obterCiclos, deletarCiclo, atualizarStatusCiclo, renovarCiclo } =
  useApiCiclos();
const {
  cicloAtivo,
  ciclosInativo,
  opcoesMenu,
  ciclo,
  abrirModalDeletar,
  opcoesMenuCicloAtivo,
  calcularProgressoCiclo,
  diasDesdeInicio,
  acoesMenuContext,
  ajustarOpçoesMenu,
} = useCiclos();

onMounted(async () => {
  await obterCiclos();
});
</script>
