export type ChatMessage = { id: string; role: 'user' | 'assistant' | 'system'; content: string; ts: number };
export type KibanaQuery = { id: string; title: string; query: string; syntax: 'kql' | 'lucene'; timeRange?: string };

export type SaveConversationPayload = {
  messages: ChatMessage[];
  kibanaQueries?: KibanaQuery[];
};

export type SystemInfo = {
  platform: string;
  arch: string;
  cpuModel: string;
  cpuCores: number;
  totalMemGb: number;
  osDistro: string;
  osRelease: string;
  osBuild?: string;
  swVersRaw?: string;
};

declare global {
  interface Window {
    native: {
      getSystemInfo: () => Promise<SystemInfo>;
      saveConversation: (payload: SaveConversationPayload) => Promise<{ ok: boolean; filePath?: string }>;
      setTheme: (theme: 'system' | 'light' | 'dark') => void;
    };
  }
}
