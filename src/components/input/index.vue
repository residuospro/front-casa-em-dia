<template>
  <div>
    <label v-if="label" class="block text-sm mb-1 !text-black">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- FILE INPUT CUSTOM -->
    <div v-if="type === 'file'" class="relative">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="audio/*,video/mp4"
        @change="onChange"
      />

      <button
        type="button"
        @click="openFileDialog"
        class="w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C] appearance-none cursor-pointer pr-10"
      >
        <span class="truncate">
          {{ fileName || "" }}
        </span>

        <span class="ml-4 text-sm font-medium text-[#53864c] whitespace-nowrap">
          Escolher ficheiro
        </span>
      </button>
    </div>

    <!-- INPUT NORMAL -->
    <div v-else class="relative">
      <input
        :type="type"
        :step="type === 'time' ? 60 : 0"
        :placeholder="placeholder"
        :value="modelValue"
        @change="onChange"
        @input="onChange"
        :class="type === 'color' ? 'h-[2.6rem]' : ''"
        class="!w-full px-4 py-2 rounded-lg border bg-white text-black border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C] appearance-none cursor-pointer pr-10"
      />

      <div
        v-if="$slots.trailing"
        class="absolute inset-y-0 right-3 flex items-center"
      >
        <slot name="trailing" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string | File | null | number;
    label?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }>(),
  {
    type: "text",
    required: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | File | null | number): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const fileName = computed(() =>
  props.modelValue instanceof File ? props.modelValue.name : "",
);

const openFileDialog = () => {
  fileInput.value?.click();
};

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.type === "file") {
    emit("update:modelValue", input.files?.[0] ?? null);
  } else {
    emit("update:modelValue", input.value);
  }
};
</script>
