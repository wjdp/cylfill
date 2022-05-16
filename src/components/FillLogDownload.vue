<script lang="ts" setup>
import { ref } from "vue";
import log from "../service/log";
import * as t from "typed-assert";

const downloadElementRef = ref<HTMLAnchorElement>();

const exportLogs = async () => {
  t.isNotUndefined(downloadElementRef.value);
  const filename = `cylfill-log-${new Date().toISOString()}.csv`;
  const blob = new Blob([log.getExportText()], { type: "text/csv" });
  const downloadUri = window.URL.createObjectURL(blob);
  downloadElementRef.value.href = downloadUri;
  downloadElementRef.value.download = filename;
  await downloadElementRef.value.click();
  window.URL.revokeObjectURL(downloadUri);
  downloadElementRef.value.href = "";
  downloadElementRef.value.download = "";
};
</script>

<template>
  <button @click="exportLogs">
    <img src="../assets/file-download.svg" alt="Close" class="h-6 w-6" />
    <a ref="downloadElementRef" class="hidden"></a>
  </button>
</template>
