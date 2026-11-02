import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  detectEventCategory,
  processEventCreationTurn,
  createInitialDraft,
  EventCreationDraft,
  OPENING_AI_MESSAGE,
  REVIEW_READY_MESSAGE,
} from '@/utils/aiEventCreationEngine';
import { CreateEventAIModal } from '@/components/planner/CreateEventAIModal';
import * as supabaseData from '@/lib/supabaseData';
import { WEDORA_VOICE_CONFIG } from '@/utils/sharedVoiceConfig';

describe('WEDORA — SMART AI-POWERED EVENT CREATION FOR EVENT ORGANIZERS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // Test A — Wedding
  // =========================================================================
  it('Test A — Wedding: Guides organizer through wedding-specific details up to review', () => {
    let draft = createInitialDraft();

    // 1. Initial greeting
    expect(OPENING_AI_MESSAGE).toContain("Tell me, what kind of event are you planning?");

    // 2. Event type
    let turn = processEventCreationTurn("I'm planning a wedding.", draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.category).toBe('wedding');
    expect(turn.aiSpeechResponse).toContain("What is the bride's name?");

    // 3. Bride's name
    turn = processEventCreationTurn('Priya Kulkarni', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.brideName).toBe('Priya Kulkarni');
    expect(turn.aiSpeechResponse).toContain("What is the groom's name?");

    // 4. Groom's name
    turn = processEventCreationTurn('Rohan Deshmukh', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.groomName).toBe('Rohan Deshmukh');
    expect(turn.aiSpeechResponse).toContain('What is the planned wedding date?');

    // 5. Date
    turn = processEventCreationTurn('18 December 2026', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.eventDate).toBe('2026-12-18');
    expect(turn.aiSpeechResponse).toContain('Have you already finalized the venue?');

    // 6. Venue status
    turn = processEventCreationTurn('Not yet', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.venueStatus).toBe('NOT_FINALIZED');
    expect(turn.aiSpeechResponse).toContain('Which city or area would you prefer');

    // 7. Area
    turn = processEventCreationTurn('Baner, Pune', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.area).toBe('Baner');
    expect(draft.city).toBe('Pune');
    expect(turn.aiSpeechResponse).toContain('primary client contact');

    // 8. Primary Client Contact
    turn = processEventCreationTurn('Client contact is Suresh Kulkarni', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.clientName).toBe('Suresh Kulkarni');
    expect(turn.aiSpeechResponse).toContain("What is the client's contact mobile number?");

    // 9. Phone
    turn = processEventCreationTurn('9820011223', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.clientPhone).toContain('9820011223');
    expect(turn.aiSpeechResponse).toContain('Approximately how many guests');

    // 10. Guests
    turn = processEventCreationTurn('500 guests', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.guestCount).toBe(500);
    expect(turn.aiSpeechResponse).toContain('estimated event budget');

    // 11. Budget
    turn = processEventCreationTurn('15 lakhs', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.estimatedBudget).toBe(1500000);
    expect(turn.aiSpeechResponse).toContain('additional functions');

    // 12. Requirements & Final Review
    turn = processEventCreationTurn('Sangeet and Mehendi functions', draft, 'en');
    draft = turn.updatedDraft;
    expect(draft.weddingFunctions).toEqual(['Sangeet', 'Mehendi']);
    expect(draft.progressPercent).toBe(100);
    expect(draft.status).toBe('READY_FOR_REVIEW');
    expect(turn.aiSpeechResponse).toContain(REVIEW_READY_MESSAGE);
  });

  // =========================================================================
  // Test B — Griha Pravesh (Never asks for bride/groom)
  // =========================================================================
  it('Test B — Griha Pravesh: Verifies housewarming questions and NEVER asks for bride/groom', () => {
    let draft = createInitialDraft();

    const turn1 = processEventCreationTurn("I'm planning a Griha Pravesh.", draft, 'en');
    draft = turn1.updatedDraft;
    expect(draft.category).toBe('griha_pravesh');
    expect(draft.eventType).toBe('Griha Pravesh / Housewarming');
    expect(turn1.aiSpeechResponse).toContain("Congratulations on the new home! What is the client's or family name?");

    // Verify it does not ask for bride or groom
    expect(turn1.aiSpeechResponse.toLowerCase()).not.toContain('bride');
    expect(turn1.aiSpeechResponse.toLowerCase()).not.toContain('groom');

    // Provide family name
    const turn2 = processEventCreationTurn('Deshmukh Family', draft, 'en');
    draft = turn2.updatedDraft;
    expect(draft.clientName).toBe('Deshmukh Family');
    expect(turn2.aiSpeechResponse).toContain('date for the Griha Pravesh ceremony');

    // Provide date and property address
    const turn3 = processEventCreationTurn('22 January 2027 at Flat 402, Rohan Mithila, Viman Nagar, Pune', draft, 'en');
    draft = turn3.updatedDraft;
    expect(draft.eventDate).toBe('2027-01-22');
    expect(draft.area).toBe('Viman Nagar');

    // Entire sequence check: bride and groom must never be asked
    expect(turn3.aiSpeechResponse.toLowerCase()).not.toContain('bride');
    expect(turn3.aiSpeechResponse.toLowerCase()).not.toContain('groom');
  });

  // =========================================================================
  // Test C — Baby Shower (Never asks for bride/groom)
  // =========================================================================
  it('Test C — Baby Shower: Verifies celebrant and celebration details without asking wedding questions', () => {
    let draft = createInitialDraft();

    const turn1 = processEventCreationTurn("I'm organizing a baby shower for Neha.", draft, 'en');
    draft = turn1.updatedDraft;
    expect(draft.category).toBe('baby_shower');
    expect(draft.celebrantName).toBe('Neha');
    expect(turn1.aiSpeechResponse.toLowerCase()).not.toContain('groom');
    expect(turn1.aiSpeechResponse).toContain('planned date for the baby shower');

    const turn2 = processEventCreationTurn('5 February 2027 in Baner Pune, 80 guests, budget 2 lakhs', draft, 'en');
    draft = turn2.updatedDraft;
    expect(draft.eventDate).toBe('2027-02-05');
    expect(draft.guestCount).toBe(80);
    expect(draft.estimatedBudget).toBe(200000);
    expect(turn2.aiSpeechResponse.toLowerCase()).not.toContain('bride');
    expect(turn2.aiSpeechResponse.toLowerCase()).not.toContain('groom');
  });

  // =========================================================================
  // Test D — Ganpati Festival (Never asks wedding questions)
  // =========================================================================
  it('Test D — Ganpati: Verifies festival duration, mandap/lighting, and no wedding questions', () => {
    let draft = createInitialDraft();

    const turn1 = processEventCreationTurn('I want to organize a Ganpati celebration.', draft, 'en');
    draft = turn1.updatedDraft;
    expect(draft.category).toBe('ganpati_festival');
    expect(turn1.aiSpeechResponse).toContain('organizer, family, or mandal hosting the Ganpati celebration');
    expect(turn1.aiSpeechResponse.toLowerCase()).not.toContain('bride');
    expect(turn1.aiSpeechResponse.toLowerCase()).not.toContain('groom');

    // Provide mandal and 5-day duration in Kothrud
    const turn2 = processEventCreationTurn('Balaji Mandal in Kothrud, 5-day festival starting 10 September 2026', draft, 'en');
    draft = turn2.updatedDraft;
    expect(draft.mandalOrClientName).toBe('Balaji Mandal');
    expect(draft.area).toBe('Kothrud');
    expect(draft.festivalDurationDays).toBe(5);
    expect(draft.installationDate).toBe('2026-09-10');
    expect(turn2.aiSpeechResponse.toLowerCase()).not.toContain('bride');
  });

  // =========================================================================
  // Test E — Multiple Details in One Message
  // =========================================================================
  it('Test E — Multiple Details in One Message: Extracts 6 fields and skips asking for them again', () => {
    const draft = createInitialDraft();
    const prompt = "I'm planning a wedding for Rohan and Priya on 18 December in Baner, Pune. The budget is ₹15 lakh.";

    const turn = processEventCreationTurn(prompt, draft, 'en');
    const updated = turn.updatedDraft;

    expect(updated.category).toBe('wedding');
    expect(updated.groomName).toBe('Rohan');
    expect(updated.brideName).toBe('Priya');
    expect(updated.eventDate).toBe('2026-12-18');
    expect(updated.area).toBe('Baner');
    expect(updated.city).toBe('Pune');
    expect(updated.estimatedBudget).toBe(1500000);

    // AI must NOT ask for bride, groom, date, area, or budget
    expect(turn.aiSpeechResponse).not.toContain("What is the bride's name?");
    expect(turn.aiSpeechResponse).not.toContain("What is the groom's name?");
    expect(turn.aiSpeechResponse).not.toContain('What is the planned wedding date?');
    expect(turn.aiSpeechResponse).not.toContain('estimated event budget');

    // It asks for the next missing information (e.g. venue status or client contact)
    expect(
      turn.aiSpeechResponse.includes('venue') ||
      turn.aiSpeechResponse.includes('primary client contact')
    ).toBe(true);
  });

  // =========================================================================
  // Test F — Correction
  // =========================================================================
  it('Test F — Correction: Changes earlier date without restarting the conversation', () => {
    let draft = createInitialDraft();
    // Initial multi-detail turn
    draft = processEventCreationTurn(
      'Planning wedding for Rohan and Priya on 18 December 2026 in Baner Pune, budget 15 lakhs',
      draft,
      'en'
    ).updatedDraft;
    expect(draft.eventDate).toBe('2026-12-18');

    // Organizer makes an explicit correction
    const turn = processEventCreationTurn(
      'Actually, change the wedding date to 20 December.',
      draft,
      'en'
    );
    const updated = turn.updatedDraft;

    // Date is updated to 20th
    expect(updated.eventDate).toBe('2026-12-20');
    // Prior details are preserved
    expect(updated.groomName).toBe('Rohan');
    expect(updated.brideName).toBe('Priya');
    expect(updated.area).toBe('Baner');
    expect(updated.estimatedBudget).toBe(1500000);

    // AI acknowledges correction
    expect(turn.aiSpeechResponse).toContain("Understood, I've updated those details");
  });

  // =========================================================================
  // Test G — Voice Interaction & Shared Voice Configuration
  // =========================================================================
  it('Test G — Voice Interaction: Uses shared voice config with 0.85x speaking speed across languages', () => {
    expect(WEDORA_VOICE_CONFIG.speakingRate).toBe(0.85);

    // Test Marathi detection and phrasing
    const mrTurn = processEventCreationTurn(
      'मला गृहप्रवेश करायचा आहे, 22 जानेवारीला विमान नगर मध्ये',
      createInitialDraft(),
      'mr'
    );
    expect(mrTurn.detectedLang).toBe('mr');
    expect(mrTurn.updatedDraft.category).toBe('griha_pravesh');
    expect(mrTurn.aiSpeechResponse).toContain('नवीन घरासाठी अभिनंदन');

    // Test Hindi detection and phrasing
    const hiTurn = processEventCreationTurn(
      'हम शादी की तैयारी कर रहे हैं',
      createInitialDraft(),
      'hi'
    );
    expect(hiTurn.detectedLang).toBe('hi');
    expect(hiTurn.updatedDraft.category).toBe('wedding');
    expect(hiTurn.aiSpeechResponse).toContain('दुल्हन का नाम क्या है');
  });

  // =========================================================================
  // Test H — Supabase Persistence
  // =========================================================================
  it('Test H — Supabase Persistence: Saves event with owner user ID and links client profile', async () => {
    const saveEventSpy = vi.spyOn(supabaseData, 'saveEventToSupabase').mockResolvedValue({
      success: true,
      eventId: 'evt-test-123',
    });
    const saveClientSpy = vi.spyOn(supabaseData, 'saveOrganizerClientToSupabase').mockResolvedValue({
      success: true,
    });

    const onEventCreated = vi.fn();
    render(
      <CreateEventAIModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        organizerUserId="org-user-aditi-456"
      />
    );

    // Fast-fill with prompt
    const input = screen.getByTestId('ai-message-input');
    const sendBtn = screen.getByTestId('ai-send-btn');

    fireEvent.change(input, {
      target: {
        value: 'Wedding for Rohan and Priya on 18 December 2026 in Baner Pune, budget 15 lakhs, 500 guests, phone 9820011223, venue booked Grand Hyatt',
      },
    });
    fireEvent.click(sendBtn);

    // Review card appears
    await waitFor(() => {
      expect(screen.getByTestId('event-review-card')).toBeInTheDocument();
    });

    // Click confirm
    const confirmBtn = screen.getByTestId('confirm-create-event-btn');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(saveEventSpy).toHaveBeenCalledTimes(1);
      expect(saveClientSpy).toHaveBeenCalledTimes(1);
      expect(onEventCreated).toHaveBeenCalledTimes(1);
    });

    // Verify correct organizer ID was passed
    expect(saveEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: expect.stringContaining('Rohan & Priya'),
        city: 'Pune',
        area: 'Baner',
        guestCount: 500,
        estimatedBudget: 1500000,
      }),
      'org-user-aditi-456'
    );
  });

  // =========================================================================
  // Test I — Manual Creation Option B
  // =========================================================================
  it('Test I — Manual Creation: Option B manual entry form functions and persists to Supabase', async () => {
    const saveEventSpy = vi.spyOn(supabaseData, 'saveEventToSupabase').mockResolvedValue({
      success: true,
      eventId: 'evt-manual-1',
    });

    const onEventCreated = vi.fn();
    render(
      <CreateEventAIModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        initialMode="manual"
        organizerUserId="org-user-manual"
      />
    );

    expect(screen.getByTestId('manual-creation-form')).toBeInTheDocument();

    const clientInput = screen.getByTestId('manual-client-name-input');
    const dateInput = screen.getByTestId('manual-event-date-input');
    const submitBtn = screen.getByTestId('manual-submit-btn');

    fireEvent.change(clientInput, { target: { value: 'Amit & Sonali Deshmukh' } });
    fireEvent.change(dateInput, { target: { value: '2026-11-20' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(saveEventSpy).toHaveBeenCalledTimes(1);
      expect(onEventCreated).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Event Created Successfully!')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Test J — Duplicate Prevention (Idempotency)
  // =========================================================================
  it('Test J — Duplicate Prevention: Clicking Confirm & Create Event twice creates only one event', async () => {
    const saveEventSpy = vi.spyOn(supabaseData, 'saveEventToSupabase').mockResolvedValue({
      success: true,
      eventId: 'evt-single-1',
    });

    const onEventCreated = vi.fn();
    render(
      <CreateEventAIModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={onEventCreated}
        organizerUserId="org-user-double-click"
      />
    );

    // Provide complete prompt
    const input = screen.getByTestId('ai-message-input');
    const sendBtn = screen.getByTestId('ai-send-btn');
    fireEvent.change(input, {
      target: {
        value: 'Wedding for Rohan and Priya on 18 December 2026 in Baner Pune, budget 15 lakhs, 500 guests, phone 9820011223, venue booked Grand Hyatt',
      },
    });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-create-event-btn')).toBeInTheDocument();
    });

    const confirmBtn = screen.getByTestId('confirm-create-event-btn');

    // Simulate rapid double click
    fireEvent.click(confirmBtn);
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(saveEventSpy).toHaveBeenCalledTimes(1);
      expect(onEventCreated).toHaveBeenCalledTimes(1);
    });
  });

  // =========================================================================
  // Test K — UI Layout & Control Order
  // =========================================================================
  it('Test K — UI Layout: Dual Entry Point Tabs & Strict Bottom Input Control Order', () => {
    render(
      <CreateEventAIModal
        isOpen={true}
        onClose={vi.fn()}
        onEventCreated={vi.fn()}
      />
    );

    // 1. Dual Entry Point
    expect(screen.getByTestId('tab-create-with-ai')).toBeInTheDocument();
    expect(screen.getByTestId('tab-create-manually')).toBeInTheDocument();
    expect(screen.getByText(/Primary \/ Recommended/i)).toBeInTheDocument();

    // 2. Strict Bottom Input Bar Order: Message Input -> Microphone -> Send
    const bottomBar = screen.getByTestId('ai-bottom-input-bar');
    const children = Array.from(bottomBar.children);

    const inputIdx = children.findIndex((el) => el.getAttribute('data-testid') === 'ai-message-input');
    const micIdx = children.findIndex((el) => el.getAttribute('data-testid') === 'ai-mic-btn');
    const sendIdx = children.findIndex((el) => el.getAttribute('data-testid') === 'ai-send-btn');

    expect(inputIdx).toBe(0);
    expect(micIdx).toBe(1);
    expect(sendIdx).toBe(2);
    expect(inputIdx).toBeLessThan(micIdx);
    expect(micIdx).toBeLessThan(sendIdx);
  });
});

