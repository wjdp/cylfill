<script lang="ts" setup>
import { updateServiceWorker } from "../pwa";

const updateNeeded = updateServiceWorker.needRefresh;

const doUpdate = async () => {
  await updateServiceWorker.updateServiceWorker();
  window.location.reload();
};
</script>

<template>
  <p v-if="updateNeeded" class="text-center">
    <span
      @click="doUpdate"
      class="rounded-full bg-black bg-opacity-80 px-2 py-1 align-middle font-bold"
    >
      <img
        src="../assets/arrow-up-circle.svg"
        class="inline h-5"
        alt="Update"
      />
      Update Available
    </span>
  </p>
</template>
