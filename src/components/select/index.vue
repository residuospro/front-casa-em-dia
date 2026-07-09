<template>
  <div>
    <label v-if="label" class="block text-sm mb-1 text-black">
      {{ label }}
    </label>

    <!-- Single select nativo -->
    <div v-if="!multiple" class="relative">
      <select
        :value="modelValue"
        @change="onChange"
        class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C] appearance-none cursor-pointer pr-10"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>

        <option
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          class="bg-white text-black"
        >
          {{ item.text }}
        </option>
      </select>

      <div
        class="absolute inset-y-0 right-3 flex items-center pointer-events-none"
      >
        <svg-icon
          type="mdi"
          :path="mdiChevronDown"
          class="w-5 h-5 text-slate-400"
        />
      </div>
    </div>

    <!-- Multi select custom -->
    <div v-else class="relative" ref="containerRef">
      <div
        class="w-full min-h-[42px] px-3 py-1.5 rounded-lg border bg-white text-black border-slate-700 focus-within:ring-2 focus-within:ring-[#53864C] cursor-pointer flex flex-wrap items-center gap-1.5"
        @click="toggleDropdown"
      >
        <span
          v-for="valor in modelValueParsed"
          :key="valor"
          class="inline-flex items-center gap-1 bg-[#53864C] text-white text-xs font-medium px-2 py-0.5 rounded-full"
        >
          {{ textoPorValor(valor) }}
          <button
            @click.stop="remover(valor)"
            class="hover:text-white/80 leading-none text-sm"
          >
            &times;
          </button>
        </span>

        <span
          v-if="!modelValueParsed.length"
          class="text-sm text-gray-400"
        >
          {{ placeholder || "Selecione..." }}
        </span>

        <div class="ml-auto flex items-center">
          <svg-icon
            type="mdi"
            :path="mdiChevronDown"
            class="w-5 h-5 text-slate-400"
          />
        </div>
      </div>

      <div
        v-if="aberto"
        class="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-60 overflow-auto"
      >
        <div
          v-for="item in items"
          :key="item.value"
          class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
          @click="toggleItem(item.value)"
        >
          <input
            type="checkbox"
            :checked="estaSelecionado(item.value)"
            class="accent-[#53864C]"
            @click.stop
          />
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";
import { computed, ref, onMounted, onUnmounted } from "vue";

interface SelectItem {
  text: string;
  value: string | number;
}

const props = defineProps<{
  modelValue?: string | string[] | null;
  label?: string;
  placeholder?: string;
  items: SelectItem[];
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const aberto = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const fecharFora = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    aberto.value = false;
  }
};

onMounted(() => document.addEventListener("mousedown", fecharFora));
onUnmounted(() => document.removeEventListener("mousedown", fecharFora));

const modelValueParsed = computed<string[]>(() => {
  if (!props.modelValue) return [];
  return Array.isArray(props.modelValue) ? props.modelValue : [];
});

const textoPorValor = (valor: string | number) => {
  return props.items.find((i) => i.value === valor)?.text ?? valor;
};

const estaSelecionado = (valor: string | number) => {
  return modelValueParsed.value.includes(String(valor));
};

const toggleItem = (valor: string | number) => {
  const str = String(valor);
  const atual = modelValueParsed.value;
  const novo = atual.includes(str)
    ? atual.filter((v) => v !== str)
    : [...atual, str];
  emit("update:modelValue", novo);
};

const remover = (valor: string | number) => {
  const str = String(valor);
  emit(
    "update:modelValue",
    modelValueParsed.value.filter((v) => v !== str),
  );
};

const toggleDropdown = () => {
  aberto.value = !aberto.value;
};

const onChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;
  emit("update:modelValue", select.value);
};
</script>
