const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'EcoTrack — Campus Sustainability Tracker',
    // Use build/icon.ico if it exists; otherwise Electron will use default
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    backgroundColor: '#f8fafc',
    show: false // don't show until ready-to-show so there's no flash
  });

  // Load the app
  if (isDev) {
    // In dev mode: load from the Vite dev server
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    // In production: load the built static files
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  // Show window once page is ready (no white flash)
  win.once('ready-to-show', () => {
    win.show();
  });

  // Open external links in the default system browser, not in the Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

// On macOS, re-create a window when dock icon is clicked and there are no open windows
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for apps to stay open
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
