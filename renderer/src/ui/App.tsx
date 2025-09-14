import React, { useEffect, useState } from 'react';
import { ConversationView } from './ConversationView';
import { KibanaPanel } from './KibanaPanel';
import { TopBar } from './TopBar';
import { useSpeech } from '../voice/useSpeech';
import { useTTS } from '../voice/useTTS';
import { useConsultant } from '../voice/useConsultant';
import type { ChatMessage, KibanaQuery } from '../types';

export function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [kibanaQueries, setKibanaQueries] = useState<KibanaQuery[]>([]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');

  const { startListening, stopListening, interimText } = useSpeech({
    onFinalText: (text) => {
      const msg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: text, ts: Date.now() };
      setMessages((prev) => [...prev, msg]);
      void respond(msg);
    }
  });
  const { speak, stopSpeaking } = useTTS();
  const { respondWithAI, suggestKibanaQueries } = useConsultant();

  useEffect(() => { window.native.setTheme(theme); }, [theme]);

  async function respond(userMessage: ChatMessage) {
    setProcessing(true);
    const systemInfo = await window.native.getSystemInfo();
    const { answer } = await respondWithAI({ history: messages, newMessage: userMessage, systemInfo });
    setMessages((prev) => [...prev, answer]);
    const queries = suggestKibanaQueries({ history: [...messages, userMessage, answer] });
    setKibanaQueries(queries);
    setProcessing(false);
    if (speak && answer.content) speak(answer.content);
  }

  function handleExport() { void window.native.saveConversation({ messages, kibanaQueries }); }

  function toggleListening() {
    if (listening) { stopListening(); setListening(false); }
    else { stopSpeaking(); startListening(); setListening(true); }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'ui-sans-serif, system-ui, -apple-system' }}>
      <TopBar onExport={handleExport} listening={listening} processing={processing} theme={theme} onTheme={setTheme} onMicToggle={toggleListening} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16, padding: 16, flex: 1, overflow: 'hidden' }}>
        <ConversationView messages={messages} interimText={interimText} />
        <KibanaPanel queries={kibanaQueries} />
      </div>
    </div>
  );
}
