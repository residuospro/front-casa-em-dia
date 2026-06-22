<template>
  <div class="flex items-center gap-3">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :class="toggleClasses"
      @click="toggle"
    >
      <span
        class="inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0.5'"
      />
    </button>

    <span v-if="label" class="text-sm text-cinza_363637 select-none cursor-pointer" @click="toggle">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    label?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const toggleClasses = computed(() => {
  const base =
    "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#53864C] focus:ring-offset-2";

  const state = props.modelValue
    ? "bg-[#53864C]"
    : "bg-slate-600";

  const disabled = props.disabled ? "opacity-50 cursor-not-allowed" : "";

  return `${base} ${state} ${disabled}`;
});

const toggle = () => {
  if (props.disabled) return;
  emit("update:modelValue", !props.modelValue);
};
</script>
