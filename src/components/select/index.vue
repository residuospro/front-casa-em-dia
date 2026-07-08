<template>
  <div>
    <label v-if="label" class="block text-sm mb-1 text-black">
      {{ label }}
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        @change="onChange"
        :multiple="multiple"
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
  </div>
</template>

<script setup lang="ts">
///@ts-ignore
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown } from "@mdi/js";

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

const onChange = (event: Event) => {
  const select = event.target as HTMLSelectElement;

  if (props.multiple) {
    const valores = Array.from(select.selectedOptions).map((o) => o.value);
    emit("update:modelValue", valores);
  } else {
    emit("update:modelValue", select.value);
  }
};
</script>
