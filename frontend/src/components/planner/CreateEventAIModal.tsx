import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Languages,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceLanguage } from '@/utils/vendorVoiceNlu';
import {
  parsePlannerCreateEventCommand,
  ParsedCreateEventCommand,
} from '@/utils/plannerVoiceNlu';
import { WeddingEvent } from '@/types/event';
import { ALL_LOCALITIES } from '@/utils/localityRegistry';

interface CreateEventAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> & { id?: string }) => void;
}

export const CreateEventAIModal: React.FC<CreateEventAIModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [detectedLang, setDetectedLang] = useState<VoiceLanguage>('en');
  const [assistantMessage, setAssistantMessage] = useState<string>(
    'Speak or type your client event details in English, Hindi, or Marathi. E.g. "Create a wedding for Vikram and Ananya on 24th December 2026 at Grand Hyatt Mumbai in Bandra, 500 guests, budget 45 lakhs, phone 9820011223".'
  );

  // Editable Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('+91 98200 11223');
  const [clientEmail, setClientEmail] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Traditional Hindu Wedding & Reception');
  const [eventDate, setEventDate] = useState('');
  const [city, setCity] = useState<'Pune' | 'Mumbai'>('Pune');
  const [area, setArea] = useState('Baner');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [guestCount, setGuestCount] = useState<number>(500);
  const [estimatedBudget, setEstimatedBudget] = useState<number>(3500000);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);

  // Speech Recognition setup
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

  // Text to speech
  const speakText = (text: string, lang: VoiceLanguage) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
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

    const parsed: ParsedCreateEventCommand = parsePlannerCreateEventCommand(text);

    setDetectedLang(parsed.detectedLang);
    setAssistantMessage(parsed.assistantSpeechResponse);
    speakText(parsed.assistantSpeechResponse, parsed.detectedLang);

    // Apply extracted details to editable form without overwriting with empty
    if (parsed.clientName) setClientName(parsed.clientName);
    if (parsed.clientPhone) setClientPhone(parsed.clientPhone);
    if (parsed.clientEmail) setClientEmail(parsed.clientEmail);
    if (parsed.eventName) setEventName(parsed.eventName);
    if (parsed.eventType) setEventType(parsed.eventType);
    if (parsed.eventDate) setEventDate(parsed.eventDate);
    if (parsed.city) setCity(parsed.city);
    if (parsed.area) setArea(parsed.area);
    if (parsed.venueName) setVenueName(parsed.venueName);
    if (parsed.venueAddress) setVenueAddress(parsed.venueAddress);
    if (parsed.guestCount) setGuestCount(parsed.guestCount);
    if (parsed.estimatedBudget) setEstimatedBudget(parsed.estimatedBudget);

    setMissingFields(parsed.missingFields);
    setInputText('');
  };

  const isFormValid =
    Boolean(clientName.trim()) &&
    Boolean(eventDate.trim()) &&
    Boolean(venueName.trim()) &&
    Boolean(area.trim()) &&
    Boolean(city);

  const handleConfirmCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Please fill in all mandatory fields: Client Name, Event Date, Venue Name, City, and Locality.');
      return;
    }

    const newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> = {
      eventName: eventName.trim() || `${clientName.trim()}'s Wedding Celebration`,
      eventType,
      eventDate,
      city,
      area,
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim() || `${venueName.trim()}, ${area}, ${city}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim() || undefined,
      guestCount,
      estimatedBudget,
      ownerRole: 'PLANNER',
      ownerName: 'Aditi Sharma (Lead Planner)',
      description: `Registered wedding celebration for ${clientName} at ${venueName}, ${area}, ${city}.`,
    };

    onEventCreated(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: 'Mumbai Wedding (Full)',
      text: 'Create a wedding for Vikram and Ananya on 24th December 2026 at Grand Hyatt Mumbai in Bandra, 500 guests, budget 45 lakhs, phone 9820011223',
    },
    {
      label: 'पुणे बाणेर विवाह (Marathi)',
      text: 'पुण्यात बाणेर येथे 18 डिसेंबर 2026 ला अमर बॅनक्वेट्स मध्ये राहुल आणि स्नेहाचा विवाह, 400 पाहुणे, फोन 9822011223',
    },
    {
      label: 'मुंबई शादी (Hindi)',
      text: 'मुंबई में कांदिवली में 20 जनवरी 2027 को राज और सिमरन की शादी, वेन्यू ऑर्किड हॉल, 600 मेहमान',
    },
    {
      label: 'Incomplete (Missing Date/Venue)',
      text: 'Create wedding event for Rohit and Priya in Baner Pune',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-card border border-gold/40 shadow-float p-5 sm:p-7 relative my-8 space-y-5 animate-rise max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-gold/15 text-gold">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-plum text-lg sm:text-xl flex items-center gap-2">
                Create Client Event with AI
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                  Voice & NLU
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Speaks English, Hindi, and Marathi. Strictly enforces mandatory date & venue details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition"
              title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
            >
              {speechEnabled ? <Volume2 className="size-4 text-gold" /> : <VolumeX className="size-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* AI Voice & Text Unified Bar */}
        <div className="space-y-3 bg-gold-soft/30 p-4 rounded-2xl border border-gold/30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-navy flex items-center gap-1.5">
              <Languages className="size-3.5 text-gold" />
              Language: <strong className="text-plum capitalize">{detectedLang === 'mr' ? 'Marathi' : detectedLang === 'hi' ? 'Hindi' : 'English'}</strong>
            </span>
            <span className="text-[11px] text-muted-foreground">Natural voice speech or type below</span>
          </div>

          {/* Spoken Feedback Banner */}
          <div className="rounded-xl bg-card border border-border p-3 text-xs flex items-start gap-2.5 min-h-[44px]">
            <div className="size-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <p className="leading-relaxed font-medium text-navy">{assistantMessage}</p>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Demo Prompts:</span>
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(chip.text);
                  handleExecute(chip.text);
                }}
                className="px-2.5 py-0.5 rounded-full text-[11px] bg-card hover:bg-gold-soft border border-border hover:border-gold/50 text-navy font-medium transition cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecute();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`size-10 rounded-full flex items-center justify-center transition shadow-xs shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-gold-soft hover:bg-gold/25 text-gold border border-gold/40'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak'}
            >
              <Mic className="size-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. 'Create wedding for Vikram and Ananya on 24th December 2026 at Grand Hyatt Mumbai in Bandra'..."
              className="w-full rounded-full border border-border bg-card px-4 py-2 text-xs text-foreground focus:outline-none focus:border-gold shadow-2xs"
            />

            <Button
              type="submit"
              variant="hero"
              className="size-10 rounded-full p-0 flex items-center justify-center shrink-0"
              disabled={!inputText.trim()}
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>

        {/* Editable Registration Form */}
        <form onSubmit={handleConfirmCreate} className="space-y-4 text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-border">
            <h4 className="font-display font-semibold text-sm text-plum">
              Event Details & Venue Verification
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Fields marked <span className="text-rose-500 font-bold">*</span> are mandatory
            </span>
          </div>

          {missingFields.length > 0 && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
              <AlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>
                Missing mandatory details: <strong>{missingFields.join(', ')}</strong>. Please speak or enter them manually.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Client / Couple Name */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Client / Couple Names <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (!eventName || eventName.includes('Wedding Celebration')) {
                    setEventName(`${e.target.value}'s Wedding Celebration`);
                  }
                }}
                placeholder="e.g. Vikram Malhotra & Ananya Sen"
                className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
              />
            </div>

            {/* Client Contact Phone */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Client Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Event Name */}
            <div>
              <label className="block font-semibold text-navy mb-1">Event Title</label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Vikram & Ananya Royal Wedding"
                className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
              />
            </div>

            {/* Event Type */}
            <div>
              <label className="block font-semibold text-navy mb-1">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
              >
                <option value="Traditional Hindu Wedding & Reception">Traditional Hindu Wedding & Reception</option>
                <option value="Grand Sangeet & Royal Wedding">Grand Sangeet & Royal Wedding</option>
                <option value="Hillside Destination Wedding">Hillside Destination Wedding</option>
                <option value="Contemporary Reception & Cocktail">Contemporary Reception & Cocktail</option>
              </select>
            </div>

            {/* Event Date (Mandatory) */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* City (Mandatory) */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const newCity = e.target.value as 'Pune' | 'Mumbai';
                  setCity(newCity);
                  // Default to first locality of new city
                  const defaultLoc = ALL_LOCALITIES.find((l) => l.city === newCity);
                  if (defaultLoc) setArea(defaultLoc.canonicalName);
                }}
                className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            {/* Locality (Mandatory) */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Locality / Area <span className="text-rose-500">*</span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
              >
                {ALL_LOCALITIES.filter((l) => l.city === city).map((l) => (
                  <option key={l.canonicalName} value={l.canonicalName}>
                    {l.canonicalName} ({l.devanagari})
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Name (Mandatory) */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Venue Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Grand Hyatt Ballroom"
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Complete Venue Address (Mandatory) */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-navy mb-1">
                Complete Venue Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="e.g. Survey No. 45/2, Pancard Club Road, Baner, Pune 411045"
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Guest Count <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="number"
                  required
                  min={50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 500)}
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block font-semibold text-navy mb-1">
                Estimated Budget (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="number"
                  required
                  step={50000}
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(parseInt(e.target.value, 10) || 2500000)}
                  className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-[11px] text-muted-foreground">
              {isFormValid ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> All required fields validated
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> Fill mandatory fields to enable creation
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                disabled={!isFormValid}
                className="gap-1.5 font-semibold"
              >
                <Sparkles className="size-4" /> Confirm & Create Event
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

