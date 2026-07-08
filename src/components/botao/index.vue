<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses">
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    type?: "button" | "submit";
    variant?: "primary" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary",
    size: "md",
    disabled: false,
  },
);

const buttonClasses = computed(() => {
  const base =
    "w-auto p-2 rounded-lg font-semibold transition disabled:opacity-60 active:scale-90";

  const variants = {
    primary: "text-white bg-[#53864C]",
    outline: "border border-gray-300 hover:bg-gray-50 transition-colors",
  };

  const tamanho = {
    sm: "text-sm h-8",
    md: "text-base h-10",
    lg: "text-lg h-12",
  };

  return `${base} ${variants[props.variant || "primary"]} ${
    tamanho[props.size || "md"]
  }`;
});
</script>
