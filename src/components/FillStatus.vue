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

let notifyUser: (options: UseWebNotificationOptions) => void;

const setupNotification = () => {
  const { isSupported, show } = useWebNotification();
  if (isSupported) {
    notifyUser = show;
  }
};

const onFull = () => {
  if (notifyUser) {
    notifyUser({
      title: "Fill Complete",
      body: "The tank should now be full!",
      vibrate: [200, 100, 200],
    });
  }
};

let interval: number;

onMounted(() => {
  updateFillStats();
  setupNotification();
  interval = setInterval(updateFillStats, 100);
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
    <div class="my-6 grid grid-cols-3 text-center">
      <p>started {{ fill.getStartTimeFormatted() }}</p>
      <p>{{ currentPressure }} bar</p>
      <p>{{ litresFilled }} litres filled</p>
    </div>
    <AppButton
      class="w-full"
      @click="stopFilling"
      :class="full ? 'btn-green' : 'btn-primary'"
      >Stop filling</AppButton
    >
  </section>
</template>
