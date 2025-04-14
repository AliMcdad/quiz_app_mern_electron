// electron/main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { spawn } = require("child_process");

let mainWindow;
let serverProcess;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "../frontend/public/vite.svg"),
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000" // Development server
      : `file://${path.join(__dirname, "../frontend/build/index.html")}` // Production build
  );

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window when closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startBackendServer() {
  // Path to server directory
  const serverPath = path.join(__dirname, "../backend");

  // Command to start the server
  const serverProcess = spawn("node", ["index.js"], {
    cwd: serverPath,
    env: { ...process.env, PORT: 3000 },
  });

  serverProcess.stdout.on("data", (data) => {
    console.log(`Server stdout: ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`Server stderr: ${data}`);
  });

  serverProcess.on("close", (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  return serverProcess;
}

// Initialize app
app.whenReady().then(() => {
  // Start the backend server
  serverProcess = startBackendServer();

  // Create the main window
  createWindow();

  // Re-create window on macOS when dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit app when all windows are closed, except on macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

// Clean up when app is about to quit
app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

// Custom IPC events can be added here if needed
ipcMain.on("app-quit", () => {
  app.quit();
});
