<script setup>
import { useDownloadStore } from "@/stores/downloadStore";
import DownloadItem from "@/components/DownloadItem.vue";

const downloadStore = useDownloadStore();
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-xl font-bold mb-4">Téléchargements</h2>
    <div
      v-if="!downloadStore.hasActiveDownloads"
      class="text-gray-500 text-center py-4"
    >
      Aucun téléchargement en cours
    </div>
    <div v-else class="space-y-4">
      <DownloadItem
        v-for="download in downloadStore.downloads"
        :key="download.id"
        :download="download"
      />
    </div>
    <button
      @click="downloadStore.processUrls"
      class="bg-blue-600 text-white px-4 py-2 rounded mt-4"
    >
      Télécharger
    </button>
  </div>
</template>
