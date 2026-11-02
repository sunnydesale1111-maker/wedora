import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  ArrowRight,
  Send,
  RotateCcw,
  ShieldCheck,
  Users,
  CalendarDays,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vendor, AvailabilityStatus } from '@/types/vendor';
import { Inquiry, Quotation, Booking } from '@/types/booking';
import {
  VendorSlotType,
  getDaySlotStatus,
  checkSlotConflict,
  recordSlotBooking,
  loadVendorSlotBookings,
} from '@/types/vendorSlot';
import { checkSlotAvailability } from '@/lib/supabaseData';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  VoiceLanguage,
  parseVendorVoiceCommand,
  generateVoiceResponse,
  ParsedVoiceCommand,
  VendorConversationContext,
} from '@/utils/vendorVoiceNlu';
import { speakStandardText, stopStandardSpeaking, WEDORA_VOICE_CONFIG } from '@/utils/sharedVoiceConfig';
import {
  QuotationReviewModal,
  ProvisionalQuotationData,
} from '@/components/vendor/QuotationReviewModal';

interface VendorVoiceAssistantProps {
  vendor: Vendor;
  inquiries: Inquiry[];
  bookings: Booking[];
  calendarOverrides: Record<string, AvailabilityStatus>;
  onUpdateAvailability: (date: string, status: AvailabilityStatus) => void;
  onCreateQuotation: (payload: {
    inquiryId: string;
    vendorId: string;
    vendorBusinessName: string;
    quotedAmount: number;
    serviceScope: string;
    includedServices: string[];
    additionalCharges?: number;
  }) => Quotation;
  onNavigateTab?: (tabKey: string) => void;
}

