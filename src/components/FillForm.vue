<script lang="ts" setup>
import { computed, ref } from "vue";
import fill, { FillParameters } from "../service/fill";
import { getTimePeriod } from "../util/time";
import FieldNumber from "./FieldNumber.vue";
import AppButton from "./AppButton.vue";
import FillTime from "./FillTime.vue";
import AppIntro from "./AppIntro.vue";
import FillLogs from "./FillLogs.vue";
import log from "../service/log";

const showLogs = ref(false);

const onFieldInput = (
  field: keyof FillParameters,
  value: number | undefined
) => {
  fill.setFillParameters({
    [field]: value,
  });
};

// Force window down to bottom when field is focused
const onFieldFocus = () => {
  window.setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
};

const fillTime = computed(() => {
  try {
    return getTimePeriod(fill.getFillTime());
  } catch (e) {
    return undefined;
  }
});

const startFilling = () => {
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
          :value="fill.state.cylinderSize"
          @update:model-value="onFieldInput('cylinderSize', $event)"
          @focus="onFieldFocus"
        />
        <p>litres</p>

        <label for="cylinderSize">Starting pressure</label>
        <FieldNumber
          :value="fill.state.startingPressure"
          @update:model-value="onFieldInput('startingPressure', $event)"
          @focus="onFieldFocus"
        />
        <p>bar</p>

        <label for="cylinderSize">Fill rate</label>
        <FieldNumber
          :value="fill.state.fillRate"
          @update:model-value="onFieldInput('fillRate', $event)"
          @focus="onFieldFocus"
          :class="{ 'border-yellow-100': fill.state.fillRateFromLog }"
        />
        <p>L/min</p>

        <label for="cylinderSize">Target pressure</label>
        <FieldNumber
          :value="fill.state.targetPressure"
          @update:model-value="onFieldInput('targetPressure', $event)"
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
