<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { formatTimePeriod, TimePeriod } from "../util/time";
const props = defineProps<{
  fillTime: TimePeriod;
}>();

const windowWidth = window.innerWidth;
const getTextSize = (fillTime: TimePeriod): number => {
  if (fillTime.hours === 0 && fillTime.minutes === 0) {
    return windowWidth / 2;
  } else if (fillTime.hours === 0) {
    return windowWidth / 4;
  } else {
    return windowWidth / 6;
  }
};

let fillTimeLast = props.fillTime;
const fillTimeDisplay = ref(formatTimePeriod(props.fillTime));
const textSize = ref(getTextSize(props.fillTime));

const update = () => {
  if (props.fillTime === fillTimeLast) {
    return;
  }
  fillTimeDisplay.value = formatTimePeriod(props.fillTime);
  textSize.value = getTextSize(props.fillTime);
  fillTimeLast = props.fillTime;
};

let updateTimer: number;

onMounted(() => {
  update();
  updateTimer = window.setInterval(update, 80);
});
onUnmounted(() => window.clearTimeout(updateTimer));
</script>

<template>
  <div
    class="pointer-events-none fixed top-0 left-0 mb-12 flex h-[80vh] w-full flex-auto flex-col justify-center text-center font-bold mix-blend-overlay"
    :style="{ fontSize: textSize + 'px', lineHeight: 1.1 }"
  >
    <p>
      {{ fillTimeDisplay }}
    </p>
  </div>
</template>
