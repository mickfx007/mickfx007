# Mac JAMF Consultant (Electron + React)

Voice-based macOS and JAMF troubleshooting assistant with Kibana query suggestions.

## Features
- Continuous speech recognition (Web Speech API) and TTS
- OpenAI responses with senior macOS/JAMF consultant system prompt
- Conversation memory and export (Markdown/JSON)
- Kibana query suggestions with copy-to-clipboard
- System context (CPU, memory, OS) for better answers

## Requirements
- macOS 12+
- Node.js 18+
- OpenAI API key

## Setup
```bash
npm install
npm run dev
```
The app window opens; enter your API key in Settings.

## Build
```bash
npm run dist
```

## Privacy
- Mic access only when listening is enabled.
- API key stored locally (for production, prefer Keychain via main process + keytar).

## Notes
- Web Speech is used for simplicity; for production-grade continuous ASR, integrate native macOS Speech or OpenAI Realtime API.
