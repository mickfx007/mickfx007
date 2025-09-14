import React from 'react';

export function TopBar({ listening, processing, onMicToggle, onExport, theme, onTheme }: {
  listening: boolean;
  processing: boolean;
  onMicToggle: () => void;
  onExport: () => void;
  theme: 'system' | 'light' | 'dark';
  onTheme: (t: 'system' | 'light' | 'dark') => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderBottom: '1px solid #e5e7eb' }}>
      <strong>Mac JAMF Consultant</strong>
      <span style={{ marginLeft: 8, color: '#6b7280' }}>{processing ? 'Processing…' : listening ? 'Listening…' : 'Idle'}</span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <select value={theme} onChange={(e) => onTheme(e.target.value as any)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <button onClick={onMicToggle}>{listening ? 'Stop' : 'Start'} Listening</button>
        <button onClick={onExport}>Export</button>
      </div>
    </div>
  );
}
