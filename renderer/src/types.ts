export type ChatMessage = { id: string; role: 'user' | 'assistant' | 'system'; content: string; ts: number };
export type KibanaQuery = { id: string; title: string; query: string; syntax: 'kql' | 'lucene'; timeRange?: string };
