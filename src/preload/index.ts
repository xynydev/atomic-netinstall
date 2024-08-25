import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'node:fs'

// Custom APIs for renderer
const api = {
  onRebaseStatusChange: (callback): Electron.IpcRenderer =>
    ipcRenderer.on('rebaseStatus', (_event, value) => callback(value)),
  onRebaseLogUpdate: (callback): Electron.IpcRenderer =>
    ipcRenderer.on('rebaseLog', (_event, value) => callback(value))
}

const config = JSON.parse(fs.readFileSync('./netinstall-config.json', 'utf8'))

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('config', config)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.config = config
}
