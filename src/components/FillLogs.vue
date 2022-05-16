<script lang="ts" setup>
import { computed } from "vue";
import log from "../service/log";
import FillLogItem from "./FillLogItem.vue";
import FillLogDownload from "./FillLogDownload.vue";
import { getNow } from "../util/time";

defineEmits<{
  (e: "close"): void;
}>();

const logEntries = computed(log.getLogs);
const logStats = computed(() => log.getLogStats(getNow()));
</script>

<template>
  <main
    class="left-50 fixed top-0 z-10 mx-auto flex h-full w-full max-w-md flex-col bg-slate-400 text-black"
  >
    <header
      class="grid grid-cols-2 border-b border-black border-opacity-20 bg-white font-bold"
    >
      <h1 class="px-2 py-3 text-2xl">📕 Fill Logs</h1>
      <div class="justify-self-end py-3">
        <FillLogDownload class="mr-1 px-1 align-middle" />
        <button @click="$emit('close')" class="px-2 align-middle">
          <img src="../assets/close.svg" alt="Close" class="h-8 w-8" />
        </button>
      </div>
    </header>
    <ol class="flex-auto overflow-y-scroll">
      <FillLogItem
        v-for="entry in logEntries"
        :key="entry.id"
        :entry="entry"
        class="border-b border-black border-opacity-20"
      ></FillLogItem>
    </ol>
    <footer
      v-if="log.hasLogs()"
      class="grid grid-cols-3 bg-slate-800 p-2 text-white"
    >
      <div>
        <p class="text-xs">Number of logs</p>
        <p>{{ logEntries.length }}</p>
      </div>
      <div>
        <p class="text-xs">Fill rate today</p>
        <p v-if="logStats.fillRateToday">
          {{ Math.round(logStats.fillRateToday) }} L/m
        </p>
        <p v-else class="font-light">—</p>
      </div>
      <div>
        <p class="text-xs">Lifetime fill rate</p>
        <p v-if="logStats.fillRateAll">
          {{ Math.round(logStats.fillRateAll) }} L/m
        </p>
        <p v-else class="font-light">—</p>
      </div>
    </footer>
  </main>
</template>
