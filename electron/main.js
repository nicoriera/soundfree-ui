const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const YTDlpWrap = require("yt-dlp-wrap").default;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
  });

  // Détection robuste du mode développement
  const isDev =
    process.env.NODE_ENV === "development" ||
    process.argv.join(" ").includes("electron .") ||
    process.argv.join(" ").includes("vite");

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    // En production, charge les fichiers buildés
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers pour les téléchargements
ipcMain.handle("select-download-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle("download-track", async (event, { url, outputPath }) => {
  try {
    const ytDlpWrap = new YTDlpWrap();

    // Obtenir les informations du track d'abord
    const info = await ytDlpWrap.getVideoInfo(url);
    const title = info.title || "Unknown Track";
    const safeTitle = title.replace(/[^\w\s-]/g, "").trim();

    // Configuration pour télécharger en audio seulement
    const options = [
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--output",
      path.join(outputPath, `${safeTitle}.%(ext)s`),
      url,
    ];

    // Télécharger
    await ytDlpWrap.execPromise(options);

    return {
      success: true,
      title: safeTitle,
      path: path.join(outputPath, `${safeTitle}.mp3`),
    };
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("get-track-info", async (event, url) => {
  try {
    const ytDlpWrap = new YTDlpWrap();
    const info = await ytDlpWrap.getVideoInfo(url);

    return {
      title: info.title,
      duration: info.duration,
      thumbnail: info.thumbnail,
      uploader: info.uploader,
    };
  } catch (error) {
    console.error("Erreur info:", error);
    throw error;
  }
});
