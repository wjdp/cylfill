<script lang="ts" setup>
import { GITHUB_PROJECT_URL } from "../constants";
import { areDebugFeaturesEnabled } from "../util/debug";

const version = import.meta.env.VITE_COMMIT_SHA?.slice(0, 6) || "unknown";
</script>

<template>
  <section class="py-2 px-2">
    <h1 class="my-8 text-center text-8xl font-bold">
      <span class="h-gradient relative">
        <a
          :href="GITHUB_PROJECT_URL"
          target="_blank"
          class="absolute -right-5 top-0 block h-5 w-5"
        >
          <!-- Double stack to get mix-blend and brighten a touch -->
          <img
            src="../assets/github.svg"
            alt="GitHub"
            class="absolute top-0 left-0 h-full w-full mix-blend-overlay"
          />
          <img
            src="../assets/github.svg"
            alt="GitHub"
            class="absolute top-0 left-0 h-full w-full opacity-5"
          />
        </a>
        cylfill
      </span>
    </h1>
    <p class="text-center text-sm text-slate-800">{{ version }}</p>
    <p
      v-if="areDebugFeaturesEnabled()"
      class="text-center text-sm text-yellow-300 opacity-25"
    >
      with debug features!
    </p>
  </section>
</template>

<style lang="sass" scoped>
.h-gradient
  background: linear-gradient(311deg, rgba(41,70,200,1) 0%, rgba(97,227,163,1) 100%)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
</style>
