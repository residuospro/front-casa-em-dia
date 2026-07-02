<template>
  <div>
    <label :for="id" class="block text-sm mb-1 !text-black" v-if="label">
      {{ label }}
    </label>

    <textarea
      :id="id"
      :rows="2"
      :placeholder="placeholder"
      class="w-full rounded-xl p-4 bg-white text-black border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#53864C]"
      :value="modelValue"
      @change="onChange"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  placeholder?: string;
  modelValue?: string | null;
  label?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const onChange = (event: Event) => {
  const input = event.target as HTMLTextAreaElement;
  emit("update:modelValue", input.value);
};
</script>
