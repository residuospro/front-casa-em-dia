<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
    <h2 class="text-base font-bold text-[#17243a] mb-4">Contas</h2>

    <div
      v-if="!totalMoeda"
      class="h-[130px] flex items-center justify-center text-sm text-[#667085]"
    >
      Sem dados
    </div>

    <template v-else>
      <div class="flex items-center gap-4 mb-4">
        <div
          class="h-11 w-11 rounded-xl flex items-center justify-center bg-[#eaf5eb] shrink-0"
        >
          <svg-icon type="mdi" :path="mdiBank" class="w-6 h-6 text-[#438b4d]" />
        </div>
        <div>
          <p class="text-xs text-[#596273]">Saldo total</p>
          <p class="text-xl font-bold text-[#438b4d]">
            {{ formatarReal(totalMoeda.saldoAtual) }}
          </p>
          <p class="text-xs text-[#667085]">em {{ quantidadeContas }} contas</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiBank } from "@mdi/js";
import { computed } from "vue";
import { useUtils } from "@/utils/useUtils";
import type { SaldoContasResponse } from "./tipagem";

const props = defineProps<{
  dados: SaldoContasResponse | null;
  moeda: string;
}>();

const { formatarReal } = useUtils();

const totalMoeda = computed(
  () =>
    props.dados?.totaisPorMoeda.find((t) => t.moeda === props.moeda) ?? null,
);

const quantidadeContas = computed(
  () => props.dados?.contas.filter((c) => c.moeda === props.moeda).length ?? 0,
);
</script>
