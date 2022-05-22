<script lang="ts" setup>
import { ref } from "vue";
import { trackEvent } from "../analytics";
import { updateServiceWorker } from "../pwa";

const updateNeeded = updateServiceWorker.needRefresh;
const doingUpdate = ref(false);

const doUpdate = async () => {
  doingUpdate.value = true;
  trackEvent("Updated app");
  await updateServiceWorker.updateServiceWorker();
  window.location.reload();
};
</script>

<template>
  <p v-if="updateNeeded" class="text-center">
    <span
      @click="doUpdate"
      class="rounded-full bg-black bg-opacity-80 px-3 py-1 pb-1.5 align-middle font-bold"
    >
      <img
        v-if="doingUpdate"
        src="../assets/refresh.svg"
        class="inline h-5 w-5 animate-spin"
        alt="Update"
      />
      <img
        v-else
        src="../assets/arrow-up-circle.svg"
        class="inline h-5 w-5"
        alt="Update"
      />
      Update Available
    </span>
  </p>
</template>
