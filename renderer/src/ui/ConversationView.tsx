import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

export function ConversationView({ messages, interimText }: { messages: ChatMessage[]; interimText?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }); }, [messages, interimText]);
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div ref={scroller} style={{ overflowY: 'auto', flex: 1, paddingRight: 8 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{m.role.toUpperCase()}</div>
            <div>{m.content}</div>
          </div>
        ))}
        {interimText ? <div style={{ opacity: 0.6, fontStyle: 'italic' }}>{interimText}</div> : null}
      </div>
    </div>
  );
}
