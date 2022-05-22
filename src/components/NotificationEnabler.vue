<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  getNotificationState,
  showTestNotification,
} from "../service/notification";

const permissionState = ref();
const updatePermissionState = async () =>
  (permissionState.value = await getNotificationState());
onMounted(updatePermissionState);

const requestPermission = async () => {
  await Notification.requestPermission();
  updatePermissionState();
};

const testNotification = () => {
  showTestNotification();
};

const showDisabledNotificationMessage = () =>
  alert(
    "Notifications are disabled. To enable them you'll need to turn the " +
      "permission on in your browser settings."
  );

const showNotificationState = async () => {
  await updatePermissionState();
  alert(
    "Your device doesn't seem to support Notifications. " +
      `Error code: ${permissionState.value}`
  );
};
</script>

<template>
  <p v-if="permissionState === 'default'" class="text-center">
    <span
      class="rounded-full bg-black bg-opacity-80 px-3 py-1 pb-1.5 align-middle font-bold"
      @click="requestPermission"
    >
      <img src="../assets/bell.svg" class="inline h-5 w-5" alt="Update" />
      Enable Notifications
    </span>
  </p>
  <p v-else-if="permissionState === 'granted'" class="text-center">
    <span
      class="rounded-full bg-black bg-opacity-80 px-3 py-1 pb-1.5 align-middle"
      @click="testNotification"
    >
      <img
        src="../assets/circle-check.svg"
        class="inline h-5 w-5"
        alt="Update"
      />
      Notifications Enabled
    </span>
  </p>
  <p v-else-if="permissionState === 'denied'" class="text-center">
    <span
      class="rounded-full bg-black bg-opacity-80 px-3 py-1 pb-1.5 align-middle"
      @click="showDisabledNotificationMessage"
    >
      <img src="../assets/bell-x.svg" class="inline h-5 w-5" alt="Update" />
      Notifications Disabled
    </span>
  </p>
  <p v-else class="text-center">
    <span
      class="rounded-full bg-black bg-opacity-80 px-3 py-1 pb-1.5 align-middle"
      @click="showNotificationState"
    >
      <img src="../assets/bell-x.svg" class="inline h-5 w-5" alt="Update" />
      Notifications Unsupported
    </span>
  </p>
</template>
