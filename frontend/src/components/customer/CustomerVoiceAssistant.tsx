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
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceLanguage } from '@/utils/vendorVoiceNlu';
import { speakStandardText, stopStandardSpeaking, WEDORA_VOICE_CONFIG } from '@/utils/sharedVoiceConfig';
import {
  parsePlannerVoiceCommand,
  ParsedPlannerCommand,
} from '@/utils/plannerVoiceNlu';
import { WeddingEvent } from '@/types/event';

interface CustomerVoiceAssistantProps {
  activeEvent: WeddingEvent;
  onCommandParsed: (command: ParsedPlannerCommand) => void;
}

export const CustomerVoiceAssistant: React.FC<CustomerVoiceAssistantProps> = ({
  activeEvent,
  onCommandParsed,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [detectedLang, setDetectedLang] = useState<VoiceLanguage>('en');

  const initialGreeting = 'Hello! How can I help you find vendors for your event today?';

  const [lastResponse, setLastResponse] = useState<string>(initialGreeting);

  // Sync greeting when active event parameters change
  useEffect(() => {
    setLastResponse('Ready to help find vendors for your event.');
  }, [activeEvent.id, activeEvent.eventName, activeEvent.eventDate, activeEvent.area, activeEvent.city]);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang =
          detectedLang === 'mr' ? 'mr-IN' : detectedLang === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          stopSpeaking();
          setIsListening(true);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInputText(finalTranscript);
            handleExecute(finalTranscript);
          } else if (currentInterim) {
            setInputText(currentInterim);
          }
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

  const stopSpeaking = () => {
    stopStandardSpeaking();
    setIsSpeaking(false);
  };

  // Standardized Text-to-speech with calm 0.85x speed and Indian voice prioritization
  const speakText = (text: string, lang: VoiceLanguage) => {
    if (!speechEnabled || typeof window === 'undefined') return;

    speakStandardText(text, lang, {
      rate: WEDORA_VOICE_CONFIG.speakingRate, // 0.85x speed
      pitch: WEDORA_VOICE_CONFIG.pitch,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const toggleListening = () => {
    stopSpeaking();
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

    stopSpeaking();

    const parsed = parsePlannerVoiceCommand(text, {
      activeCity: activeEvent.city as any,
      activeArea: activeEvent.area,
      activeEventDate: activeEvent.eventDate,
      activeEventName: activeEvent.eventName,
      role: 'CUSTOMER',
    });

    setDetectedLang(parsed.detectedLang);
    setLastResponse(parsed.assistantSpeechResponse);
    speakText(parsed.assistantSpeechResponse, parsed.detectedLang);

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

  return (
    <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card to-gold-soft/20 p-5 sm:p-6 shadow-soft space-y-4 animate-rise min-w-0 max-w-full">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-gold/15 text-gold">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-plum text-base sm:text-lg flex items-center gap-2">
              Customer AI Assistant
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                Multilingual
              </span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Find the right vendors for your event.
            </p>
          </div>
        </div>

        {/* Auto Language Detection Badge & Audio Mute Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border text-xs font-medium text-navy">
            <Languages className="size-3.5 text-gold" />
            <span>Auto: {getLanguageLabel(detectedLang)}</span>
          </div>
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="p-2 rounded-full border bg-secondary/80 text-muted-foreground hover:text-navy transition"
            title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
          >
            {speechEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
        </div>
      </div>

      {/* Assistant Response Bubble */}
      <div className="rounded-2xl bg-gold-soft/40 border border-gold/30 p-4 transition-all min-h-[52px] flex items-center">
        <div className="flex items-start gap-3 w-full">
          <div className="size-2 rounded-full bg-gold mt-1.5 shrink-0 animate-pulse" />
          <div className="flex-1 space-y-1">
            <p className="text-xs sm:text-sm font-medium text-plum leading-relaxed">
              {lastResponse}
            </p>
            {isSpeaking && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gold font-semibold">
                <Volume2 className="size-3 animate-bounce" /> Speaking response...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp-style Input Bar */}
      <div className="flex items-center gap-2 bg-card rounded-2xl border border-gold/40 p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-gold/40">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            if (isSpeaking) stopSpeaking();
            setInputText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleExecute();
          }}
          placeholder="Speak or type: 'Top caterers in Baner', 'Photographers available on 15 Dec', etc."
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
        />

        {/* Microphone Button */}
        <Button
          type="button"
          size="sm"
          variant={isListening ? 'gold' : 'soft'}
          onClick={toggleListening}
          className={`rounded-xl px-3 transition ${
            isListening ? 'animate-pulse bg-gold text-plum font-semibold' : ''
          }`}
          title={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          <span className="hidden sm:inline text-xs ml-1.5">
            {isListening ? 'Listening...' : 'Voice'}
          </span>
        </Button>

        {/* Send Button */}
        <Button
          type="button"
          size="sm"
          variant="hero"
          onClick={() => handleExecute()}
          disabled={!inputText.trim()}
          className="rounded-xl px-3 text-xs"
        >
          <Send className="size-3.5" />
          <span className="hidden sm:inline ml-1.5">Ask</span>
        </Button>
      </div>
    </div>
  );
};

