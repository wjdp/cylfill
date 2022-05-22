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
import log from "../service/log";
import FillCompleteInfo from "./FillCompleteInfo.vue";
import { trackEvent } from "../analytics";
import {
  closeNotificationsByTag,
  showNotification,
} from "../service/notification";

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
  showNotification("Fill Complete", {
    tag: "fill-complete",
    body: "The tank should be full.",
  });
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

const cancelFilling = () => {
  if (
    !confirm(
      "Are you sure you want to cancel? This won't save this fill in the logs."
    )
  ) {
    return;
  }
  trackEvent("Cancelled filling");
  closeNotificationsByTag("fill-complete");
  fill.stopFilling();
};

const PROMPT_AT_DELTA = 50;

const finishFilling = () => {
  t.isNumber(fill.state.targetPressure);
  t.isNumber(currentPressure.value);
  const targetDelta = Math.abs(
    fill.state.targetPressure - currentPressure.value
  );
  if (
    targetDelta > PROMPT_AT_DELTA &&
    !confirm("You sure? This will save this fill in the logs.")
  ) {
    return;
  }
  t.isNumber(fill.state.cylinderSize);
  t.isNumber(fill.state.startingPressure);
  t.isNumber(fill.state.targetPressure);
  t.isNumber(fill.state.startTime);
  log.addLogEntry({
    cylinderSize: fill.state.cylinderSize,
    startingPressure: fill.state.startingPressure,
    targetPressure: fill.state.targetPressure,
    startTime: fill.state.startTime,
    endTime: getNow(),
  });
  trackEvent("Finished filling");
  closeNotificationsByTag("fill-complete");
  fill.stopFilling();
};
</script>

<template>
  <section
    class="flex h-full flex-col justify-end px-4"
    v-if="fillTimeRemaining"
  >
    <FillTime :fill-time="fillTimeRemaining" />
    <Transition name="slide-fade"><FillCompleteInfo v-if="full" /></Transition>
    <div
      class="my-3 grid grid-cols-3 gap-1 rounded-lg bg-black bg-opacity-[10%] py-2 text-center text-sm"
    >
      <p>
        <span class="font-light">started</span>
        {{ fill.getStartTimeFormatted() }}
      </p>
      <p>{{ currentPressure }} bar</p>
      <p>{{ litresFilled }} litres</p>
      <p>
        <span class="font-light">finish at</span>
        {{ fill.getEndTimeFormatted() }}
      </p>
      <p>
        <span class="font-light">fill to</span> {{ fill.state.targetPressure }}
      </p>
      <p>
        {{ fill.state.cylinderSize }}L
        <span class="font-light">@</span>
        {{ fill.state.fillRate }} L/m
      </p>
    </div>
    <div class="my-3 mb-6 flex flex-row">
      <AppButton
        class="btn-secondary mr-2 w-full flex-[1]"
        @click="cancelFilling"
        >Cancel</AppButton
      >
      <AppButton type="submit" class="w-full flex-[3]" @click="finishFilling"
        >Finish Filling</AppButton
      >
    </div>
  </section>
</template>