export function VendorVoiceAssistant({
  vendor,
  inquiries,
  bookings,
  calendarOverrides,
  onUpdateAvailability,
  onCreateQuotation,
  onNavigateTab,
}: VendorVoiceAssistantProps) {
  // Language & Audio state
  const [lang, setLang] = useState<VoiceLanguage>('en');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');

  // Conversation history & stateful context
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [conversationContext, setConversationContext] = useState<VendorConversationContext>({ role: 'VENDOR' });
  const [aiMessage, setAiMessage] = useState<string>(
    'Hello! I am your live AI Voice Assistant. Speak in English, हिन्दी, or मराठी to check availability, book slots, or draft quotations.'
  );

  // Active workflow card states
  const [stagedSlotBooking, setStagedSlotBooking] = useState<{
    date: string;
    slot: VendorSlotType;
    clientName: string;
    eventName: string;
  } | null>(null);

  const [activeAvailabilityCard, setActiveAvailabilityCard] = useState<{
    date: string;
    firstHalfBooked: boolean;
    secondHalfBooked: boolean;
    firstHalfName?: string;
    secondHalfName?: string;
  } | null>(null);

  const [provisionalQuote, setProvisionalQuote] = useState<ProvisionalQuotationData | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string>('');

  // Browser Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

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

        setInterimTranscript(currentInterim);
        if (finalTranscript) {
          setTextInput(finalTranscript);
          handleProcessVoiceInput(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Standardized Text-to-Speech function (0.85x speed across all dashboards)
  const speakText = (text: string, language: VoiceLanguage) => {
    if (isAudioMuted || typeof window === 'undefined') return;

    speakStandardText(text, language, {
      rate: WEDORA_VOICE_CONFIG.speakingRate,
      pitch: WEDORA_VOICE_CONFIG.pitch,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari, or use the text command bar.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopStandardSpeaking();
      setIsSpeaking(false);
      try {
        recognitionRef.current.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  // Main input processor
  const handleProcessVoiceInput = async (rawInput: string) => {
    if (!rawInput.trim()) return;

    setLastUserSpeech(rawInput);
    setTextInput('');

    // Parse command with Multilingual NLU & Conversation Context
    const parsed: ParsedVoiceCommand = parseVendorVoiceCommand(rawInput, lang, undefined, conversationContext);

    // If a different language was detected, sync language state without dropping context
    if (parsed.detectedLang !== lang) {
      setLang(parsed.detectedLang);
    }

    // Retain context memory across turns and language switches
    setConversationContext((prev) => ({
      ...prev,
      detectedLang: parsed.detectedLang,
      intent: parsed.intent !== 'UNKNOWN' && parsed.intent !== 'NEED_CLARIFICATION' ? parsed.intent : prev.intent,
      date: parsed.date || prev.date,
      slot: parsed.slot || prev.slot,
      guestCount: parsed.guestCount ?? prev.guestCount,
      pricePerPlate: parsed.pricePerPlate ?? prev.pricePerPlate,
      quotedAmount: parsed.quotedAmount ?? prev.quotedAmount,
      additionalCharges: parsed.additionalCharges ?? prev.additionalCharges,
      missingField: parsed.missingField,
    }));

    // Workflow 0: Need Clarification (Missing critical date, guest count, or rate)
    if (parsed.intent === 'NEED_CLARIFICATION' && parsed.clarificationPrompt) {
      setAiMessage(parsed.clarificationPrompt);
      speakText(parsed.clarificationPrompt, parsed.detectedLang);
      return;
    }

    // Workflow 1: Check Availability (Exact requested date and slot)
    if (parsed.intent === 'CHECK_AVAILABILITY') {
      if (!parsed.date) {
        const prompt =
          parsed.detectedLang === 'mr'
            ? 'कृपया ज्या तारखेची उपलब्धता तपासायची आहे ती तारीख सांगा.'
            : parsed.detectedLang === 'hi'
            ? 'कृपया वह तारीख बताएं जिसकी उपलब्धता आप देखना चाहते हैं।'
            : 'Please specify the date you would like to check availability for.';
        setAiMessage(prompt);
        speakText(prompt, parsed.detectedLang);
        return;
      }

      const targetDate = parsed.date;
      const slotStatus = getDaySlotStatus(
        vendor.id,
        targetDate,
        calendarOverrides[targetDate]
      );

      let firstHalfBooked = slotStatus.firstHalfBooked;
      let secondHalfBooked = slotStatus.secondHalfBooked;
      let isVerifyError = false;

      // Query actual vendor availability data from Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const [fRes, sRes] = await Promise.all([
            checkSlotAvailability(vendor.id, targetDate, 'FIRST_HALF'),
            checkSlotAvailability(vendor.id, targetDate, 'SECOND_HALF'),
          ]);

          if (fRes.error || sRes.error) {
            isVerifyError = true;
          } else {
            if (!fRes.isAvailable) firstHalfBooked = true;
            if (!sRes.isAvailable) secondHalfBooked = true;
          }
        } catch {
          isVerifyError = true;
        }
      }

      if (isVerifyError) {
        const errorMsg =
          parsed.detectedLang === 'mr'
            ? 'मी आत्ता त्या स्लॉटची पडताळणी करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.'
            : parsed.detectedLang === 'hi'
            ? 'मैं अभी इस स्लॉट की जांच नहीं कर सका। कृपया पुनः प्रयास करें।'
            : "I couldn't verify that slot right now. Please try again.";
        setAiMessage(errorMsg);
        speakText(errorMsg, parsed.detectedLang);
        return;
      }

      // Preserve confirmed date and queried status in context
      setConversationContext((prev) => ({
        ...prev,
        date: targetDate,
        lastCheckedAvailability: {
          date: targetDate,
          firstHalfBooked,
          secondHalfBooked,
        },
      }));

      const resp = generateVoiceResponse(parsed, {
        vendorBusinessName: vendor.businessName,
        vendorCategory: vendor.category,
        firstHalfBooked,
        secondHalfBooked,
      });

      setAiMessage(resp.message);
      speakText(resp.speechText, parsed.detectedLang);

      setActiveAvailabilityCard({
        date: targetDate,
        firstHalfBooked,
        secondHalfBooked,
        firstHalfName: slotStatus.firstHalfDetails?.eventName,
        secondHalfName: slotStatus.secondHalfDetails?.eventName,
      });
      return;
    }

    // Workflow 2: Slot Booking
    if (parsed.intent === 'BOOK_SLOT') {
      if (!parsed.date) {
        const prompt =
          parsed.detectedLang === 'mr'
            ? 'तुम्हाला कोणत्या तारखेसाठी स्लॉट बुक करायचा आहे?'
            : parsed.detectedLang === 'hi'
            ? 'आप किस तारीख के लिए स्लॉट बुक करना चाहते हैं?'
            : 'For which date would you like to book the slot?';
        setAiMessage(prompt);
        speakText(prompt, parsed.detectedLang);
        return;
      }

      const targetDate = parsed.date;
      const targetSlot = parsed.slot || 'FIRST_HALF';

      // Check conflict for this specific date and slot
      const conflict = checkSlotConflict(
        vendor.id,
        targetDate,
        targetSlot,
        calendarOverrides[targetDate]
      );

      const resp = generateVoiceResponse(parsed, {
        vendorBusinessName: vendor.businessName,
        vendorCategory: vendor.category,
        conflictReason: conflict.hasConflict ? conflict.reason : undefined,
      });

      setAiMessage(resp.message);
      speakText(resp.speechText, parsed.detectedLang);

      if (!conflict.hasConflict) {
        setStagedSlotBooking({
          date: targetDate,
          slot: targetSlot,
          clientName: parsed.clientName || 'Private Client',
          eventName: `${vendor.category} Booking`,
        });
      }
      return;
    }

    // Workflow 3: Create Provisional Quotation with Deterministic Calculation
    if (parsed.intent === 'CREATE_QUOTE') {
      if (!parsed.guestCount || (!parsed.pricePerPlate && !parsed.quotedAmount)) {
        const prompt =
          parsed.detectedLang === 'mr'
            ? 'कृपया कोटेशन तयार करण्यासाठी पाहुण्यांची संख्या आणि प्रति प्लेट दर सांगा.'
            : parsed.detectedLang === 'hi'
            ? 'कृपया कोटेशन बनाने के लिए मेहमान संख्या और प्रति प्लेट दर बताएं।'
            : 'Please provide the number of guests and price per plate to generate your quotation.';
        setAiMessage(prompt);
        speakText(prompt, parsed.detectedLang);
        return;
      }

      const targetDate = parsed.date || '2026-12-15';
      const targetClient = parsed.clientName || 'Client Quotation';
      const targetGuests = parsed.guestCount;
      const targetPricePerPlate = parsed.pricePerPlate;
      const targetAdditionalCharges = parsed.additionalCharges || 0;
      const targetAmount =
        parsed.quotedAmount ||
        (targetPricePerPlate ? targetGuests * targetPricePerPlate : 0);

      // Create a fresh unique draft, strictly resetting previous memory values
      const quoteId = `quote-${Date.now()}`;
      const draft: ProvisionalQuotationData = {
        id: quoteId,
        inquiryId: quoteId,
        vendorId: vendor.id,
        vendorBusinessName: vendor.businessName,
        clientName: targetClient,
        eventName: `${targetClient} ${vendor.category}`,
        date: targetDate,
        location: 'Baner, Pune',
        guestCount: targetGuests || 1,
        pricePerPlate: targetPricePerPlate,
        serviceCategory: vendor.category,
        quotedAmount: targetAmount,
        additionalCharges: targetAdditionalCharges,
        taxAmount: 0,
        serviceScope: targetPricePerPlate
          ? `Comprehensive ${vendor.category} package for ${targetGuests} guests at ₹${targetPricePerPlate?.toLocaleString('en-IN') || 0}/plate.`
          : `Customized turnkey ${vendor.category} package for ${targetClient}.`,
        includedServices: [
          'Professional Service Crew',
          'Delivery & Setup Logistics',
          'Supervisor On-site throughout Event',
          'Hygiene & Safety Certified Staff',
        ],
      };

      setProvisionalQuote(draft);

      const resp = generateVoiceResponse(parsed, {
        vendorBusinessName: vendor.businessName,
        vendorCategory: vendor.category,
      });

      setAiMessage(resp.message);
      speakText(resp.speechText, parsed.detectedLang);
      return;
    }

    // Workflow 4: Review Quotation
    if (parsed.intent === 'REVIEW_QUOTE') {
      if (!provisionalQuote) {
        const msg =
          parsed.detectedLang === 'mr'
            ? 'सध्या कोणतेही सक्रिय कोटेशन सापडले नाही. नवीन कोटेशन बनवण्यासाठी कृपया पाहुण्यांची संख्या व दर सांगा.'
            : parsed.detectedLang === 'hi'
            ? 'वर्तमान में कोई सक्रिय कोटेशन नहीं मिला। नया कोटेशन बनाने के लिए कृपया मेहमान संख्या और दर बताएं।'
            : 'No active quotation draft found. Please specify guest count and price per plate to create one.';
        setAiMessage(msg);
        speakText(msg, parsed.detectedLang);
        return;
      }

      setIsReviewModalOpen(true);
      const resp = generateVoiceResponse(parsed, {
        vendorBusinessName: vendor.businessName,
        vendorCategory: vendor.category,
      });
      setAiMessage(resp.message);
      speakText(resp.speechText, parsed.detectedLang);
      return;
    }

    // Workflow 5: Navigation
    if (parsed.intent.startsWith('NAVIGATE_')) {
      if (parsed.targetTab && onNavigateTab) {
        onNavigateTab(parsed.targetTab);
      }
      const resp = generateVoiceResponse(parsed, {
        vendorBusinessName: vendor.businessName,
        vendorCategory: vendor.category,
      });
      setAiMessage(resp.message);
      speakText(resp.speechText, parsed.detectedLang);
      return;
    }

    // Default & Help responses
    const resp = generateVoiceResponse(parsed, {
      vendorBusinessName: vendor.businessName,
      vendorCategory: vendor.category,
    });
    setAiMessage(resp.message);
    speakText(resp.speechText, parsed.detectedLang);
  };

  // Confirm slot reservation action
  const handleConfirmSlotBooking = () => {
    if (!stagedSlotBooking) return;

    recordSlotBooking(vendor.id, {
      vendorId: vendor.id,
      date: stagedSlotBooking.date,
      slot: stagedSlotBooking.slot,
      eventName: stagedSlotBooking.eventName,
      clientName: stagedSlotBooking.clientName,
    });

    // Check status after booking to update calendar
    const updatedStatus = getDaySlotStatus(vendor.id, stagedSlotBooking.date);
    if (updatedStatus.firstHalfBooked && updatedStatus.secondHalfBooked) {
      onUpdateAvailability(stagedSlotBooking.date, 'Fully Booked');
    } else {
      onUpdateAvailability(stagedSlotBooking.date, 'Tentative');
    }

    const slotLabel =
      stagedSlotBooking.slot === 'FIRST_HALF'
        ? 'First Half'
        : stagedSlotBooking.slot === 'SECOND_HALF'
        ? 'Second Half'
        : 'Full Day';

    const success =
      lang === 'mr'
        ? `✓ ${stagedSlotBooking.date} साठी ${slotLabel} यशस्वीरित्या बुक करण्यात आला आहे!`
        : lang === 'hi'
        ? `✓ ${stagedSlotBooking.date} के लिए ${slotLabel} स्लॉट सफलतापूर्वक बुक हो गया है!`
        : `✓ Successfully reserved ${slotLabel} on ${stagedSlotBooking.date}!`;

    setBookingSuccessMsg(success);
    speakText(success, lang);
    setStagedSlotBooking(null);

    setTimeout(() => {
      setBookingSuccessMsg('');
    }, 4500);
  };

  // Quick Voice Prompts for immediate testing
  const quickPrompts = useMemo(() => {
    if (lang === 'mr') {
      return [
        { label: '५०० पाहुणे, ₹५००/प्लेट कोटेशन बनवा', text: '500 पाहुण्यांसाठी 500 रुपये प्रति प्लेट कोटेशन बनवा' },
        { label: '५०० पाहुणे, ₹१२००/प्लेट कोटेशन बनवा', text: '500 पाहुण्यांसाठी 1200 रुपये प्रति प्लेट कोटेशन बनवा' },
        { label: '१५ डिसेंबर २०२६ ची उपलब्धता तपासा', text: '15 डिसेंबर 2026 ची उपलब्धता तपासा' },
        { label: '१८ डिसेंबरला फर्स्ट हाफ बुक करा', text: '18 डिसेंबरला फर्स्ट हाफ बुक करा' },
        { label: 'कोटेशन तपासा (Review)', text: 'कोटेशन तपासा' },
      ];
    }
    if (lang === 'hi') {
      return [
        { label: '500 मेहमान, ₹500/प्लेट कोटेशन बनाओ', text: '500 मेहमानों का 500 प्रति प्लेट कोटेशन बनाओ' },
        { label: '500 मेहमान, ₹1200/प्लेट कोटेशन बनाओ', text: '500 मेहमानों का 1200 प्रति प्लेट कोटेशन बनाओ' },
        { label: '15 दिसंबर 2026 की उपलब्धता बताओ', text: '15 दिसंबर 2026 की उपलब्धता बताओ' },
        { label: '18 दिसंबर को फर्स्ट हाफ बुक करो', text: '18 दिसंबर को फर्स्ट हाफ बुक करो' },
        { label: 'कोटेशन रिव्यू करो', text: 'कोटेशन रिव्यू करो' },
      ];
    }
    return [
      { label: 'Quote: 500 guests at ₹500/plate', text: 'Create a provisional quotation for 500 guests at ₹500 per plate' },
      { label: 'Quote: 500 guests at ₹1,200/plate', text: 'Create a provisional quotation for 500 guests at ₹1,200 per plate' },
      { label: 'Check 15 Dec 2026 availability', text: 'Check availability for 15 December 2026' },
      { label: 'Book First Half on 18 Dec', text: 'Book First Half on 18 Dec 2026' },
      { label: 'Review & Approve quote', text: 'Review quotation' },
    ];
  }, [lang]);

  return (
    <div className="rounded-3xl border border-gold/40 bg-card p-5 sm:p-6 shadow-soft relative overflow-hidden transition-all duration-300">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-gold-soft/30 blur-2xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-72 h-28 bg-plum-soft/20 blur-2xl pointer-events-none rounded-full" />

      {/* 1. Header Toolbar: Title, Automatic Language Detection Badge, Mute Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`flex size-11 items-center justify-center rounded-2xl bg-gradient-plum text-gold shadow-md transition-all ${
                isListening
                  ? 'ring-4 ring-gold animate-pulse scale-105'
                  : isSpeaking
                  ? 'ring-2 ring-emerald-500 scale-105'
                  : ''
              }`}
            >
              <Sparkles className="size-5.5 text-gold" />
            </div>
            {isListening && (
              <span className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full animate-ping" />
            )}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 size-3 bg-emerald-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl text-plum font-semibold tracking-tight">
                Wedora Vendor Live Voice Assistant
              </h2>
              <span className="rounded-full bg-gold-soft text-navy px-2.5 py-0.5 text-[10px] font-bold border border-gold/40 uppercase tracking-wider">
                Multilingual AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live voice assistant with automatic language detection (English, हिन्दी, मराठी), smart quotation calculation, and slot bookings.
            </p>
          </div>
        </div>

        {/* Controls: Automatic Language Detection Pill & Audio Mute Toggle */}
        <div className="flex items-center gap-2">
          {/* Automatic Language Detection Badge (No manual selection needed) */}
          <div
            title="Automatically detects English, हिन्दी, or मराठी and adapts dynamically"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 border border-gold/40 text-xs shadow-2xs"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground text-[11px] font-medium">Auto-Language:</span>
            <span className="font-bold text-plum">
              {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिन्दी' : 'English'}
            </span>
          </div>

          {/* Mute Voice Responses Button */}
          <button
            type="button"
            onClick={() => {
              if (!isAudioMuted && typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
              setIsAudioMuted(!isAudioMuted);
            }}
            title={isAudioMuted ? 'Unmute voice responses' : 'Mute voice responses'}
            className={`p-2 rounded-full border transition ${
              isAudioMuted
                ? 'bg-destructive/10 text-destructive border-destructive/30'
                : 'bg-secondary text-navy hover:bg-gold-soft'
            }`}
          >
            {isAudioMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* 2. Live Conversation Dialogue Viewport */}
      <div className="py-3 relative z-10">
        <div className="w-full bg-secondary/40 rounded-2xl border p-3 sm:p-4 text-xs space-y-2.5 min-h-[72px] flex flex-col justify-center">
          {lastUserSpeech ? (
            <div className="flex items-start justify-end">
              <div className="bg-plum/10 text-plum border border-plum/20 rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[85%] text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-muted-foreground block mb-0.5">Vendor Command</span>
                <span className="font-medium">"{lastUserSpeech}"</span>
              </div>
            </div>
          ) : interimTranscript ? (
            <div className="flex items-start justify-end">
              <div className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 rounded-2xl rounded-tr-xs px-3.5 py-2 max-w-[85%] flex items-center gap-2 animate-pulse">
                <Mic className="size-3.5 text-red-500 animate-bounce" />
                <span className="text-[10px] font-bold">Listening:</span>
                <span className="font-medium italic">"{interimTranscript}"</span>
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-xl bg-gradient-plum text-gold shrink-0 mt-0.5">
              <Sparkles className="size-3.5 text-gold" />
            </div>
            <div className="bg-card rounded-2xl rounded-tl-xs p-3 border shadow-2xs flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold text-plum uppercase tracking-wider">
                  Wedora Live AI Assistant
                </span>
                {isSpeaking && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold animate-pulse">
                    <Volume2 className="size-3" /> Speaking...
                  </span>
                )}
              </div>
              <p className="text-plum leading-relaxed text-xs sm:text-[13px] font-medium">{aiMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUCCESS BANNER */}
      {bookingSuccessMsg && (
        <div className="mb-3 p-3.5 rounded-2xl bg-success-soft border border-success/30 text-success text-xs font-semibold flex items-center justify-between animate-rise">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setBookingSuccessMsg('')}
            className="text-success hover:underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. CONTEXTUAL WORKFLOW ACTION CARDS */}

      {/* A. Availability Card */}
      {activeAvailabilityCard && (
        <div className="mb-3 p-4 rounded-2xl bg-secondary/40 border border-gold/30 text-xs space-y-3 animate-rise">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 font-semibold text-plum">
              <CalendarCheck className="size-4 text-gold" />
              <span>Availability Details for {activeAvailabilityCard.date}</span>
            </div>
            <button
              onClick={() => setActiveAvailabilityCard(null)}
              className="text-muted-foreground hover:text-foreground text-[11px]"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* First Half Slot Status */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                activeAvailabilityCard.firstHalfBooked
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div>
                <span className="font-bold block">First Half (08:00 AM – 03:00 PM)</span>
                <span className="text-[11px] block mt-0.5">
                  {activeAvailabilityCard.firstHalfBooked
                    ? `Occupied: ${activeAvailabilityCard.firstHalfName || 'Client Commitment'}`
                    : 'Open & Available for Booking'}
                </span>
              </div>
              {!activeAvailabilityCard.firstHalfBooked && (
                <Button
                  size="sm"
                  variant="gold"
                  className="text-[11px] h-7 px-2.5"
                  onClick={() =>
                    setStagedSlotBooking({
                      date: activeAvailabilityCard.date,
                      slot: 'FIRST_HALF',
                      clientName: 'Client Reservation',
                      eventName: `${vendor.category} Event`,
                    })
                  }
                >
                  Book Slot
                </Button>
              )}
            </div>

            {/* Second Half Slot Status */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                activeAvailabilityCard.secondHalfBooked
                  ? 'bg-destructive/10 border-destructive/20 text-destructive'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <div>
                <span className="font-bold block">Second Half (04:00 PM – 11:30 PM)</span>
                <span className="text-[11px] block mt-0.5">
                  {activeAvailabilityCard.secondHalfBooked
                    ? `Occupied: ${activeAvailabilityCard.secondHalfName || 'Client Commitment'}`
                    : 'Open & Available for Booking'}
                </span>
              </div>
              {!activeAvailabilityCard.secondHalfBooked && (
                <Button
                  size="sm"
                  variant="gold"
                  className="text-[11px] h-7 px-2.5"
                  onClick={() =>
                    setStagedSlotBooking({
                      date: activeAvailabilityCard.date,
                      slot: 'SECOND_HALF',
                      clientName: 'Client Reservation',
                      eventName: `${vendor.category} Event`,
                    })
                  }
                >
                  Book Slot
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* B. Slot Booking Confirmation Card */}
      {stagedSlotBooking && (
        <div className="mb-3 p-4 rounded-2xl bg-gold-soft/50 border border-gold/50 text-xs space-y-3 animate-rise">
          <div className="flex items-center justify-between border-b border-gold/30 pb-2">
            <div className="flex items-center gap-2 font-bold text-plum">
              <CalendarDays className="size-4 text-gold" />
              <span>Confirm Slot Reservation</span>
            </div>
            <button
              onClick={() => setStagedSlotBooking(null)}
              className="text-muted-foreground hover:text-foreground text-[11px]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Target Date:</span>
              <span className="font-semibold text-navy">{stagedSlotBooking.date}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Selected Slot:</span>
              <span className="font-semibold text-plum">
                {stagedSlotBooking.slot === 'FIRST_HALF'
                  ? 'First Half (Morning)'
                  : stagedSlotBooking.slot === 'SECOND_HALF'
                  ? 'Second Half (Evening)'
                  : 'Full Day'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Client Name:</span>
              <input
                type="text"
                value={stagedSlotBooking.clientName}
                onChange={(e) =>
                  setStagedSlotBooking({ ...stagedSlotBooking, clientName: e.target.value })
                }
                className="w-full bg-background rounded-lg border px-2 py-0.5 text-xs font-semibold text-navy outline-none focus:border-gold"
              />
            </div>
            <div>
              <span className="text-muted-foreground text-[10px] uppercase font-bold block">Event Description:</span>
              <input
                type="text"
                value={stagedSlotBooking.eventName}
                onChange={(e) =>
                  setStagedSlotBooking({ ...stagedSlotBooking, eventName: e.target.value })
                }
                className="w-full bg-background rounded-lg border px-2 py-0.5 text-xs font-semibold text-navy outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gold/30">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-success" />
              <span>No scheduling conflicts. Explicit vendor confirmation required to lock slot.</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7"
                onClick={() => setStagedSlotBooking(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="hero"
                className="text-xs font-semibold h-7"
                onClick={handleConfirmSlotBooking}
              >
                <CheckCircle2 className="size-3.5 mr-1" /> Confirm Slot Reservation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* C. Provisional Quotation Preview Card with Automatic Calculation Table */}
      {provisionalQuote && (
        <div className="mb-3 p-4 sm:p-5 rounded-2xl bg-card border border-gold/50 shadow-soft text-xs space-y-3.5 animate-rise">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 font-bold text-plum">
              <FileText className="size-4 text-gold" />
              <span>Provisional Quotation Draft Generated</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Status: Draft / Provisional
              </span>
            </div>
            <button
              onClick={() => setProvisionalQuote(null)}
              className="text-muted-foreground hover:text-foreground text-[11px]"
            >
              Dismiss
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span>Vendor: <strong className="text-navy">{provisionalQuote.vendorBusinessName}</strong></span>
            <span>·</span>
            <span>Client: <strong className="text-navy">{provisionalQuote.clientName}</strong></span>
            <span>·</span>
            <span>Event: <strong className="text-navy">{provisionalQuote.eventName}</strong></span>
            <span>·</span>
            <span>Date: <strong className="text-navy">{provisionalQuote.date}</strong></span>
            <span>·</span>
            <span>Location: <strong className="text-navy">{provisionalQuote.location || 'Baner, Pune'}</strong></span>
            <span>·</span>
            <span>Category: <strong className="text-navy">{provisionalQuote.serviceCategory}</strong></span>
          </div>

          {/* Structured Automatic Quotation Calculation Table */}
          <div className="overflow-x-auto rounded-xl border border-gold/40 bg-background/80 shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b bg-secondary/70 text-plum font-semibold">
                  <th className="py-2.5 px-3 sm:px-4">Description</th>
                  <th className="py-2.5 px-3 sm:px-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {provisionalQuote.pricePerPlate ? (
                  <>
                    <tr>
                      <td className="py-2 px-3 sm:px-4 text-muted-foreground">Number of guests</td>
                      <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                        {provisionalQuote.guestCount}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 sm:px-4 text-muted-foreground">Price per plate</td>
                      <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                        ₹{provisionalQuote.pricePerPlate.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 sm:px-4 text-muted-foreground">Itemized subtotal (Guests × Rate)</td>
                      <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                        ₹{(provisionalQuote.guestCount * provisionalQuote.pricePerPlate).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="py-2 px-3 sm:px-4 text-muted-foreground">Service package</td>
                      <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                        {provisionalQuote.serviceCategory} Execution
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 sm:px-4 text-muted-foreground">Package subtotal</td>
                      <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                        ₹{provisionalQuote.quotedAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </>
                )}
                {provisionalQuote.additionalCharges > 0 ? (
                  <tr>
                    <td className="py-2 px-3 sm:px-4 text-muted-foreground">Additional charges / logistics</td>
                    <td className="py-2 px-3 sm:px-4 text-right font-semibold text-navy">
                      +₹{provisionalQuote.additionalCharges.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ) : null}
                <tr className="bg-gold-soft/35 font-bold text-plum">
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-plum">Total provisional amount</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-display text-sm font-bold text-plum">
                    ₹{(
                      (provisionalQuote.pricePerPlate
                        ? provisionalQuote.guestCount * provisionalQuote.pricePerPlate
                        : provisionalQuote.quotedAmount) + (provisionalQuote.additionalCharges || 0)
                    ).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-gold shrink-0" />
              <span>
                Calculation follows: <strong>Total Amount = Number of Guests × Price Per Plate</strong>.
              </span>
            </div>
            <Button
              size="sm"
              variant="hero"
              className="text-xs font-semibold"
              onClick={() => setIsReviewModalOpen(true)}
            >
              <FileText className="size-3.5 mr-1.5" /> Review & Approve Quotation
            </Button>
          </div>
        </div>
      )}

      {/* 5. Quick Action Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-1 relative z-10">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="size-3 text-gold" /> Try saying:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() => handleProcessVoiceInput(prompt.text)}
            className="text-[11px] px-3 py-1 rounded-full bg-secondary hover:bg-gold-soft hover:text-plum border text-navy font-medium whitespace-nowrap transition shadow-2xs"
          >
            "{prompt.label}"
          </button>
        ))}
      </div>

      {/* 6. WhatsApp-Style Voice & Message Input Bar: Type Message Box -> Microphone -> Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (textInput.trim()) {
            handleProcessVoiceInput(textInput);
          }
        }}
        className="mt-2.5 flex items-center gap-2 bg-secondary/80 p-1.5 sm:p-2 rounded-full border border-border/80 shadow-xs relative z-10"
      >
        {/* 1. Text Input Message Box (Occupies available width) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              isListening
                ? lang === 'mr'
                  ? '🎙️ ऐकत आहे... (मराठी, हिंदी किंवा इंग्रजीत बोला)...'
                  : lang === 'hi'
                  ? '🎙️ सुन रहा हूँ... (हिंदी, मराठी या अंग्रेजी में बोलें)...'
                  : '🎙️ Listening... (Speak in English, Hindi, or Marathi)...'
                : lang === 'mr'
                ? 'येथे टाइप करा किंवा माईक दाबून बोला...'
                : lang === 'hi'
                ? 'यहाँ टाइप करें या माइक दबाकर बोलें...'
                : 'Type a message or tap mic to speak...'
            }
            className="w-full bg-background rounded-full pl-4 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-navy placeholder:text-muted-foreground outline-none border border-border/70 focus:border-emerald-600 transition"
          />
          {textInput && (
            <button
              type="button"
              onClick={() => setTextInput('')}
              className="absolute right-3 top-2 sm:top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear input"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* 2. Microphone Button (Immediately after message box) */}
        <button
          type="button"
          onClick={toggleListening}
          title={
            isListening
              ? 'Tap to stop recording'
              : 'Tap microphone to speak (English, हिन्दी, मराठी)'
          }
          className={`size-10 sm:size-10.5 shrink-0 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500 text-white shadow-md animate-pulse scale-105'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:scale-105'
          }`}
        >
          {isListening ? (
            <MicOff className="size-5 animate-pulse" />
          ) : (
            <Mic className="size-5" />
          )}
        </button>

        {/* 3. Send Button (Immediately after microphone) */}
        <button
          type="submit"
          disabled={!textInput.trim()}
          title="Send message"
          className={`size-10 sm:size-10.5 shrink-0 rounded-full flex items-center justify-center transition-all ${
            textInput.trim()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:scale-105'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
          }`}
        >
          <Send className="size-4.5" />
        </button>
      </form>

      {/* 7. FORMAL QUOTATION REVIEW & APPROVAL MODAL */}
      {isReviewModalOpen && provisionalQuote && (
        <QuotationReviewModal
          provisionalQuote={provisionalQuote}
          onClose={() => setIsReviewModalOpen(false)}
          onApproveAndSend={(finalQuote) => {
            onCreateQuotation(finalQuote);
            setProvisionalQuote(null);
            setIsReviewModalOpen(false);

            const dispatched =
              lang === 'mr'
                ? `✓ ${finalQuote.serviceScope} साठीचे कोटेशन यशस्वीरित्या पाठवले आहे!`
                : lang === 'hi'
                ? `✓ कोटेशन सफलतापूर्वक ग्राहक को भेज दिया गया है!`
                : `✓ Quotation formally approved and dispatched to customer!`;

            setBookingSuccessMsg(dispatched);
            speakText(dispatched, lang);
          }}
        />
      )}
    </div>
  );
}

export default VendorVoiceAssistant;

