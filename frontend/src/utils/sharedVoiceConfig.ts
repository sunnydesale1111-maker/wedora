/**
 * Shared Voice Assistant Configuration for Wedora
 *
 * Standardizes Text-to-Speech (TTS) and Speech Recognition (STT) across:
 * 1. Individual Customer Dashboard (CustomerVoiceAssistant in Plan an Event -> Event Directory)
 * 2. Professional Event Organizer Dashboard (PlannerVoiceAssistant)
 * 3. Vendor Dashboard (VendorVoiceAssistant)
 * 4. AI Event Creation Modal (CreateEventAIModal)
 *
 * Ensures identical:
 * - Natural, calm speaking rate (0.85x) for comfortable comprehension
 * - Consistent natural pitch (1.0) and full volume (1.0)
 * - Preferred Indian English (en-IN), Hindi (hi-IN), and Marathi (mr-IN) voice hierarchy
 * - Immediate interruption handling (cancels speech on mic start)
 * - Zero audio stutter or distortion
 */

export type SharedVoiceLanguage = 'en' | 'hi' | 'mr';

export interface SpeakTextOptions {
  rate?: number; // Standardized to 0.85x
  pitch?: number; // Standardized to 1.0
  volume?: number; // Standardized to 1.0
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Global Wedora Voice Configuration
 * Enforces unified voice identity, speed (0.85x), pitch (1.0), and volume (1.0) across all dashboards.
 */
export const WEDORA_VOICE_CONFIG = {
  provider: 'Web Speech API (SpeechSynthesis)',
  speakingRate: 0.85, // 0.85x speaking speed: calm, natural, and clear for Indian multilingual dialogues
  pitch: 1.0,         // Natural, comfortable pitch
  volume: 1.0,        // Full clarity volume
  interruptionPolicy: 'IMMEDIATE_CANCEL_ON_NEW_INPUT',
  locales: {
    en: {
      bcp47: 'en-IN',
      languageLabel: 'English (India)',
      targetSpeed: 0.85,
      preferredVoiceNames: [
        'Microsoft Neerja Online (Natural) - English (India)',
        'Microsoft Heera - English (India)',
        'Microsoft Ravi - English (India)',
        'Google English (India)',
        'Veena',
        'Rishi',
      ],
      description: 'Indian English (Natural, calm, conversational)',
    },
    hi: {
      bcp47: 'hi-IN',
      languageLabel: 'हिन्दी (Hindi)',
      targetSpeed: 0.85,
      preferredVoiceNames: [
        'Microsoft Swara Online (Natural) - Hindi (India)',
        'Microsoft Kalpana - Hindi (India)',
        'Microsoft Hemant - Hindi (India)',
        'Google हिन्दी',
        'Lekha',
      ],
      description: 'Hindi (Clear Devanagari cadence)',
    },
    mr: {
      bcp47: 'mr-IN',
      languageLabel: 'मराठी (Marathi)',
      targetSpeed: 0.85,
      preferredVoiceNames: [
        'Microsoft Aarohi Online (Natural) - Marathi (India)',
        'Microsoft Manohar Online (Natural) - Marathi (India)',
        // Closest compatible high-quality Indian Devanagari fallback:
        'Microsoft Swara Online (Natural) - Hindi (India)',
        'Microsoft Kalpana - Hindi (India)',
        'Google हिन्दी',
      ],
      description: 'Marathi (Natural phrasing & Devanagari phonemes)',
    },
  },
} as const;

export const WEDORA_STANDARD_SPEAKING_RATE = WEDORA_VOICE_CONFIG.speakingRate; // 0.85
export const WEDORA_STANDARD_PITCH = WEDORA_VOICE_CONFIG.pitch; // 1.0
export const WEDORA_STANDARD_VOLUME = WEDORA_VOICE_CONFIG.volume; // 1.0

/**
 * Returns the configured speaking speed (0.85x)
 */
export function getStandardSpeakingSpeed(): number {
  return WEDORA_VOICE_CONFIG.speakingRate;
}

/**
 * Standard voice lookup prioritizing natural Indian English, Hindi, and Marathi voices.
 * Ensures consistent voice character, cadence, speed (0.85x), and clarity across all dashboards.
 */
export function getStandardVoice(
  voices: SpeechSynthesisVoice[],
  lang: SharedVoiceLanguage
): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  const config = WEDORA_VOICE_CONFIG.locales[lang] || WEDORA_VOICE_CONFIG.locales.en;

  // 1. Try exact or substring matches from preferred voice list in prioritized order
  for (const preferred of config.preferredVoiceNames) {
    const match = voices.find(
      (v) =>
        v.name.toLowerCase() === preferred.toLowerCase() ||
        v.name.toLowerCase().includes(preferred.toLowerCase()) ||
        preferred.toLowerCase().includes(v.name.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Try language BCP-47 match
  const bcpMatch = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang === config.bcp47.toLowerCase();
  });
  if (bcpMatch) return bcpMatch;

  // 3. Fallback for Marathi to high-quality Indian Devanagari voice if no native Marathi voice is installed on host
  if (lang === 'mr') {
    const hiFallback = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        (v.lang.toLowerCase().includes('in') &&
          (v.name.includes('Kalpana') || v.name.includes('Swara') || v.name.includes('Hemant')))
    );
    if (hiFallback) return hiFallback;
  }

  // 4. Fallback to any voice with matching language prefix
  const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
  if (prefixMatch) return prefixMatch;

  // 5. English India fallback
  const inVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india')
  );
  if (inVoice) return inVoice;

  // 6. Generic English or first available voice
  return voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0];
}

/**
 * Standardized speak function used by all assistants across Wedora.
 * Defaults to 0.85x speed, 1.0 pitch, and 1.0 volume.
 */
export function speakStandardText(
  text: string,
  lang: SharedVoiceLanguage,
  options: SpeakTextOptions = {}
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Standardized rate (0.85x), pitch (1.0), and volume (1.0) across all 3 dashboards
    utterance.rate = options.rate ?? WEDORA_VOICE_CONFIG.speakingRate;
    utterance.pitch = options.pitch ?? WEDORA_VOICE_CONFIG.pitch;
    utterance.volume = options.volume ?? WEDORA_VOICE_CONFIG.volume;

    const bcp47 = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = bcp47;

    const voices = window.speechSynthesis.getVoices();
    const voice = getStandardVoice(voices, lang);
    if (voice) {
      utterance.voice = voice;
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (options.onError) options.onError();
  }
}

/**
 * Immediately cancels any ongoing speech output
 */
export function stopStandardSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
