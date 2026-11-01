import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceLanguage } from '@/utils/vendorVoiceNlu';
import {
  parsePlannerVoiceCommand,
  ParsedPlannerCommand,
} from '@/utils/plannerVoiceNlu';
import { WeddingEvent } from '@/types/event';

interface PlannerVoiceAssistantProps {
  activeEvent: WeddingEvent;
  onCommandParsed: (command: ParsedPlannerCommand) => void;
  onSwitchTab?: (tab: 'directory' | 'calendar') => void;
}

export const PlannerVoiceAssistant: React.FC<PlannerVoiceAssistantProps> = ({
  activeEvent,
  onCommandParsed,
  onSwitchTab,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [detectedLang, setDetectedLang] = useState<VoiceLanguage>('en');
  const [lastResponse, setLastResponse] = useState<string>(
    `Hello Aditi! I am your AI Vendor Planning Assistant for ${activeEvent.eventName} (${activeEvent.city}, ${activeEvent.eventDate} at ${activeEvent.venueName || activeEvent.area}). Ask me in English, Hindi, or Marathi to discover vendors, find alternatives, check slot availability, or review event forecast.`
  );

  // Sync assistant greeting when activeEvent changes
  useEffect(() => {
    setLastResponse(
      `Switched context to ${activeEvent.eventName} (${activeEvent.city}, ${activeEvent.eventDate} at ${activeEvent.venueName || activeEvent.area}). Ask me in English, Hindi, or Marathi to discover vendors, check availability, or swap alternatives.`
    );
  }, [activeEvent.id, activeEvent.eventName, activeEvent.eventDate, activeEvent.venueName, activeEvent.area, activeEvent.city]);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang =
          detectedLang === 'mr' ? 'mr-IN' : detectedLang === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleExecute(transcript);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [detectedLang]);

  // Text-to-speech speaker
  const speakText = (text: string, lang: VoiceLanguage) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition start failed:', err);
      }
    }
  };

  const handleExecute = (textToRun?: string) => {
    const text = (textToRun !== undefined ? textToRun : inputText).trim();
    if (!text) return;

    const parsed = parsePlannerVoiceCommand(text, {
      activeCity: activeEvent.city as any,
      activeArea: activeEvent.area,
      activeEventDate: activeEvent.eventDate,
      activeEventName: activeEvent.eventName,
    });

    setDetectedLang(parsed.detectedLang);
    setLastResponse(parsed.assistantSpeechResponse);
    speakText(parsed.assistantSpeechResponse, parsed.detectedLang);

    // If intent is calendar, switch sub-tab
    if (parsed.intent === 'VIEW_CALENDAR' && onSwitchTab) {
      onSwitchTab('calendar');
    } else if (onSwitchTab) {
      onSwitchTab('directory');
    }

    onCommandParsed(parsed);
    setInputText('');
  };

  const getLanguageLabel = (lang: VoiceLanguage) => {
    switch (lang) {
      case 'mr':
        return 'मराठी (Marathi)';
      case 'hi':
        return 'हिन्दी (Hindi)';
      default:
        return 'English';
    }
  };

  const promptChips = [
    {
      label: 'Vendors worked with in Baner, Pune',
      text: 'Can you show me the vendors we have previously worked with in Baner, Pune?',
    },
    {
      label: 'Find alternative photographers',
      text: 'Find alternative photographers in Pune',
    },
    {
      label: 'Check photographer availability (15 Dec 2026)',
      text: 'Is our photographer available on 15 December 2026 for the first half?',
    },
    {
      label: 'Event Performance Forecast',
      text: 'Show event performance forecast',
    },
    {
      label: 'बाणेर मधील पूर्वीचे वेंडर्स (Marathi)',
      text: 'पुण्यातील बाणेर मधील आम्ही काम केलेले वेंडर्स दाखवा',
    },
  ];

  return (
    <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold-soft/20 p-5 sm:p-6 shadow-soft space-y-4 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gold/15 text-gold">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-plum text-base sm:text-lg flex items-center gap-2">
              Planner AI Voice Assistant
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                Multilingual
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Context:{' '}
              <strong className="text-navy">{activeEvent.eventName}</strong> ({activeEvent.city}, {activeEvent.eventDate})
            </p>
          </div>
        </div>

        {/* Auto Language Detection Badge & Audio Mute Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 text-foreground text-xs font-semibold border border-border">
            <Languages className="size-3.5 text-gold" />
            <span className="text-muted-foreground text-[11px]">Auto Detect:</span>
            <span className="text-plum font-bold">{getLanguageLabel(detectedLang)}</span>
          </div>

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition"
            title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
          >
            {speechEnabled ? <Volume2 className="size-4 text-gold" /> : <VolumeX className="size-4" />}
          </button>
        </div>
      </div>

      {/* Spoken Response Banner */}
      <div className="rounded-2xl bg-muted/50 border border-border/80 p-3.5 text-xs text-foreground/90 flex items-start gap-3 min-h-[52px]">
        <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
        <div className="flex-1 space-y-1">
          <p className="leading-relaxed font-medium">{lastResponse}</p>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-muted-foreground mr-1">Quick Prompts:</span>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(chip.text);
              handleExecute(chip.text);
            }}
            className="px-3 py-1 rounded-full text-xs bg-card hover:bg-gold-soft border border-border hover:border-gold/50 text-navy font-medium transition cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* WhatsApp-Style Unified Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecute();
        }}
        className="flex items-center gap-2 pt-1"
      >
        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`size-11 rounded-full flex items-center justify-center transition shadow-xs shrink-0 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
              : 'bg-gold-soft hover:bg-gold/25 text-gold border border-gold/40'
          }`}
          title={isListening ? 'Listening... click to stop' : 'Click to speak'}
        >
          {isListening ? <Mic className="size-5" /> : <Mic className="size-5" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask in English, Hindi, or Marathi (e.g. 'Show vendors in Baner, Pune')..."
            className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:border-gold shadow-2xs pr-10"
          />
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          variant="hero"
          className="size-11 rounded-full p-0 flex items-center justify-center shrink-0"
          disabled={!inputText.trim()}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};

