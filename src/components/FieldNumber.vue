<script lang="ts" setup>
defineProps<{
  modelValue?: number;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", id: number | undefined): void;
}>();

const onInput = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).valueAsNumber;
  if (newValue) {
    emit("update:modelValue", newValue);
  } else {
    emit("update:modelValue", undefined);
  }
};
</script>

<template>
  <input
    type="number"
    :value="modelValue"
    @input="onInput"
    min="0"
    class="border-2 rounded-lg border-slate-500 px-2 py-4 bg-transparent font-bold"
  />
</template>
