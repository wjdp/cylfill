<script lang="ts" setup>
withDefaults(defineProps<{ btnClass?: string }>(), { btnClass: "btn-primary" });
</script>

<template>
  <button :class="btnClass" class="btn" type="button">
    <slot />
  </button>
</template>

<style lang="sass" scoped>
.btn
  @apply rounded-lg px-2 py-3
  @apply text-white font-bold
  @apply disabled:bg-slate-400 disabled:opacity-30

.btn-primary
  @apply bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800
  @apply disabled:bg-slate-400 disabled:opacity-30

.btn-secondary
  @apply bg-slate-700 hover:bg-slate-600 active:bg-slate-800
  @apply disabled:bg-slate-400 disabled:opacity-30
</style>
