<script setup>
import { useDownloadStore } from "@/stores/downloadStore";

const downloadStore = useDownloadStore();

const selectFolder = async () => {
  try {
    // Utilisation de l'API du système de fichiers
    const dirHandle = await window.showDirectoryPicker();
    downloadStore.setDownloadPath(dirHandle.name);
  } catch (error) {
    console.error("Erreur lors de la sélection du dossier:", error);
  }
};
</script>

<template>
  <div class="mb-4">
    <div class="flex items-center space-x-2">
      <button
        @click="selectFolder"
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Choisir le dossier
      </button>
      <span v-if="downloadStore.downloadPath" class="text-sm text-gray-600">
        Dossier sélectionné: {{ downloadStore.downloadPath }}
      </span>
    </div>
  </div>
</template>
