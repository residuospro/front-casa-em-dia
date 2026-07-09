<template>
  <div class="mb-12 xl:!mb-0">
    <label v-if="label" class="block text-sm mb-2 text-black">
      {{ label }}
    </label>

    <div class="flex gap-2 h-10 xl:!flex-row flex-col w-full" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="tab.value === modelValue"
        :class="tabClasses(tab.value)"
        @click="select(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabItem {
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    tabs: TabItem[];
    label?: string;
  }>(),
  {
    modelValue: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const tabClasses = (value: string) => {
  const base =
    "px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#53864C] focus:ring-offset-2";

  const active =
    value === props.modelValue
      ? "bg-[#53864C] text-white shadow-sm"
      : "bg-white text-black/70 border  hover:border-[#53864C]/40 hover:text-[#53864C]";

  return `${base} ${active}`;
};

const select = (value: string) => {
  emit("update:modelValue", value);
};
</script>
