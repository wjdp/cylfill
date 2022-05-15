<script lang="ts" setup>
import { formatTimePeriod, TimePeriod } from "../util/time";
defineProps<{
  fillTime: TimePeriod;
}>();
</script>

<template>
  <div
    class="pointer-events-none fixed top-0 left-0 mb-12 flex h-[80vh] w-full flex-auto flex-col justify-center text-center text-7xl font-bold mix-blend-overlay"
  >
    <p>
      {{ formatTimePeriod(fillTime) }}
    </p>
  </div>
</template>
