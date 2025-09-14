import { useEffect, useRef, useState } from 'react';

type Opts = { onFinalText: (text: string) => void };

export function useSpeech(opts: Opts) {
  const [interimText, setInterimText] = useState<string | undefined>('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const navAny = window as any;
    const SR = navAny.webkitSpeechRecognition || navAny.SpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          opts.onFinalText(transcript.trim());
          setInterimText('');
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };
    recognitionRef.current = rec;
  }, []);

  function startListening() { try { recognitionRef.current?.start(); } catch {} }
  function stopListening() { try { recognitionRef.current?.stop(); } catch {} }

  return { startListening, stopListening, interimText };
}
