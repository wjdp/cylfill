<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-200.css";
import "./tailwind.css";
import "./transitions.sass";

import FillForm from "./components/FillForm.vue";
import BgFill from "./components/BgFill.vue";
import FillStatus from "./components/FillStatus.vue";
import fill from "./service/fill";
</script>

<template>
  <BgFill class="-z-40" />
  <main id="main" class="select-none">
    <section class="mx-auto h-full max-w-md">
      <FillStatus v-if="fill.isFilling()" />
      <FillForm v-else />
    </section>
  </main>
</template>

<style lang="sass">
html
  @apply h-full
body
  @apply bg-slate-900 text-white
  // Disable pull down to refresh
  // See: https://stackoverflow.com/questions/52342200/how-to-prevent-pull-to-refresh-in-pwa-progressive-web-apps
  overscroll-behavior-y: contain
body, #app, #main
  @apply h-full
</style>
