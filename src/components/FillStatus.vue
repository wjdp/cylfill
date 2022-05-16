<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import fill from "../service/fill";
import {
  getNow,
  getTimePeriod,
  TimePeriod,
  formatTimePeriod,
} from "../util/time";
import AppButton from "./AppButton.vue";
import * as t from "typed-assert";
import { computed } from "@vue/reactivity";
import { useTitle, useWebNotification } from "@vueuse/core";
import type { UseWebNotificationOptions } from "@vueuse/core";
import FillTime from "./FillTime.vue";

const fillTimeRemaining = ref<TimePeriod>();
const litresFilled = ref<number>();
const currentPressure = ref<number>();
const full = ref<boolean>(false);
const pageTitle = useTitle();

const updateFillStats = () => {
  const now = getNow();
  const gotFillTimeRemaining = fill.getFillTimeRemaining(now);
  const gotLitresFilled = fill.getLitresFilled(now);
  const gotCurrentPressure = fill.getCurrentPressure(now);
  t.isNumber(gotFillTimeRemaining);
  t.isNumber(gotLitresFilled);
  t.isNumber(gotCurrentPressure);
  t.isNumber(fill.state.targetPressure);
  fillTimeRemaining.value = getTimePeriod(gotFillTimeRemaining);
  litresFilled.value = Math.round(gotLitresFilled);
  currentPressure.value = Math.round(gotCurrentPressure);
  if (gotCurrentPressure >= fill.state.targetPressure && !full.value) {
    full.value = true;
    onFull();
  }
  pageTitle.value = `${formatTimePeriod(fillTimeRemaining.value)} - cylfill`;
};

const onFull = () => {
  // TODO: Notify user that fill is complete
};

let interval: number;

onMounted(() => {
  updateFillStats();
  interval = window.setInterval(updateFillStats, 100);
});

onUnmounted(() => {
  clearInterval(interval);
  pageTitle.value = "cylfill";
});

const stopFilling = () => {
  if (!full.value && !confirm("You sure?")) {
    return;
  }
  fill.stopFilling();
};
</script>

<template>
  <section
    class="flex h-full flex-col justify-end py-4 px-2"
    v-if="fillTimeRemaining"
  >
    <FillTime :fill-time="fillTimeRemaining" />
    <div
      class="my-6 grid grid-cols-3 rounded-lg bg-black bg-opacity-[15%] py-2 text-center text-sm"
    >
      <p>started {{ fill.getStartTimeFormatted() }}</p>
      <p>{{ currentPressure }} bar</p>
      <p>{{ litresFilled }} litres</p>
    </div>
    <AppButton class="w-full" @click="stopFilling">Stop filling</AppButton>
  </section>
</template>
