<script lang="ts" setup>
import { formatTimePeriod, TimePeriod } from "../util/time";
defineProps<{
  fillTime: TimePeriod;
}>();
</script>

<template>
  <div
    class="fixed top-0 left-0 w-full h-[80vh] pointer-events-none flex-auto flex flex-col justify-center text-center text-7xl font-bold mix-blend-overlay mb-12"
  >
    <p>
      {{ formatTimePeriod(fillTime) }}
    </p>
  </div>
</template>
