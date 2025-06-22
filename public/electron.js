const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// Basit development kontrolü
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  // Ana pencereyi oluştur
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      webviewTag: true
    },
    frame: false, // macOS pencere kontrollerini kaldır
    titleBarStyle: 'hidden', // Title bar'ı gizle
    show: false,
    backgroundColor: '#1f2937', // Dark background
    movable: true,
    resizable: true
  });

  // Uygulama hazır olduğunda pencereyi göster
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Geliştirme modunda localhost:3000'i yükle, production'da build/index.html'i yükle
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Pencere kapatıldığında referansı temizle
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron hazır olduğunda pencereyi oluştur
app.whenReady().then(() => {
  createWindow();

  // Geliştirici araçlarını açmak için kısayol
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.toggleDevTools();
    }
  });
});

// Uygulama kapanmadan önce kısayolları kaldır
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Tüm pencereler kapatıldığında uygulamayı kapat (macOS hariç)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS'ta dock'tan tıklandığında pencereyi yeniden oluştur
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Güvenlik: Yeni pencere oluşturulmasını engelle
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
}); 