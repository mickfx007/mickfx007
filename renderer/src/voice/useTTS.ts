import { useEffect, useRef, useState } from 'react';

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  function speak(text: string) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utterRef.current = u;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      setSpeaking(true);
    } catch {}
  }
  function stopSpeaking() { try { window.speechSynthesis.cancel(); setSpeaking(false); } catch {} }
  useEffect(() => () => stopSpeaking(), []);
  return { speak, stopSpeaking, speaking };
}
