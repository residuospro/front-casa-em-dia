<template>
  <ce-modal
    background="1"
    class="flex flex-col items-start w-2/5 sm:w-full"
    close-outside
    @close="fechar"
    :is-open="abrirModalVisualizar"
    show-close-button
    variant="secondary"
  >
    <div class="flex items-center justify-between w-full p-4">
      <h2 class="text-xl font-semibold text-black">Detalhes do lançamento</h2>
    </div>

    <div v-if="lancamento" class="flex flex-col gap-4 w-full px-4 pb-4 sm:px-2">
      <div class="flex items-center gap-3">
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{
            color: getTipoStyle(lancamento.tipo).cor,
            background: getTipoStyle(lancamento.tipo).background,
          }"
        >
          {{ getTipoStyle(lancamento.tipo).label }}
        </span>
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :style="{
            color: getStatusStyle(lancamento.status).cor,
            background: getStatusStyle(lancamento.status).background,
          }"
        >
          {{ getStatusStyle(lancamento.status).label }}
        </span>
      </div>

      <div>
        <h3 class="text-lg font-semibold text-black">{{ lancamento.titulo }}</h3>
        <p v-if="lancamento.descricao" class="text-sm text-black/60 mt-1">
          {{ lancamento.descricao }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-black/50">Valor:</span>
        <span
          class="text-xl font-semibold"
          :class="lancamento.tipo === 'DESPESA' ? 'text-red-600' : lancamento.tipo === 'RECEITA' ? 'text-green-600' : ''"
        >
          {{ lancamento.tipo === 'DESPESA' ? '-' : '' }}{{ formatarReal(lancamento.valor) }}
        </span>
      </div>

      <hr class="w-full h-px bg-gray-200" />

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
        <div>
          <span class="text-xs text-black/50">Data e hora</span>
          <p class="text-sm font-medium text-black">
            {{ formatarDataCompleta(lancamento.dataHora) }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Responsável</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.responsavel?.usuario?.nome ?? '----' }}
          </p>
        </div>
        <div>
          <span class="text-xs text-black/50">Conta de origem</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.contaOrigem?.nome ?? '----' }}
          </p>
        </div>
        <div v-if="lancamento.contaDestino">
          <span class="text-xs text-black/50">Conta de destino</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.contaDestino.nome }}
          </p>
        </div>
        <div v-if="lancamento.categoria">
          <span class="text-xs text-black/50">Categoria</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.categoria.nome }}
          </p>
        </div>
        <div v-if="lancamento.subcategoria">
          <span class="text-xs text-black/50">Subcategoria</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.subcategoria.nome }}
          </p>
        </div>
        <div v-if="lancamento.centroCusto">
          <span class="text-xs text-black/50">Centro de custo</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.centroCusto.nome }}
          </p>
        </div>
        <div v-if="lancamento.cartao">
          <span class="text-xs text-black/50">Cartão</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.cartao.nome }}
          </p>
        </div>
        <div v-if="lancamento.formaPagamento">
          <span class="text-xs text-black/50">Forma de pagamento</span>
          <p class="text-sm font-medium text-black">
            {{ formatarFormaPagamento(lancamento.formaPagamento) }}
          </p>
        </div>
        <div v-if="lancamento.localizacao">
          <span class="text-xs text-black/50">Localização</span>
          <p class="text-sm font-medium text-black">
            {{ lancamento.localizacao }}
          </p>
        </div>
      </div>

      <div v-if="lancamento.tags && lancamento.tags.length > 0">
        <span class="text-xs text-black/50">Tags</span>
        <div class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="t in lancamento.tags"
            :key="t.tag.id"
            class="px-3 py-1 rounded-full text-xs font-medium"
            :style="{
              color: t.tag.cor ?? '#374151',
              background: t.tag.cor ? `${t.tag.cor}20` : '#F3F4F6',
            }"
          >
            {{ t.tag.nome }}
          </span>
        </div>
      </div>

      <div v-if="lancamento.observacoes">
        <span class="text-xs text-black/50">Observações</span>
        <p class="text-sm text-black mt-1 whitespace-pre-line">
          {{ lancamento.observacoes }}
        </p>
      </div>

      <hr class="w-full h-px bg-gray-200" />

      <div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
        <span class="text-xs text-black/40">
          Criado em: {{ formatarDataCompleta(lancamento.criadoEm) }}
        </span>
        <span class="text-xs text-black/40">
          Atualizado em: {{ formatarDataCompleta(lancamento.atualizadoEm) }}
        </span>
      </div>
    </div>
  </ce-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { CeModal } from "@comercti/vue-components-hmg";
import { useLancamentos } from "../useLancamentos";
import { useClient } from "@/client";
import { usePerfil } from "@/store/usePerfil";
import { useUtils } from "@/utils/useUtils";
import type { ILancamento } from "../tipagem";
import type { FormaPagamento } from "@/utils/tipagem";
import { storeToRefs } from "pinia";

const { abrirModalVisualizar, getTipoStyle, getStatusStyle } = useLancamentos();
const { formatarReal } = useUtils();
const { perfil } = storeToRefs(usePerfil());

const lancamento = ref<ILancamento | null>(null);

watch(abrirModalVisualizar, async (aberto) => {
  if (!aberto) {
    lancamento.value = null;
    return;
  }

  const store = useLancamentos();
  const item = store.lancamentoVisualizando.value;
  if (!item) return;

  try {
    const resposta = await useClient.get(
      `/financeiro/${perfil.value.familiaId}/financeiro/lancamentos/${item.id}`,
    );
    lancamento.value = resposta.data;
  } catch {
    lancamento.value = item;
  }
});

const fechar = () => {
  abrirModalVisualizar.value = false;
};

const formatarDataCompleta = (data: Date) => {
  return new Date(data).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatarFormaPagamento = (fp: FormaPagamento) => {
  const map: Record<FormaPagamento, string> = {
    PIX: "PIX",
    DINHEIRO: "Dinheiro",
    DEBITO: "Débito",
    CREDITO: "Crédito",
    BOLETO: "Boleto",
    TRANSFERENCIA: "Transferência",
    OUTRO: "Outro",
  };
  return map[fp] ?? fp;
};
</script>
