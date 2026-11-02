import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  WEDORA_VOICE_CONFIG,
  WEDORA_STANDARD_SPEAKING_RATE,
  WEDORA_STANDARD_PITCH,
  WEDORA_STANDARD_VOLUME,
  getStandardVoice,
  getStandardSpeakingSpeed,
  speakStandardText,
  stopStandardSpeaking,
} from '../utils/sharedVoiceConfig';
import { CustomerVoiceAssistant } from '../components/customer/CustomerVoiceAssistant';
import { PlannerVoiceAssistant } from '../components/planner/PlannerVoiceAssistant';
import { WeddingEvent } from '../types/event';

// Sample sentence for cross-dashboard voice consistency testing
const SAMPLE_SENTENCE_EN =
  'Welcome to Wedora. I can help you find verified catering, photography, and venue vendors within your budget.';
const SAMPLE_SENTENCE_HI =
  'वेडोरा में आपका स्वागत है। मैं आपके बजट में कैटरिंग, फोटोग्राफी और वेन्यू वेंडर्स खोजने में मदद कर सकता हूँ।';
const SAMPLE_SENTENCE_MR =
  'वेडोरा मध्ये आपले स्वागत आहे. मी आपल्या बजेटनुसार केटरिंग, फोटोग्राफी आणि वेन्यू वेंडर्स शोधण्यात मदत करू शकतो.';

const mockEvent: WeddingEvent = {
  id: 'evt-01',
  eventName: 'Rohan & Priya Grand Vivah',
  eventType: 'Traditional Maharashtrian Wedding',
  eventDate: '2026-12-15',
  city: 'Pune',
  area: 'Baner',
  guestCount: 650,
  estimatedBudget: 2800000,
  venueName: 'Emerald Meadows Lawns',
  ownerUserId: 'd0000000-0000-0000-0000-000000000001',
};

