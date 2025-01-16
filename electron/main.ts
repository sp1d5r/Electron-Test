import { app, BrowserWindow } from 'electron'
import path from 'path'

// Simple dev mode check
const isDev = process.env.NODE_ENV === 'development'

async function waitForViteServer(url: string, maxRetries = 10): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url)
      if (res.status === 200) {
        return true
      }
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  return false
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (isDev) {
    // Wait for Vite dev server to be ready
    const serverUrl = 'http://localhost:5173'
    const isServerReady = await waitForViteServer(serverUrl)
    
    if (isServerReady) {
      win.loadURL(serverUrl)
      win.webContents.openDevTools()
    } else {
      console.error('Vite dev server not ready')
    }
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})