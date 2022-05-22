<script lang="ts" setup>
import { ref } from "vue";
import { LogEntryEnhanced } from "../service/log";
import { formatTimePeriodHMS, getTimePeriod } from "../util/time";
import log from "../service/log";

const props = defineProps<{
  entry: LogEntryEnhanced;
}>();

const formatDateTime = (d: number) => {
  const date = new Date(d * 1000);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
const formatDuration = (d: number) => formatTimePeriodHMS(getTimePeriod(d));

// Implement our own long press handling as the vue-use one doesn't handle
// subsequent presses on different elements well.
const isPreTouching = ref<number>();
const isTouching = ref<number>();
const onTouchStart = () =>
  (isPreTouching.value = window.setTimeout(
    () => (isTouching.value = window.setTimeout(onLongPress, 300)),
    120
  ));
const onTouchEnd = () => {
  window.clearTimeout(isPreTouching.value);
  window.clearTimeout(isTouching.value);
  isPreTouching.value = undefined;
  isTouching.value = undefined;
};
const onLongPress = () => {
  isTouching.value = undefined;
  if (!confirm("Delete?")) {
    return;
  }
  log.deleteLogEntry(props.entry.id);
};
</script>

<template>
  <li
    :key="entry.startTime"
    class="bg-fade bg-white py-3 px-2"
    :class="{ 'bg-red-200': isTouching !== undefined }"
    @touchstart="onTouchStart"
    @touchmove="onTouchEnd"
    @touchend="onTouchEnd"
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

.bg-fade
  transition: background-color 290ms ease-out
</style>
