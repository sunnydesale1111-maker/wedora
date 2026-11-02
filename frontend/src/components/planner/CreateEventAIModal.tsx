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
  ArrowRight,
  Edit3,
  Check,
  FileText,
  Clock,
  Home,
  Flame,
  PartyPopper,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceLanguage } from '@/utils/vendorVoiceNlu';
import {
  speakStandardText,
  stopStandardSpeaking,
  WEDORA_VOICE_CONFIG,
} from '@/utils/sharedVoiceConfig';
import {
  EventCreationDraft,
  EventCreationStage,
  EventCategory,
  createInitialDraft,
  processEventCreationTurn,
  OPENING_AI_MESSAGE,
  REVIEW_READY_MESSAGE,
} from '@/utils/aiEventCreationEngine';
import { ALL_LOCALITIES, resolveLocality } from '@/utils/localityRegistry';
import { WeddingEvent } from '@/types/event';
import { OrganizerClientProfile } from '@/types/profile';
import {
  saveEventToSupabase,
  saveOrganizerClientToSupabase,
} from '@/lib/supabaseData';

interface CreateEventAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> & { id?: string }) => void;
  initialMode?: 'ai' | 'manual';
  organizerUserId?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  lang?: VoiceLanguage;
}

export const CreateEventAIModal: React.FC<CreateEventAIModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
  initialMode = 'ai',
  organizerUserId = 'planner-aditi',
}) => {
  // Mode selection: Option A (AI) vs Option B (Manual)
  const [creationMode, setCreationMode] = useState<'ai' | 'manual'>(initialMode);

  // AI Conversational State
  const [draft, setDraft] = useState<EventCreationDraft>(createInitialDraft());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [activeLang, setActiveLang] = useState<VoiceLanguage>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmedEventId, setConfirmedEventId] = useState<string | null>(null);

  // Manual Form State (Option B)
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('+91 98200 11223');
  const [manualClientEmail, setManualClientEmail] = useState('');
  const [manualEventName, setManualEventName] = useState('');
  const [manualEventType, setManualEventType] = useState('Traditional Wedding Celebration');
  const [manualEventDate, setManualEventDate] = useState('');
  const [manualCity, setManualCity] = useState<'Pune' | 'Mumbai'>('Pune');
  const [manualArea, setManualArea] = useState('Baner');
  const [manualVenueStatus, setManualVenueStatus] = useState<'FINALIZED' | 'NOT_FINALIZED'>('NOT_FINALIZED');
  const [manualVenueName, setManualVenueName] = useState('');
  const [manualVenueAddress, setManualVenueAddress] = useState('');
  const [manualGuestCount, setManualGuestCount] = useState<number>(500);
  const [manualBudget, setManualBudget] = useState<number>(2500000);
  const [manualDescription, setManualDescription] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasGreetedRef = useRef(false);

  // Standardized text-to-speech
  const speakText = (text: string, lang: VoiceLanguage = activeLang) => {
    if (!speechEnabled || typeof window === 'undefined') return;
    speakStandardText(text, lang, {
      rate: WEDORA_VOICE_CONFIG.speakingRate,
      pitch: WEDORA_VOICE_CONFIG.pitch,
    });
  };

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setHasConfirmed(false);
      setIsSubmitting(false);
      setConfirmedEventId(null);
      setCreationMode(initialMode);

      if (!hasGreetedRef.current) {
        hasGreetedRef.current = true;
        const initialDraft = createInitialDraft();
        setDraft(initialDraft);
        setMessages([
          {
            id: 'msg-greeting',
            sender: 'ai',
            text: OPENING_AI_MESSAGE,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lang: 'en',
          },
        ]);
        // Greet spoken using shared 0.85x voice config
        speakText(OPENING_AI_MESSAGE, 'en');
      }
    } else {
      hasGreetedRef.current = false;
      stopStandardSpeaking();
    }
  }, [isOpen, initialMode]);

  // Scroll messages to bottom
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
          activeLang === 'mr' ? 'mr-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserSend(transcript);
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
  }, [activeLang]);

  const toggleListening = () => {
    stopStandardSpeaking();
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

  // Handle User Input Submission in AI Mode
  const handleUserSend = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text) return;

    // Append user message
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');

    // Process through intelligent engine
    const { updatedDraft, aiSpeechResponse, detectedLang } = processEventCreationTurn(
      text,
      draft,
      activeLang
    );

    setDraft(updatedDraft);
    setActiveLang(detectedLang);

    // Append AI reply
    const aiMsg: ChatMessage = {
      id: `ai-${Date.now() + 1}`,
      sender: 'ai',
      text: aiSpeechResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lang: detectedLang,
    };
    setMessages([...nextMessages, aiMsg]);

    // Speak AI reply
    speakText(aiSpeechResponse, detectedLang);
  };

  // Confirm & Create Event in Supabase (with strict idempotency)
  const handleConfirmAICreation = async () => {
    if (isSubmitting || hasConfirmed) return; // Strict duplicate prevention
    setIsSubmitting(true);

    const eventId = `evt-${Date.now()}`;
    const primaryClientName = draft.clientName || draft.mandalOrClientName || 'Client';

    const newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> & { id: string } = {
      id: eventId,
      eventName: draft.eventName || `${primaryClientName}'s ${draft.eventType}`,
      eventType: draft.eventType || 'Special Event',
      eventDate: draft.eventDate || draft.installationDate || new Date().toISOString().split('T')[0],
      city: draft.city,
      area: draft.area || 'Baner',
      venueName: draft.venueName || (draft.venueStatus === 'FINALIZED' ? 'Selected Venue' : 'Pending Selection'),
      venueAddress: draft.venueAddress || draft.propertyAddress || `${draft.area || 'Baner'}, ${draft.city}`,
      venueStatus: draft.venueStatus === 'FINALIZED' ? 'FINALIZED' : 'NOT_FINALIZED',
      clientName: primaryClientName,
      clientPhone: draft.clientPhone || '+91 98200 11223',
      clientEmail: draft.clientEmail,
      guestCount: draft.guestCount || 500,
      estimatedBudget: draft.estimatedBudget || 2500000,
      ownerRole: 'PLANNER',
      ownerName: 'Aditi Sharma (Lead Planner)',
      description: `${draft.eventType} organized for ${primaryClientName} in ${draft.area}, ${draft.city}.`,
      requirements: [
        ...(draft.weddingFunctions || []),
        draft.cateringRequired ? 'Catering' : '',
        draft.decorationRequired || draft.mandapDecorRequired ? 'Decoration / Mandap' : '',
        draft.photographyRequired ? 'Photography' : '',
        draft.soundLightingRequired ? 'Sound & Lighting' : '',
        draft.pujaArrangements ? 'Priest / Puja' : '',
      ].filter(Boolean),
    };

    // 1. Persist to Supabase events table
    await saveEventToSupabase(
      {
        ...newEvent,
        title: newEvent.eventName,
        targetDate: newEvent.eventDate,
      },
      organizerUserId
    ).catch((err) => console.warn('Supabase event persistence notice:', err));

    // 2. Link or create organizer client profile
    if (draft.clientName || draft.clientPhone) {
      const clientProfile: OrganizerClientProfile = {
        id: `client-${Date.now()}`,
        organizerUserId,
        clientName: primaryClientName,
        clientEmail: draft.clientEmail || `${primaryClientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.wedora.in`,
        clientPhone: draft.clientPhone || '+91 98200 11223',
        status: 'ACTIVE',
        eventIds: [eventId],
        notes: `AI-Created Event: ${newEvent.eventName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveOrganizerClientToSupabase(clientProfile, organizerUserId).catch((err) =>
        console.warn('Supabase client profile save notice:', err)
      );
    }

    // 3. Update session
    onEventCreated(newEvent);

    setConfirmedEventId(eventId);
    setHasConfirmed(true);
    setIsSubmitting(false);
  };

  // Manual Form Submission (Option B)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName.trim() || !manualEventDate.trim() || !manualArea.trim()) {
      alert('Please fill in mandatory fields: Client Name, Event Date, and Area.');
      return;
    }
    if (isSubmitting || hasConfirmed) return;
    setIsSubmitting(true);

    const eventId = `evt-${Date.now()}`;
    const newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> & { id: string } = {
      id: eventId,
      eventName: manualEventName.trim() || `${manualClientName.trim()}'s ${manualEventType}`,
      eventType: manualEventType,
      eventDate: manualEventDate,
      city: manualCity,
      area: manualArea,
      venueName: manualVenueName.trim() || (manualVenueStatus === 'FINALIZED' ? 'Selected Venue' : 'Pending Selection'),
      venueAddress: manualVenueAddress.trim() || `${manualVenueName.trim()}, ${manualArea}, ${manualCity}`,
      venueStatus: manualVenueStatus,
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      clientEmail: manualClientEmail.trim() || undefined,
      guestCount: manualGuestCount,
      estimatedBudget: manualBudget,
      ownerRole: 'PLANNER',
      ownerName: 'Aditi Sharma (Lead Planner)',
      description: manualDescription.trim() || `${manualEventType} for ${manualClientName} in ${manualArea}, ${manualCity}.`,
    };

    // Save to Supabase
    await saveEventToSupabase(
      {
        ...newEvent,
        title: newEvent.eventName,
        targetDate: newEvent.eventDate,
      },
      organizerUserId
    ).catch((err) => console.warn('Supabase manual event save notice:', err));

    onEventCreated(newEvent);
    setConfirmedEventId(eventId);
    setHasConfirmed(true);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const quickPrompts = [
    {
      label: 'Wedding (Multi-detail)',
      text: 'Planning a wedding for Rohan and Priya on 18 December in Baner Pune, budget 15 lakhs',
    },
    {
      label: 'Griha Pravesh (Housewarming)',
      text: 'I am planning a Griha Pravesh for Deshmukh family in Viman Nagar on 22 January',
    },
    {
      label: 'Baby Shower (Dohale Jevan)',
      text: 'Organizing a baby shower for Neha on 5 February at Baner, 80 guests',
    },
    {
      label: 'Ganpati Festival',
      text: 'Ganpati celebration for Balaji Mandal in Kothrud, 5-day festival from 10 September',
    },
  ];

  const stageLabels: Record<EventCreationStage, string> = {
    event_details: '1. Event Details',
    client_details: '2. Client Details',
    date_and_venue: '3. Date & Venue',
    guests_and_budget: '4. Guests & Budget',
    requirements: '5. Requirements',
    review_and_create: '6. Review & Create',
  };

  return (
    <div
      data-testid="create-event-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-3xl rounded-3xl bg-card border border-gold/40 shadow-float p-5 sm:p-7 relative my-8 space-y-5 animate-rise max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gold/15 text-gold">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-plum text-lg sm:text-xl flex items-center gap-2">
                Create Client Event
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                  Organizer Suite
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Set up a new client celebration with conversational AI or standard manual entry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {creationMode === 'ai' && (
              <button
                type="button"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition cursor-pointer"
                title={speechEnabled ? 'Mute AI voice output' : 'Enable AI voice output'}
              >
                {speechEnabled ? <Volume2 className="size-4 text-gold" /> : <VolumeX className="size-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition cursor-pointer"
              title="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Dual Entry Point Selector: Option A vs Option B */}
        <div className="flex items-center gap-2 p-1.5 bg-muted/60 rounded-2xl shrink-0">
          <button
            type="button"
            data-testid="tab-create-with-ai"
            onClick={() => setCreationMode('ai')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              creationMode === 'ai'
                ? 'bg-card text-plum shadow-xs border border-gold/40 font-bold'
                : 'text-muted-foreground hover:text-navy'
            }`}
          >
            <Sparkles className="size-3.5 text-gold" />
            <span>Option A: Create with AI</span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-gold/20 text-gold-dark rounded-full">
              Primary / Recommended
            </span>
          </button>

          <button
            type="button"
            data-testid="tab-create-manually"
            onClick={() => setCreationMode('manual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              creationMode === 'manual'
                ? 'bg-card text-plum shadow-xs border border-border font-bold'
                : 'text-muted-foreground hover:text-navy'
            }`}
          >
            <FileText className="size-3.5 text-navy/70" />
            <span>Option B: Create Manually</span>
            <span className="text-[9px] font-medium text-muted-foreground">Secondary</span>
          </button>
        </div>

        {/* SUCCESS CONFIRMATION VIEW */}
        {hasConfirmed ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-rise">
            <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="size-9" />
            </div>
            <div>
              <h4 className="text-xl font-display font-bold text-plum">
                Event Created Successfully!
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                The event has been securely registered in Supabase and assigned to your organizer account. You can now coordinate vendors, milestones, and client contracts.
              </p>
            </div>

            <div className="w-full max-w-sm rounded-2xl bg-muted/40 p-3.5 border border-border text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event:</span>
                <span className="font-semibold text-navy">{draft.eventName || manualEventName || 'Client Celebration'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-semibold text-navy">{draft.eventType || manualEventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold text-navy">{draft.eventDate || manualEventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Locality:</span>
                <span className="font-semibold text-navy">{draft.area || manualArea}, {draft.city || manualCity}</span>
              </div>
            </div>

            <Button
              type="button"
              data-testid="open-planning-dashboard-btn"
              onClick={onClose}
              className="bg-gold hover:bg-gold-light text-plum font-bold shadow-xs px-6 py-2.5 rounded-xl cursor-pointer text-xs flex items-center gap-2"
            >
              Open Event Planning Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : creationMode === 'ai' ? (
          /* OPTION A: CONVERSATIONAL AI MODE */
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* Stage Progress Bar (Subtle Indicator) */}
            <div className="bg-muted/40 p-2.5 rounded-2xl border border-border/70 space-y-1.5 shrink-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy text-[11px] flex items-center gap-1.5">
                  <Clock className="size-3 text-gold" />
                  Stage: <span className="text-plum">{stageLabels[draft.currentStage]}</span>
                </span>
                <span className="text-[11px] font-semibold text-gold">
                  {draft.progressPercent}% Complete
                </span>
              </div>
              <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full rounded-full transition-all duration-300"
                  style={{ width: `${draft.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Demo Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 text-xs">
              <span className="text-[10px] font-bold text-muted-foreground shrink-0 uppercase tracking-wider">
                Quick Prompts:
              </span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUserSend(qp.text)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-card hover:bg-gold/15 border border-border hover:border-gold/50 text-navy font-medium transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Chat Stream */}
            <div
              data-testid="ai-messages-container"
              className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-muted/20 border border-border/50 min-h-[160px] max-h-[300px]"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-plum text-white font-medium rounded-br-xs'
                        : 'bg-card text-navy border border-gold/30 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] mt-1 block opacity-70 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Structured Review Card (if draft ready or review stage reached) */}
            {(draft.status === 'READY_FOR_REVIEW' || draft.progressPercent >= 75) && (
              <div
                data-testid="event-review-card"
                className="p-3.5 rounded-2xl bg-gold/10 border border-gold/40 text-xs space-y-2 shrink-0 animate-rise"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-plum flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Structured Event Summary (Review)
                  </h4>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {draft.category || 'Event'} Draft
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Event Name</span>
                    <strong className="text-navy truncate block">
                      {draft.eventName || 'Untitled Event'}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Client / Contact</span>
                    <strong className="text-navy truncate block">
                      {draft.clientName || 'Pending'} {draft.clientPhone ? `(${draft.clientPhone})` : ''}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Date & Venue</span>
                    <strong className="text-navy truncate block">
                      {draft.eventDate || 'Date Undecided'} • {draft.area}, {draft.city}
                    </strong>
                  </div>
                  <div className="p-2 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">Guests & Budget</span>
                    <strong className="text-navy truncate block">
                      {draft.guestCount ? `${draft.guestCount} guests` : 'TBD'} • ₹{draft.estimatedBudget ? (draft.estimatedBudget / 100000).toFixed(1) + 'L' : 'TBD'}
                    </strong>
                  </div>
                </div>

                {/* Review Prompt & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-gold/20">
                  <p className="text-[11px] text-navy italic">
                    {REVIEW_READY_MESSAGE}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      data-testid="edit-details-btn"
                      variant="outline"
                      onClick={() => {
                        speakText('You can speak or type any changes, such as date, budget, or venue.', activeLang);
                      }}
                      className="text-xs h-8 px-3 rounded-xl border-border cursor-pointer gap-1"
                    >
                      <Edit3 className="size-3 text-muted-foreground" />
                      Edit Details
                    </Button>
                    <Button
                      type="button"
                      data-testid="confirm-create-event-btn"
                      disabled={isSubmitting}
                      onClick={handleConfirmAICreation}
                      className="text-xs h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer gap-1 shadow-xs"
                    >
                      <Check className="size-3.5" />
                      {isSubmitting ? 'Creating...' : 'Confirm & Create Event'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Input Layout: STRICT ORDER: Message Input -> Microphone -> Send Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSend();
              }}
              data-testid="ai-bottom-input-bar"
              className="flex items-center gap-2 pt-1 shrink-0"
            >
              {/* 1. Message Input */}
              <input
                type="text"
                data-testid="ai-message-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Speak or type: 'Wedding for Rohan and Priya in Baner, ₹15 lakh'..."
                className="flex-1 rounded-2xl border border-input bg-card px-4 py-2.5 text-xs text-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 shadow-2xs"
              />

              {/* 2. Microphone Button */}
              <button
                type="button"
                data-testid="ai-mic-btn"
                onClick={toggleListening}
                className={`size-10 rounded-2xl flex items-center justify-center transition shadow-2xs shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
                    : 'bg-gold/15 hover:bg-gold/25 text-gold border border-gold/40'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak'}
              >
                <Mic className="size-4" />
              </button>

              {/* 3. Send Button */}
              <Button
                type="submit"
                data-testid="ai-send-btn"
                disabled={!inputText.trim()}
                className="h-10 px-4 rounded-2xl bg-plum hover:bg-plum/90 text-white shadow-2xs cursor-pointer shrink-0 text-xs font-semibold"
              >
                <Send className="size-3.5 mr-1" />
                Send
              </Button>
            </form>
          </div>
        ) : (
          /* OPTION B: MANUAL CREATION FORM */
          <form
            onSubmit={handleManualSubmit}
            data-testid="manual-creation-form"
            className="flex-1 overflow-y-auto space-y-3.5 text-xs pr-1"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-navy mb-1">
                  Client / Couple Name <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  data-testid="manual-client-name-input"
                  value={manualClientName}
                  onChange={(e) => {
                    setManualClientName(e.target.value);
                    if (!manualEventName) {
                      setManualEventName(`${e.target.value}'s Celebration`);
                    }
                  }}
                  placeholder="e.g. Priya Kulkarni & Rohan Deshmukh"
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Event Title:
                </label>
                <input
                  type="text"
                  value={manualEventName}
                  onChange={(e) => setManualEventName(e.target.value)}
                  placeholder="e.g. Kulkarni & Deshmukh Wedding"
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Client Phone <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="tel"
                  required
                  value={manualClientPhone}
                  onChange={(e) => setManualClientPhone(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Client Email:
                </label>
                <input
                  type="email"
                  value={manualClientEmail}
                  onChange={(e) => setManualClientEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Event Type:
                </label>
                <select
                  value={manualEventType}
                  onChange={(e) => setManualEventType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="Traditional Wedding Celebration">Traditional Wedding Celebration</option>
                  <option value="Griha Pravesh / Housewarming">Griha Pravesh / Housewarming</option>
                  <option value="Baby Shower / Dohale Jevan">Baby Shower / Dohale Jevan</option>
                  <option value="Ganpati Festival Celebration">Ganpati Festival Celebration</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary Celebration">Anniversary Celebration</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Religious Ceremony">Religious Ceremony</option>
                  <option value="Custom Celebration">Other Custom Event</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Event Date <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="date"
                  required
                  data-testid="manual-event-date-input"
                  value={manualEventDate}
                  onChange={(e) => setManualEventDate(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  City <span className="text-rose-500">*</span>:
                </label>
                <select
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value as 'Pune' | 'Mumbai')}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Area / Locality <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={manualArea}
                  onChange={(e) => setManualArea(e.target.value)}
                  placeholder="e.g. Baner, Pune"
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Venue Status:
                </label>
                <select
                  value={manualVenueStatus}
                  onChange={(e) => setManualVenueStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="FINALIZED">Venue Finalized</option>
                  <option value="NOT_FINALIZED">Not Yet Finalized / Tentative</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Venue Name (if known):
                </label>
                <input
                  type="text"
                  value={manualVenueName}
                  onChange={(e) => setManualVenueName(e.target.value)}
                  placeholder="e.g. Grand Hyatt / Amar Banquets"
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Estimated Guests:
                </label>
                <input
                  type="number"
                  value={manualGuestCount}
                  onChange={(e) => setManualGuestCount(parseInt(e.target.value, 10) || 100)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">
                  Estimated Budget (₹):
                </label>
                <input
                  type="number"
                  step="50000"
                  value={manualBudget}
                  onChange={(e) => setManualBudget(parseInt(e.target.value, 10) || 500000)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2 text-navy focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="text-xs h-9 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                data-testid="manual-submit-btn"
                className="bg-gold hover:bg-gold-light text-plum font-bold text-xs h-9 px-5 rounded-xl cursor-pointer shadow-xs"
              >
                {isSubmitting ? 'Registering...' : 'Register Event'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
