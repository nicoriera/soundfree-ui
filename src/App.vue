<script setup>
import { onMounted } from "vue";
import { useDownloadStore } from "./stores/downloadStore";
import { useUIStore } from "./stores/uiStore";
import DownloadsList from "./components/DownloadsList.vue";
import AboutDialog from "./components/AboutDialog.vue";
import FolderSelector from "./components/FolderSelector.vue";

const downloadStore = useDownloadStore();
const uiStore = useUIStore();

onMounted(() => {
  // Initialisation si nécessaire
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation/Menu Bar -->
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="text-white text-xl font-bold">SoundFree Web</span>
          </div>
          <div class="flex">
            <button
              @click="downloadStore.showImportDialog"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Importer des URLs
            </button>
            <a
              href="https://soundcloud.com"
              target="_blank"
              class="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Soundcloud
            </a>
            <button
              @click="uiStore.toggleAboutDialog"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              À propos
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Ajout du sélecteur de dossier -->
      <FolderSelector />

      <!-- URL Input Section -->
      <div
        v-if="downloadStore.showUrlInput"
        class="bg-white shadow rounded-lg p-6 mb-6"
      >
        <div class="flex flex-col space-y-4">
          <textarea
            v-model="downloadStore.urls"
            class="w-full p-2 border rounded"
            rows="4"
            placeholder="Entrez vos URLs (une par ligne)"
          ></textarea>
          <div class="flex justify-end space-x-2">
            <button
              @click="downloadStore.processUrls"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              :disabled="
                downloadStore.isProcessing || !downloadStore.urls.trim()
              "
            >
              {{
                downloadStore.isProcessing
                  ? "Traitement..."
                  : "Traiter les URLs"
              }}
            </button>
            <button
              @click="downloadStore.cancelProcess"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              v-if="downloadStore.isProcessing"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <!-- Downloads List -->
      <DownloadsList />
    </main>

    <!-- About Dialog -->
    <AboutDialog v-if="uiStore.showAbout" @close="uiStore.toggleAboutDialog" />
  </div>
</template>
