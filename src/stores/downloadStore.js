import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useDownloadStore = defineStore("download", () => {
  const showUrlInput = ref(false);
  const urls = ref("");
  const isProcessing = ref(false);
  const downloads = ref([]);
  const downloadPath = ref(null);

  // URL de l'API backend (à configurer selon votre environnement)
  const API_URL = "http://localhost:3000";

  const DOWNLOAD_STATUS = {
    WAITING: "En attente",
    DOWNLOADING: "En cours",
    COMPLETED: "Terminé",
    ERROR: "Erreur",
  };

  const hasActiveDownloads = computed(() => downloads.value.length > 0);

  const startDownload = async (download) => {
    try {
      // Récupérer d'abord les informations de la piste
      const infoResponse = await fetch(`${API_URL}/api/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: download.url }),
      });

      if (!infoResponse.ok) {
        const errorData = await infoResponse.json();
        throw new Error(
          errorData.details ||
            errorData.error ||
            "Erreur lors de la récupération des informations"
        );
      }

      const trackInfo = await infoResponse.json();
      download.title = trackInfo.title;

      // Démarrer le téléchargement
      download.status = DOWNLOAD_STATUS.DOWNLOADING;
      download.progress = 0;

      const response = await fetch(`${API_URL}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: download.url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            errorData.error ||
            "Erreur lors du téléchargement"
        );
      }

      // Récupérer le nom du fichier depuis le header Content-Disposition
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `${download.title}.mp3`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Créer un lien de téléchargement
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      download.status = DOWNLOAD_STATUS.COMPLETED;
      download.progress = 100;
    } catch (error) {
      download.status = DOWNLOAD_STATUS.ERROR;
      download.error = error.message; // Stockons le message d'erreur
      console.error("Erreur détaillée:", error);
      throw error;
    }
  };

  const processUrls = async () => {
    if (!urls.value.trim()) return;

    isProcessing.value = true;
    const urlList = urls.value.split("\n").filter((url) => url.trim());

    for (const url of urlList) {
      const download = {
        id: Date.now() + Math.random(),
        url: url.trim(),
        title: `Téléchargement ${downloads.value.length + 1}`,
        progress: 0,
        status: DOWNLOAD_STATUS.WAITING,
      };
      downloads.value.push(download);

      try {
        await startDownload(download);
      } catch (error) {
        console.error(`Erreur lors du téléchargement de ${url}:`, error);
      }
    }

    isProcessing.value = false;
    urls.value = "";
    showUrlInput.value = false;
  };

  const showImportDialog = () => {
    showUrlInput.value = true;
  };

  const cancelProcess = () => {
    isProcessing.value = false;
  };

  const removeDownload = (downloadId) => {
    const index = downloads.value.findIndex((d) => d.id === downloadId);
    if (index !== -1) {
      downloads.value.splice(index, 1);
    }
  };

  const clearCompleted = () => {
    downloads.value = downloads.value.filter(
      (d) => d.status !== DOWNLOAD_STATUS.COMPLETED
    );
  };

  const setDownloadPath = (path) => {
    downloadPath.value = path;
  };

  return {
    showUrlInput,
    urls,
    isProcessing,
    downloads,
    hasActiveDownloads,
    showImportDialog,
    processUrls,
    cancelProcess,
    removeDownload,
    clearCompleted,
    DOWNLOAD_STATUS,
    setDownloadPath,
  };
});
