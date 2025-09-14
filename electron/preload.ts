import { contextBridge, ipcRenderer } from 'electron';
import type { SaveConversationPayload, SystemInfo } from './types.d';

contextBridge.exposeInMainWorld('native', {
  getSystemInfo: async (): Promise<SystemInfo> => ipcRenderer.invoke('app:getSystemInfo'),
  saveConversation: async (payload: SaveConversationPayload) => ipcRenderer.invoke('app:saveConversation', payload),
  setTheme: (theme: 'system' | 'light' | 'dark') => ipcRenderer.invoke('app:setTheme', theme)
});

// Keychain via keytar proxied in main would go here if needed later.
