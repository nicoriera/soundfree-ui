const { contextBridge, ipcRenderer } = require("electron");

// Expose les APIs Electron au renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Sélectionner le dossier de téléchargement
  selectDownloadFolder: () => ipcRenderer.invoke("select-download-folder"),

  // Télécharger un track
  downloadTrack: (url, outputPath) =>
    ipcRenderer.invoke("download-track", { url, outputPath }),

  // Obtenir les informations d'un track
  getTrackInfo: (url) => ipcRenderer.invoke("get-track-info", url),

  // Utilitaires
  isElectron: true,
  platform: process.platform,
});
