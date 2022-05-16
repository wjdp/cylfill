<script lang="ts" setup>
import { onLongPress } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { LogEntryEnhanced } from "../service/log";
import { formatTimePeriod, getTimePeriod } from "../util/time";
import log from "../service/log";

const props = defineProps<{
  entry: LogEntryEnhanced;
}>();

const formatDateTime = (d: number) => {
  const date = new Date(d * 1000);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const formatDuration = (d: number) => formatTimePeriod(getTimePeriod(d));

const itemElementHook = ref<HTMLElement>();

const onLongPressCallbackHook = (e: PointerEvent) => {
  if (!confirm("Delete?")) {
    return;
  }
  log.deleteLogEntry(props.entry.id);
};
onMounted(() =>
  onLongPress(itemElementHook, onLongPressCallbackHook, { delay: 300 })
);
</script>

<template>
  <li
    :key="entry.startTime"
    class="bg-white py-3 px-2"
    ref="itemElementHook"
  >
    <div class="text-xs text-gray-600">
      {{ formatDateTime(entry.startTime) }}
    </div>
    <div class="grid-fill-log-item grid">
      <div>{{ entry.cylinderSize }}L</div>
      <div class="text-right">
        {{ entry.startingPressure }} › {{ entry.targetPressure }} bar
      </div>
      <div class="text-right">
        {{ formatDuration(entry.duration) }}
      </div>
      <div class="text-right font-bold">
        {{ Math.round(entry.fillRate) }} L/m
      </div>
    </div>
  </li>
</template>

<style lang="sass" scoped>
.grid-fill-log-item
    grid-template-columns: 1fr 4fr 3fr 3fr
</style>
