<script lang="ts" setup>
import { computed, ref } from "vue";
import fill, { assertFillParameters, calculateFillTime } from "../service/fill";
import { getTimePeriod, formatTimePeriod } from "../util/time";
import FieldNumber from "./FieldNumber.vue";
import AppButton from "./AppButton.vue";
import FillTime from "./FillTime.vue";
import AppIntro from "./AppIntro.vue";
import FillLogs from "./FillLogs.vue";
import log from "../service/log";

const showLogs = ref(false);

const cylinderSize = ref<number | undefined>(fill.state.cylinderSize);
const startingPressure = ref<number | undefined>(fill.state.startingPressure);
const fillRate = ref<number | undefined>(fill.state.fillRate);
const targetPressure = ref<number | undefined>(fill.state.targetPressure);

const fillParams = computed(() => ({
  cylinderSize: cylinderSize.value,
  startingPressure: startingPressure.value,
  fillRate: fillRate.value,
  targetPressure: targetPressure.value,
}));

const onFieldInput = () => {
  fill.setFillParameters(fillParams.value);
};

const onFieldFocus = () => {
  window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
};

const fillTime = computed(() => {
  const params = fillParams.value;
  try {
    assertFillParameters(params);
  } catch (e) {
    return undefined;
  }
  if (startingPressure.value && startingPressure.value <= 0) {
    return undefined;
  }
  if (targetPressure.value && targetPressure.value <= 0) {
    return undefined;
  }
  if (
    targetPressure.value &&
    startingPressure.value &&
    targetPressure.value < startingPressure.value
  ) {
    return undefined;
  }
  if (cylinderSize.value && cylinderSize.value <= 0) {
    return undefined;
  }
  if (fillRate.value && fillRate.value <= 0) {
    return undefined;
  }
  const time = calculateFillTime(params);
  return getTimePeriod(time);
});

const startFilling = () => {
  const params = fillParams.value;
  try {
    assertFillParameters(params);
  } catch (e) {
    return;
  }
  fill.setFillParameters(params);
  fill.startFilling();
};
</script>

<template>
  <FillLogs v-if="showLogs" @close="showLogs = false" />
  <form @submit.prevent="startFilling" class="h-full">
    <section class="flex h-full flex-col">
      <FillTime v-if="fillTime" :fill-time="fillTime" />
      <AppIntro class="flex-auto" />
      <div class="grid-fill-params form-bg grid gap-2 px-2 pt-3">
        <label for="cylinderSize">Cylinder size</label>
        <FieldNumber
          id="cylinderSize"
          v-model="cylinderSize"
          @input="onFieldInput"
          @focus="onFieldFocus"
        />
        <p>litres</p>

        <label for="cylinderSize">Starting pressure</label>
        <FieldNumber
          v-model="startingPressure"
          @input="onFieldInput"
          @focus="onFieldFocus"
        />
        <p>bar</p>

        <label for="cylinderSize">Fill rate</label>
        <FieldNumber
          v-model="fillRate"
          @input="onFieldInput"
          @focus="onFieldFocus"
        />
        <p>L/min</p>

        <label for="cylinderSize">Target pressure</label>
        <FieldNumber
          v-model="targetPressure"
          @input="onFieldInput"
          @focus="onFieldFocus"
        />
        <p>bar</p>
      </div>
      <div class="form-bg flex flex-row px-2 py-6">
        <AppButton
          v-if="log.hasLogs()"
          class="btn-secondary mr-2 w-full flex-[1]"
          @click="showLogs = true"
          >Logs</AppButton
        >
        <AppButton
          type="submit"
          class="w-full flex-[3]"
          @click="startFilling"
          :disabled="!fillTime"
          >Fill</AppButton
        >
      </div>
    </section>
  </form>
</template>

<style lang="sass" scoped>
.grid-fill-params
    grid-template-columns: 1fr 6rem 3rem
    label, p
      @apply py-4
    p
      @apply font-extralight

.form-bg
  @apply bg-black bg-opacity-50
</style>
