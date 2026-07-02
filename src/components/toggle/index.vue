<template>
  <div class="flex items-center gap-3">
    <button type="button" @click="toggle" class="flex items-center gap-3">
      <div
        class="w-10 h-5 rounded-full p-1"
        :class="modelValue ? 'bg-[#53864C]' : 'bg-gray-300'"
      >
        <div
          class="w-3 h-3 rounded-full bg-white transition"
          :class="modelValue ? 'translate-x-5' : ''"
        />
      </div>

      <span
        v-if="label"
        class="text-sm text-cinza_363637 select-none cursor-pointer"
        @click="toggle"
      >
        {{ label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
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

const toggle = () => {
  if (props.disabled) return;
  emit("update:modelValue", !props.modelValue);
};
</script>
