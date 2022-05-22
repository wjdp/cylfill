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

const bgClass = ref<string>("bg-green-900");
const updateBgClass = () => {
  if (fill.isFilling()) {
    if (fill.getFillTimeRemaining(getNow()) || 0 > 0) {
      bgClass.value = "bg-filling";
    } else {
      bgClass.value = "bg-full";
    }
  } else {
    bgClass.value = "bg-green-900";
  }
};

const updateAll = () => {
  updateElementHeight();
  updateBgClass();
};

watch(() => fill.state.startingPressure, updateAll);
watch(() => fill.state.targetPressure, updateAll);
onMounted(updateAll);

let fillingTimer: number;

const setupFillingTimer = () => {
  if (fill.state.startTime) {
    updateAll();
    fillingTimer = window.setInterval(updateAll, 30);
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
</script>

<template>
  <div
    id="bg-fill"
    class="pointer-events-none fixed bottom-0 left-0 w-full opacity-75"
    :class="bgClass"
    :style="{ height: elementHeight }"
  ></div>
</template>

<style lang="sass" scoped>
#bg-fill
  transition: background 0.5s ease-in-out
  background-size: 500% 200%

.bg-full
  background: linear-gradient(115deg, #23f5ab,#00ff00,#aaff00,#23f5ab)
  animation: gradient 10s ease infinite


.bg-filling
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab,#ee7752, #e73c7e)
  animation: gradient 20s ease infinite


@keyframes gradient
  0%
    background-position: 0% 50%
  50%
    background-position: 100% 50%
  100%
    background-position: 0% 50%
</style>
