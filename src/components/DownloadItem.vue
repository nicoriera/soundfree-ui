<script setup>
import { useDownloadStore } from "@/stores/downloadStore";

// Définir la prop download
const props = defineProps({
  download: {
    type: Object,
    required: true,
  },
});

const downloadStore = useDownloadStore();
</script>

<template>
  <div class="border rounded p-4 mb-4">
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-semibold">{{ props.download.title }}</h3>
        <p class="text-sm text-gray-500">{{ props.download.url }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm">{{ props.download.progress }}%</span>
        <div class="w-32 bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${props.download.progress}%` }"
          ></div>
        </div>
        <span class="text-sm">{{ props.download.status }}</span>
      </div>
    </div>
    <div
      v-if="props.download.status === downloadStore.DOWNLOAD_STATUS.ERROR"
      class="text-red-500 mt-2"
    >
      Erreur: {{ props.download.error }}
    </div>
  </div>
</template>
