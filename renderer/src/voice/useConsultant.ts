import type { ChatMessage, KibanaQuery } from '../types';
type SystemInfo = { osDistro: string; osRelease: string; cpuModel: string; totalMemGb: number };

const SYSTEM_PROMPT = `You are a senior macOS and JAMF Pro consultant with deep Kibana expertise.
Provide actionable steps first. Include Kibana queries and end with a diagnostic follow-up.
Avoid repeating previously suggested solutions in the same conversation.`;

export function useConsultant() {
  async function respondWithAI(args: { history: ChatMessage[]; newMessage: ChatMessage; systemInfo: SystemInfo }): Promise<{ answer: ChatMessage; memory: any }> {
    const apiKey = localStorage.getItem('openai_api_key') || '';
    const model = localStorage.getItem('openai_model') || 'gpt-4o-mini';
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + `\nSystem: ${args.systemInfo.osDistro} ${args.systemInfo.osRelease} (${args.systemInfo.cpuModel}, ${args.systemInfo.totalMemGb}GB)` },
      ...args.history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: args.newMessage.content }
    ];
    if (!apiKey) {
      const msg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: 'Set your OpenAI API key in Settings.', ts: Date.now() };
      return { answer: msg, memory: null };
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.2 })
    });
    if (!res.ok) {
      const errorText = await res.text();
      const fallback: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: `API error: ${errorText}`, ts: Date.now() };
      return { answer: fallback, memory: null };
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || 'No response';
    const answer: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content, ts: Date.now() };
    return { answer, memory: null };
  }

  function suggestKibanaQueries({ history }: { history: ChatMessage[] }): KibanaQuery[] {
    const last = history[history.length - 1];
    if (!last) return [];
    const topic = last.content.toLowerCase();
    const queries: KibanaQuery[] = [];
    if (topic.includes('jamf') || topic.includes('policy')) {
      queries.push({ id: crypto.randomUUID(), title: 'Jamf Pro policy failures (KQL)', syntax: 'kql', timeRange: 'Last 7 days', query: `index:jamf-logs AND event.type:policy AND outcome:failure | stats count() by host.name, policy.name` });
    }
    if (topic.includes('mdm') || topic.includes('enroll')) {
      queries.push({ id: crypto.randomUUID(), title: 'JAMF enrollment errors (KQL)', syntax: 'kql', timeRange: 'Last 24 hours', query: `index:jamf-logs AND (message:enroll OR message:MDM) AND (log.level:error OR status:failure)` });
    }
    queries.push({ id: crypto.randomUUID(), title: 'Security events (Lucene)', syntax: 'lucene', timeRange: 'Last 48 hours', query: `index:security-* AND os.platform:macos AND (action:blocked OR action:quarantine)` });
    return queries;
  }

  return { respondWithAI, suggestKibanaQueries };
}