describe('WEDORA — UNIFY AI VOICE AND REDUCE SPEAKING SPEED', () => {
  let mockSpeak: any;
  let mockCancel: any;
  let mockGetVoices: any;
  let capturedUtterance: SpeechSynthesisUtterance | null = null;

  const mockAvailableVoices: SpeechSynthesisVoice[] = [
    {
      name: 'Microsoft Neerja Online (Natural) - English (India)',
      lang: 'en-IN',
      default: false,
      localService: true,
      voiceURI: 'neerja',
    },
    {
      name: 'Microsoft Heera - English (India)',
      lang: 'en-IN',
      default: false,
      localService: true,
      voiceURI: 'heera',
    },
    {
      name: 'Microsoft Swara Online (Natural) - Hindi (India)',
      lang: 'hi-IN',
      default: false,
      localService: true,
      voiceURI: 'swara',
    },
    {
      name: 'Microsoft Aarohi Online (Natural) - Marathi (India)',
      lang: 'mr-IN',
      default: false,
      localService: true,
      voiceURI: 'aarohi',
    },
    {
      name: 'Microsoft David',
      lang: 'en-US',
      default: true,
      localService: true,
      voiceURI: 'david',
    },
  ];

  beforeEach(() => {
    capturedUtterance = null;
    mockSpeak = vi.fn((utterance: SpeechSynthesisUtterance) => {
      capturedUtterance = utterance;
    });
    mockCancel = vi.fn();
    mockGetVoices = vi.fn(() => mockAvailableVoices);

    // Mock window.speechSynthesis
    if (typeof window !== 'undefined') {
      (window as any).speechSynthesis = {
        speak: mockSpeak,
        cancel: mockCancel,
        getVoices: mockGetVoices,
        pause: vi.fn(),
        resume: vi.fn(),
      };
      (window as any).SpeechSynthesisUtterance = vi.fn(function (this: any, text: string) {
        this.text = text;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        this.lang = 'en-US';
        this.voice = null;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
      });
    }
  });

  // =========================================================================
  // 1. VERIFY SPEAKING SPEED IS REDUCED TO 0.85x
  // =========================================================================
  it('Requirement 1: Global speaking speed is configured to 0.85x across all languages', () => {
    expect(WEDORA_VOICE_CONFIG.speakingRate).toBe(0.85);
    expect(WEDORA_STANDARD_SPEAKING_RATE).toBe(0.85);
    expect(getStandardSpeakingSpeed()).toBe(0.85);

    // Rate in locales
    expect(WEDORA_VOICE_CONFIG.locales.en.targetSpeed).toBe(0.85);
    expect(WEDORA_VOICE_CONFIG.locales.hi.targetSpeed).toBe(0.85);
    expect(WEDORA_VOICE_CONFIG.locales.mr.targetSpeed).toBe(0.85);
  });

  // =========================================================================
  // 2. VERIFY ONE CONSISTENT VOICE IDENTITY ACROSS ALL THREE DASHBOARDS
  // =========================================================================
  it('Requirement 2: Selects the same consistent voice identity across Customer, Planner, and Vendor assistants', () => {
    // English (India)
    const voiceEnCustomer = getStandardVoice(mockAvailableVoices, 'en');
    const voiceEnPlanner = getStandardVoice(mockAvailableVoices, 'en');
    const voiceEnVendor = getStandardVoice(mockAvailableVoices, 'en');

    expect(voiceEnCustomer?.name).toBe('Microsoft Neerja Online (Natural) - English (India)');
    expect(voiceEnCustomer?.name).toBe(voiceEnPlanner?.name);
    expect(voiceEnPlanner?.name).toBe(voiceEnVendor?.name);

    // Hindi (India)
    const voiceHiCustomer = getStandardVoice(mockAvailableVoices, 'hi');
    const voiceHiPlanner = getStandardVoice(mockAvailableVoices, 'hi');
    const voiceHiVendor = getStandardVoice(mockAvailableVoices, 'hi');

    expect(voiceHiCustomer?.name).toBe('Microsoft Swara Online (Natural) - Hindi (India)');
    expect(voiceHiCustomer?.name).toBe(voiceHiPlanner?.name);
    expect(voiceHiPlanner?.name).toBe(voiceHiVendor?.name);

    // Marathi (India)
    const voiceMrCustomer = getStandardVoice(mockAvailableVoices, 'mr');
    const voiceMrPlanner = getStandardVoice(mockAvailableVoices, 'mr');
    const voiceMrVendor = getStandardVoice(mockAvailableVoices, 'mr');

    expect(voiceMrCustomer?.name).toBe('Microsoft Aarohi Online (Natural) - Marathi (India)');
    expect(voiceMrCustomer?.name).toBe(voiceMrPlanner?.name);
    expect(voiceMrPlanner?.name).toBe(voiceMrVendor?.name);
  });

  // =========================================================================
  // 3. TEST ENGLISH SPEECH AT 0.85x SPEED
  // =========================================================================
  it('Requirement 3: English speech uses 0.85x speed, natural pitch (1.0), and en-IN locale', () => {
    speakStandardText(SAMPLE_SENTENCE_EN, 'en');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance).not.toBeNull();
    expect(capturedUtterance!.text).toBe(SAMPLE_SENTENCE_EN);
    expect(capturedUtterance!.rate).toBe(0.85);
    expect(capturedUtterance!.pitch).toBe(1.0);
    expect(capturedUtterance!.volume).toBe(1.0);
    expect(capturedUtterance!.lang).toBe('en-IN');
    expect(capturedUtterance!.voice?.name).toBe(
      'Microsoft Neerja Online (Natural) - English (India)'
    );
  });

  // =========================================================================
  // 4. TEST HINDI SPEECH AT 0.85x SPEED
  // =========================================================================
  it('Requirement 4: Hindi speech uses 0.85x speed, natural pitch (1.0), and hi-IN locale', () => {
    speakStandardText(SAMPLE_SENTENCE_HI, 'hi');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance).not.toBeNull();
    expect(capturedUtterance!.text).toBe(SAMPLE_SENTENCE_HI);
    expect(capturedUtterance!.rate).toBe(0.85);
    expect(capturedUtterance!.pitch).toBe(1.0);
    expect(capturedUtterance!.volume).toBe(1.0);
    expect(capturedUtterance!.lang).toBe('hi-IN');
    expect(capturedUtterance!.voice?.name).toBe(
      'Microsoft Swara Online (Natural) - Hindi (India)'
    );
  });

  // =========================================================================
  // 5. TEST MARATHI SPEECH AT 0.85x SPEED
  // =========================================================================
  it('Requirement 5: Marathi speech uses 0.85x speed, natural pitch (1.0), and mr-IN locale', () => {
    speakStandardText(SAMPLE_SENTENCE_MR, 'mr');

    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance).not.toBeNull();
    expect(capturedUtterance!.text).toBe(SAMPLE_SENTENCE_MR);
    expect(capturedUtterance!.rate).toBe(0.85);
    expect(capturedUtterance!.pitch).toBe(1.0);
    expect(capturedUtterance!.volume).toBe(1.0);
    expect(capturedUtterance!.lang).toBe('mr-IN');
    expect(capturedUtterance!.voice?.name).toBe(
      'Microsoft Aarohi Online (Natural) - Marathi (India)'
    );
  });

  // =========================================================================
  // 6. AUDIO STUTTER PREVENTION & INTERRUPTION
  // =========================================================================
  it('Requirement 6: Immediately cancels ongoing speech before starting new speech to prevent stutter', () => {
    speakStandardText(SAMPLE_SENTENCE_EN, 'en');
    expect(mockCancel).toHaveBeenCalledTimes(1);

    stopStandardSpeaking();
    expect(mockCancel).toHaveBeenCalledTimes(2);
  });

  // =========================================================================
  // 7. CUSTOMER VOICE ASSISTANT (PLAN AN EVENT -> EVENT DIRECTORY) SPEAKS AT 0.85x
  // =========================================================================
  it('Requirement 7: CustomerVoiceAssistant in Plan an Event -> Event Directory speaks at 0.85x', () => {
    const onCommandParsedMock = vi.fn();

    const { getByPlaceholderText, getByRole } = render(
      <CustomerVoiceAssistant activeEvent={mockEvent} onCommandParsed={onCommandParsedMock} />
    );

    const input = getByPlaceholderText(/Speak or type/i);
    expect(input).toBeDefined();

    // Type a query
    fireEvent.change(input, { target: { value: 'Show catering vendors in Baner' } });
    const sendButton = getByRole('button', { name: /ask/i });
    fireEvent.click(sendButton);

    // Spoken response must be triggered with 0.85 rate
    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance!.rate).toBe(0.85);
    expect(capturedUtterance!.pitch).toBe(1.0);
  });

  // =========================================================================
  // 8. PLANNER VOICE ASSISTANT SPEAKS AT 0.85x WITH SAME VOICE
  // =========================================================================
  it('Requirement 8: PlannerVoiceAssistant speaks at 0.85x with matching voice', () => {
    const onCommandParsedMock = vi.fn();

    const { getByTestId } = render(
      <PlannerVoiceAssistant activeEvent={mockEvent} onCommandParsed={onCommandParsedMock} />
    );

    const input = getByTestId('planner-message-input');
    fireEvent.change(input, { target: { value: 'Show photographers in Pune' } });

    const sendBtn = getByTestId('planner-send-button');
    fireEvent.click(sendBtn);

    expect(mockSpeak).toHaveBeenCalled();
    expect(capturedUtterance!.rate).toBe(0.85);
    expect(capturedUtterance!.pitch).toBe(1.0);
    expect(capturedUtterance!.lang).toBe('en-IN');
  });
});
