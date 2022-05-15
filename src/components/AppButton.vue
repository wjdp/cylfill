<script lang="ts" setup>
withDefaults(defineProps<{ btnClass?: string }>(), { btnClass: "btn-primary" });
</script>

<template>
  <button :class="btnClass" class="btn">
    <slot />
  </button>
</template>

<style lang="sass" scoped>
.btn
  @apply rounded-lg px-2 py-3
  @apply text-white font-bold
  @apply disabled:bg-slate-400 disabled:opacity-30

.btn-primary
  @apply bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-900

.btn-secondary
  @apply bg-slate-700 hover:bg-slate-600 active:bg-slate-900

.btn-green
  @apply bg-green-600 hover:bg-green-500 active:bg-green-800
</style>
