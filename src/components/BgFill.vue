<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import fill from "../service/fill";
import * as t from "typed-assert";
import { getNow } from "../util/time";

const elementHeight = ref<string>("0%");

const updateElementHeight = () => {
  const currentPressure = fill.getCurrentPressure(getNow()) ?? 0;
  const targetPressure = fill.state.targetPressure;
  try {
    t.isNumber(currentPressure);
    t.isNumber(targetPressure);
  } catch {
    return "0%";
  }
  const heightPercentage = Math.min(
    (currentPressure / targetPressure) * 100,
    100
  );
  elementHeight.value = `${heightPercentage}%`;
};

watch(() => fill.state.startingPressure, updateElementHeight);
watch(() => fill.state.targetPressure, updateElementHeight);
onMounted(updateElementHeight);

let fillingTimer: number;

const setupFillingTimer = () => {
  if (fill.state.startTime) {
    updateElementHeight();
    fillingTimer = window.setInterval(updateElementHeight, 30);
  } else {
    window.clearInterval(fillingTimer);
  }
};

// When user starts filling
watch(() => fill.state.startTime, setupFillingTimer);
// When restoring from local storage
onMounted(setupFillingTimer);
// Cleanup
onUnmounted(() => window.clearInterval(fillingTimer));

// const bgClass = ref<string>('bg-indigo-700');
</script>

<template>
  <div
    class="pointer-events-none fixed bottom-0 left-0 w-full bg-green-900 opacity-75"
    :style="{ height: elementHeight }"
  ></div>
</template>
