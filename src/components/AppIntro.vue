<script lang="ts" setup>
import { useWebNotification } from "@vueuse/core";
</script>

<template>
  <section class="py-2 px-2">
    <h1 class="my-8 text-center text-8xl font-bold">
      <span class="h-gradient">cylfill</span>
    </h1>
  </section>
</template>

<style lang="sass" scoped>
.h-gradient
  background: linear-gradient(311deg, rgba(41,70,200,1) 0%, rgba(97,227,163,1) 100%)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
</style>
