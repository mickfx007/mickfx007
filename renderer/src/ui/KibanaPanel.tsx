import React from 'react';
import type { KibanaQuery } from '../types';

export function KibanaPanel({ queries }: { queries: KibanaQuery[] }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong>Kibana Queries</strong>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {queries.length === 0 ? <div style={{ color: '#6b7280' }}>No suggestions yet.</div> : null}
        {queries.map(q => (
          <div key={q.id} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{q.title}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{q.syntax.toUpperCase()} {q.timeRange ? `• ${q.timeRange}` : ''}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(q.query)}>Copy</button>
            </div>
            <pre style={{ background: '#f8fafc', padding: 8, borderRadius: 4, whiteSpace: 'pre-wrap' }}><code>{q.query}</code></pre>
          </div>
        ))}
      </div>
    </div>
  );
}
