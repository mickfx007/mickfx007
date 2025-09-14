import { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import si from 'systeminformation';
import type { SaveConversationPayload, SystemInfo } from './types.d';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Mac JAMF Consultant',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      autoplayPolicy: 'user-gesture-required'
    }
  });

  if (isDev) {
    await mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'renderer', 'index.html'));
  }

  const template: Electron.MenuItemConstructorOptions[] = [
    { role: 'appMenu' },
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      label: 'Help',
      submenu: [
        {
          label: 'JAMF Nation',
          click: () => shell.openExternal('https://community.jamf.com')
        },
        {
          label: 'Apple Business Manager',
          click: () => shell.openExternal('https://support.apple.com/en-gb/guide/apple-business-manager/welcome/web')
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) void createWindow();
});

ipcMain.handle('app:getSystemInfo', async (): Promise<SystemInfo> => {
  const [cpu, mem, osInfo] = await Promise.all([
    si.cpu(),
    si.mem(),
    si.osInfo()
  ]);

  const swVers = await new Promise<string>((resolve) => {
    if (process.platform !== 'darwin') return resolve('');
    const { exec } = require('node:child_process');
    exec('sw_vers', (err: any, stdout: string) => {
      resolve(err ? '' : stdout);
    });
  });

  return {
    platform: os.platform(),
    arch: os.arch(),
    cpuModel: cpu.brand,
    cpuCores: cpu.physicalCores || cpu.cores,
    totalMemGb: Math.round((mem.total / (1024 ** 3)) * 10) / 10,
    osDistro: osInfo.distro,
    osRelease: osInfo.release,
    osBuild: osInfo.build,
    swVersRaw: swVers
  };
});

ipcMain.handle('app:saveConversation', async (_evt, payload: SaveConversationPayload) => {
  const fileTypes = [
    { name: 'Markdown', extensions: ['md'] },
    { name: 'JSON', extensions: ['json'] }
  ];
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Export Conversation',
    defaultPath: `conversation-${new Date().toISOString().replace(/[:.]/g, '-')}.md`,
    filters: fileTypes
  });
  if (canceled || !filePath) return { ok: false };

  let content = '';
  if (filePath.endsWith('.json')) {
    content = JSON.stringify(payload, null, 2);
  } else {
    content = `# Mac JAMF Consultant Conversation\n\n` +
      payload.messages.map(m => `**${m.role.toUpperCase()}**: ${m.content}`).join('\n\n') +
      (payload.kibanaQueries?.length ? `\n\n## Kibana Queries\n\n` + payload.kibanaQueries.map(q => `- ${q.title}\n\n\`\`\`\n${q.query}\n\`\`\``).join('\n\n') : '');
  }

  await fs.promises.writeFile(filePath, content, 'utf8');
  return { ok: true, filePath };
});

ipcMain.handle('app:setTheme', (_evt, theme: 'system' | 'light' | 'dark') => {
  if (theme === 'system') nativeTheme.themeSource = 'system';
  if (theme === 'light') nativeTheme.themeSource = 'light';
  if (theme === 'dark') nativeTheme.themeSource = 'dark';
});
