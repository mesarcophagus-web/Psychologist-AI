import { CharacterId, Language } from '../types';

const API_BASE = 'https://psychologistai.mi-emaehf.workers.dev';

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  ru: 'Russian (Русский)',
};

const CHARACTER_CONFIGS: Record<CharacterId, { personality: string; mode: string }> = {
  stoic: {
    personality: "You are a stoic philosopher therapist — calm, wise, grounded.",
    mode: 'philosophical',
  },
  mom: {
    personality: "You are a warm, caring maternal therapist. Listen deeply, validate feelings.",
    mode: 'nurturing',
  },
  coach: {
    personality: "You are an energetic life coach therapist. Direct, action-oriented, motivational.",
    mode: 'coaching',
  },
};

export async function sendMessage(params: {
  character: CharacterId;
  message: string;
  sessionId: string;
  language: Language;
  context?: string;
}): Promise<string> {
  const { character, message, sessionId, language, context = '' } = params;
  const { personality, mode } = CHARACTER_CONFIGS[character];

  const langInstruction =
    language !== 'en'
      ? `\n\nCRITICAL: You MUST respond ONLY in ${LANGUAGE_NAMES[language]}. Never use any other language.`
      : '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character,
        message,
        mode,
        context,
        personality: personality + langInstruction,
        sessionId,
        language,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.response ?? data.message ?? 'No response received.';
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') throw new Error('Request timed out.');
    throw error;
  }
}
