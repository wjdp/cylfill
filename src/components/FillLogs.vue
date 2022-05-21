<script lang="ts" setup>
import { computed } from "vue";
import log from "../service/log";
import FillLogItem from "./FillLogItem.vue";
import FillLogDownload from "./FillLogDownload.vue";
import { getNow } from "../util/time";
import { areDebugFeaturesEnabled } from "../util/debug";
import fill from "../service/fill";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const logEntries = computed(log.getLogs);
const logStats = computed(() => log.getLogStats(getNow()));

const deleteAllLogs = () => {
  if (confirm("Delete all fill logs? This cannot be undone.")) {
    log.resetStore();
    log.writeToLocalStorage();
    emit("close");
  }
};

const addFakeLogEntry = () => {
  if (areDebugFeaturesEnabled()) {
    log.generateFakeLogEntry();
  }
};

const setFillRate = (fillRate: number) => {
  fill.setFillRateFromLog(Math.round(fillRate));
  emit("close");
};
</script>

<template>
  <main
    class="left-50 fixed top-0 z-10 mx-auto flex h-full w-full max-w-md flex-col bg-slate-400 text-black"
  >
    <header
      class="grid grid-cols-2 border-b border-black border-opacity-20 bg-white font-bold"
    >
      <h1 class="px-2 py-3 text-2xl" @click="addFakeLogEntry">📕 Fill Logs</h1>
      <div class="justify-self-end py-3">
        <button @click="deleteAllLogs" class="mx-2 px-1 align-middle">
          <img src="../assets/trash.svg" alt="Close" class="h-6 w-6" />
        </button>
        <FillLogDownload class="mx-2 px-1 align-middle" />
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
        <p
          v-if="logStats.fillRateToday"
          @click="setFillRate(logStats.fillRateToday)"
        >
          {{ Math.round(logStats.fillRateToday) }} L/m
        </p>
        <p v-else class="font-light">—</p>
      </div>
      <div>
        <p class="text-xs">Lifetime fill rate</p>
        <p
          v-if="logStats.fillRateAll"
          @click="setFillRate(logStats.fillRateAll)"
        >
          {{ Math.round(logStats.fillRateAll) }} L/m
        </p>
        <p v-else class="font-light">—</p>
      </div>
    </footer>
  </main>
</template>
