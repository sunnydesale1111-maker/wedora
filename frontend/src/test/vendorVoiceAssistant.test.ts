import { describe, it, expect } from 'vitest';
import {
  parseVendorVoiceCommand,
  extractDateFromText,
  extractSlotFromText,
  extractGuests,
  extractAmount,
  extractPricePerPlate,
  extractAdditionalCharges,
  calculateQuotation,
  detectLanguage,
  convertSpokenNumberWords,
  normalizeDevanagariNumerals,
  generateVoiceResponse,
  VendorConversationContext,
} from '../utils/vendorVoiceNlu';
import {
  checkSlotConflict,
  getDaySlotStatus,
  recordSlotBooking,
  saveVendorSlotBookings,
} from '../types/vendorSlot';
import {
  getStandardVoice,
} from '../utils/sharedVoiceConfig';

describe('Wedora Vendor Live AI Voice Assistant — Acceptance Tests (Section 8: Tests A to H)', () => {
  // Test A: 500 guests × ₹500 = ₹2,50,000
  it('Test A: 500 guests × ₹500 = ₹2,50,000', () => {
    const cmd = parseVendorVoiceCommand('Create a provisional quotation for 500 guests at ₹500 per plate.');
    expect(cmd.intent).toBe('CREATE_QUOTE');
    expect(cmd.guestCount).toBe(500);
    expect(cmd.pricePerPlate).toBe(500);
    expect(cmd.subtotal).toBe(250000);
    expect(cmd.quotedAmount).toBe(250000);
    expect(cmd.additionalCharges).toBe(0);

    const calc = calculateQuotation({ guestCount: 500, pricePerPlate: 500 });
    expect(calc.subtotal).toBe(250000);
    expect(calc.totalAmount).toBe(250000);

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Feast Catering',
      vendorCategory: 'Catering',
    });
    expect(resp.message).toBe('Your provisional quotation for 500 guests at ₹500 per plate is ₹2,50,000. Would you like to review it?');
  });

  // Test B: 500 guests × ₹1,200 = ₹6,00,000
  it('Test B: 500 guests × ₹1,200 = ₹6,00,000', () => {
    const cmd = parseVendorVoiceCommand('Create a provisional quotation for 500 guests at ₹1,200 per plate.');
    expect(cmd.intent).toBe('CREATE_QUOTE');
    expect(cmd.guestCount).toBe(500);
    expect(cmd.pricePerPlate).toBe(1200);
    expect(cmd.subtotal).toBe(600000);
    expect(cmd.quotedAmount).toBe(600000);

    const calc = calculateQuotation({ guestCount: 500, pricePerPlate: 1200 });
    expect(calc.subtotal).toBe(600000);
    expect(calc.totalAmount).toBe(600000);

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Feast Catering',
      vendorCategory: 'Catering',
    });
    expect(resp.message).toBe('Your provisional quotation for 500 guests at ₹1,200 per plate is ₹6,00,000. Would you like to review it?');
  });

  // Test C: Check availability for 15 December 2026. Query that date only.
  it('Test C: Check availability for 15 December 2026. Query that date only.', () => {
    const cmd = parseVendorVoiceCommand('Check my availability for 15 December 2026.');
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.date).toBe('2026-12-15');
    expect(cmd.needsClarification).toBeFalsy();

    // Querying slot status specifically for 2026-12-15
    const slotStatus = getDaySlotStatus('test-vendor-voice-01', '2026-12-15');
    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Feast Catering',
      vendorCategory: 'Catering',
      firstHalfBooked: slotStatus.firstHalfBooked,
      secondHalfBooked: slotStatus.secondHalfBooked,
    });
    expect(resp.message).toContain('15 December 2026');
    expect(resp.message).not.toContain('14 December');
    expect(resp.message).not.toContain('16 December');

    // Also verify relative date resolution (timezone Asia/Kolkata: 2026-11-01)
    const refDate = new Date('2026-11-01T21:48:55+05:30');
    expect(extractDateFromText('Check availability tomorrow', refDate)).toBe('2026-11-02');
    expect(extractDateFromText('Check availability for next Friday', refDate)).toBe('2026-11-06');
  });

  // Test D: Create a new quotation after a previous quotation with different guest counts and prices. Do not reuse old values.
  it('Test D: Create a new quotation after a previous quotation with different guest counts and prices. Do not reuse old values.', () => {
    // 1. Previous quotation: 300 guests at ₹800
    const prevCmd = parseVendorVoiceCommand('Create a provisional quotation for 300 guests at ₹800 per plate.');
    expect(prevCmd.guestCount).toBe(300);
    expect(prevCmd.pricePerPlate).toBe(800);
    expect(prevCmd.subtotal).toBe(240000);

    // 2. New quotation: 500 guests at ₹500
    const newCmd = parseVendorVoiceCommand('Create a provisional quotation for 500 guests at ₹500 per plate.');
    expect(newCmd.guestCount).toBe(500);
    expect(newCmd.pricePerPlate).toBe(500);
    expect(newCmd.subtotal).toBe(250000);
    expect(newCmd.quotedAmount).toBe(250000);

    // Ensure completely isolated and independent: does NOT leak old values (300 or 800)
    expect(newCmd.guestCount).not.toBe(prevCmd.guestCount);
    expect(newCmd.pricePerPlate).not.toBe(prevCmd.pricePerPlate);
    expect(newCmd.subtotal).not.toBe(prevCmd.subtotal);
  });

  // Test E: Repeat the calculation request in Hindi and Marathi. Return the same numerical result.
  it('Test E: Repeat the calculation request in Hindi and Marathi. Return the same numerical result.', () => {
    // English result: 500 × ₹500 = ₹2,50,000
    const enCmd = parseVendorVoiceCommand('Create a provisional quotation for 500 guests at ₹500 per plate.');
    expect(enCmd.subtotal).toBe(250000);
    expect(enCmd.quotedAmount).toBe(250000);

    // Hindi: 500 मेहमानों का ₹500 प्रति प्लेट के हिसाब से कोटेशन बनाओ
    const hiCmd = parseVendorVoiceCommand('500 मेहमानों का ₹500 प्रति प्लेट के हिसाब से कोटेशन बनाओ');
    expect(hiCmd.intent).toBe('CREATE_QUOTE');
    expect(hiCmd.detectedLang).toBe('hi');
    expect(hiCmd.guestCount).toBe(500);
    expect(hiCmd.pricePerPlate).toBe(500);
    expect(hiCmd.subtotal).toBe(250000);
    expect(hiCmd.quotedAmount).toBe(250000);

    const hiResp = generateVoiceResponse(hiCmd, {
      vendorBusinessName: 'रॉयल कैटरर्स',
      vendorCategory: 'कैटरिंग',
    });
    expect(hiResp.message).toContain('₹2,50,000');
    expect(hiResp.message).toBe('500 मेहमानों का ₹500 प्रति प्लेट के हिसाब से आपका प्रोविज़नल कोटेशन ₹2,50,000 है। क्या आप इसकी समीक्षा करना चाहते हैं?');

    // Marathi: 500 पाहुण्यांसाठी ₹500 प्रति प्लेट प्रमाणे कोटेशन बनवा
    const mrCmd = parseVendorVoiceCommand('500 पाहुण्यांसाठी ₹500 प्रति प्लेट प्रमाणे कोटेशन बनवा');
    expect(mrCmd.intent).toBe('CREATE_QUOTE');
    expect(mrCmd.detectedLang).toBe('mr');
    expect(mrCmd.guestCount).toBe(500);
    expect(mrCmd.pricePerPlate).toBe(500);
    expect(mrCmd.subtotal).toBe(250000);
    expect(mrCmd.quotedAmount).toBe(250000);

    const mrResp = generateVoiceResponse(mrCmd, {
      vendorBusinessName: 'शाही मेजवानी',
      vendorCategory: 'केटरिंग',
    });
    expect(mrResp.message).toContain('₹2,50,000');
    expect(mrResp.message).toBe('500 पाहुण्यांसाठी ₹500 प्रति प्लेट प्रमाणे तुमचे तात्पुरते कोटेशन ₹2,50,000 आहे. आपण याची तपासणी करू इच्छिता का?');

    // Spoken number words in Marathi and Hindi also yield the exact same numerical calculation:
    const mrSpoken = parseVendorVoiceCommand('पाचशे पाहुणे पाचशे रुपये प्रति प्लेट प्रमाणे कोटेशन बनवा');
    expect(mrSpoken.guestCount).toBe(500);
    expect(mrSpoken.pricePerPlate).toBe(500);
    expect(mrSpoken.subtotal).toBe(250000);

    const hiSpoken = parseVendorVoiceCommand('पाँच सौ मेहमान पाँच सौ प्रति प्लेट कोटेशन बनाओ');
    expect(hiSpoken.guestCount).toBe(500);
    expect(hiSpoken.pricePerPlate).toBe(500);
    expect(hiSpoken.subtotal).toBe(250000);
  });

  // Test F: Request a First Half booking and ensure the Second Half is not automatically booked.
  it('Test F: Request a First Half booking and ensure the Second Half is not automatically booked.', () => {
    const TEST_VENDOR = 'test-vendor-slot-f';
    const TEST_DATE = '2026-12-25';

    // Clear initial state
    saveVendorSlotBookings(TEST_VENDOR, {});

    const cmd = parseVendorVoiceCommand('Book First Half on 25 December 2026');
    expect(cmd.intent).toBe('BOOK_SLOT');
    expect(cmd.slot).toBe('FIRST_HALF');
    expect(cmd.date).toBe(TEST_DATE);

    // Verify initial slots are open
    const initialStatus = getDaySlotStatus(TEST_VENDOR, TEST_DATE);
    expect(initialStatus.firstHalfBooked).toBe(false);
    expect(initialStatus.secondHalfBooked).toBe(false);

    // Book ONLY First Half
    recordSlotBooking(TEST_VENDOR, {
      vendorId: TEST_VENDOR,
      date: TEST_DATE,
      slot: 'FIRST_HALF',
      eventName: 'Morning Haldi',
      clientName: 'Sharma Family',
    });

    const updatedStatus = getDaySlotStatus(TEST_VENDOR, TEST_DATE);
    expect(updatedStatus.firstHalfBooked).toBe(true);
    // Explicit assertion: Second Half must NOT be automatically booked!
    expect(updatedStatus.secondHalfBooked).toBe(false);
    expect(updatedStatus.overallStatus).toBe('First Half Booked');

    // Verify Second Half can still be booked independently without conflict
    const conflictSecond = checkSlotConflict(TEST_VENDOR, TEST_DATE, 'SECOND_HALF');
    expect(conflictSecond.hasConflict).toBe(false);
  });

  // Test G: If the spoken guest count is unclear, request confirmation instead of inventing a value.
  it('Test G: If the spoken guest count is unclear, request confirmation instead of inventing a value.', () => {
    // Command specifies price per plate, but guest count is missing / unclear
    const unclearCmd = parseVendorVoiceCommand('Create a provisional quotation at ₹500 per plate.');
    expect(unclearCmd.intent).toBe('NEED_CLARIFICATION');
    expect(unclearCmd.missingField).toBe('guestCount');
    expect(unclearCmd.guestCount).toBeUndefined();
    expect(unclearCmd.clarificationPrompt).toBe('Could you please confirm the exact guest count for the quotation?');

    // In Hindi
    const unclearHi = parseVendorVoiceCommand('₹500 प्रति प्लेट का कोटेशन बनाओ');
    expect(unclearHi.intent).toBe('NEED_CLARIFICATION');
    expect(unclearHi.clarificationPrompt).toBe('कृपया कोटेशन के लिए सटीक मेहमान संख्या बताएं।');

    // In Marathi
    const unclearMr = parseVendorVoiceCommand('₹500 प्रति प्लेट कोटेशन बनवा');
    expect(unclearMr.intent).toBe('NEED_CLARIFICATION');
    expect(unclearMr.clarificationPrompt).toBe('कृपया कोटेशनसाठी पाहुण्यांची अचूक संख्या सांगा.');
  });

  // Test H: Confirm that no quotation is sent and no booking is finalized without explicit vendor approval.
  it('Test H: Confirm that no quotation is sent and no booking is finalized without explicit vendor approval.', () => {
    const TEST_VENDOR = 'test-vendor-safe-h';
    const TEST_DATE = '2026-12-27';
    saveVendorSlotBookings(TEST_VENDOR, {});

    // 1. Voice command parsed
    const quoteCmd = parseVendorVoiceCommand('Create a provisional quotation for 500 guests at ₹500 per plate.');
    expect(quoteCmd.intent).toBe('CREATE_QUOTE');

    // Proposed quotation is ONLY a provisional draft, not dispatched automatically
    expect(quoteCmd.quotedAmount).toBe(250000);

    // 2. Booking command parsed
    const bookCmd = parseVendorVoiceCommand('Book First Half on 27 December 2026');
    expect(bookCmd.intent).toBe('BOOK_SLOT');

    // Check before explicit booking confirmation: Calendar remains unbooked
    const preConfirmStatus = getDaySlotStatus(TEST_VENDOR, TEST_DATE);
    expect(preConfirmStatus.firstHalfBooked).toBe(false);
    expect(preConfirmStatus.secondHalfBooked).toBe(false);

    // Only when explicit approval occurs is the booking finalized:
    recordSlotBooking(TEST_VENDOR, {
      vendorId: TEST_VENDOR,
      date: TEST_DATE,
      slot: bookCmd.slot!,
      eventName: 'Vendor Confirmed Event',
      clientName: 'Client Confirmed',
    });

    const postConfirmStatus = getDaySlotStatus(TEST_VENDOR, TEST_DATE);
    expect(postConfirmStatus.firstHalfBooked).toBe(true);
  });
});

describe('Wedora Vendor Live AI Voice Assistant — Multilingual Parsing & Spoken Numbers', () => {
  it('1. Converts spoken number words accurately in Marathi, Hindi, and English', () => {
    expect(convertSpokenNumberWords('पाचशे पाहुणे पाचशे रुपये')).toBe('500 पाहुणे 500 रुपये');
    expect(convertSpokenNumberWords('पाँच सौ मेहमान बारह सौ प्रति प्लेट')).toBe('500 मेहमान 1200 प्रति प्लेट');
    expect(convertSpokenNumberWords('three hundred guests at eight hundred per plate')).toBe('300 guests at 800 per plate');
  });

  it('2. Extracts all 12 calendar months and ISO formats accurately', () => {
    expect(extractDateFromText('15 Jan 2027')).toBe('2027-01-15');
    expect(extractDateFromText('22 March 2026')).toBe('2026-03-22');
    expect(extractDateFromText('10 ऑक्टोबर 2026')).toBe('2026-10-10');
    expect(extractDateFromText('2026-12-15')).toBe('2026-12-15');
  });
});

describe('Wedora AI Voice Assistant Consistency & Multilingual Acceptance Tests (Part 7: 10 Cases)', () => {
  const refDate = new Date('2026-11-01T21:48:55+05:30');

  // Case 1: "Check my availability on 18th December."
  it('Case 1: "Check my availability on 18th December."', () => {
    const cmd = parseVendorVoiceCommand('Check my availability on 18th December.', 'en', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('en');
    expect(cmd.date).toBe('2026-12-18');
    expect(cmd.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Grand Banquet',
      vendorCategory: 'Banquet Hall',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain("Sure, I'll check your availability for 18 December 2026.");
    expect(resp.message).toContain('both First Half and Second Half slots are available');
  });

  // Case 2: "Check my availability for December 18."
  it('Case 2: "Check my availability for December 18."', () => {
    const cmd = parseVendorVoiceCommand('Check my availability for December 18.', 'en', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('en');
    expect(cmd.date).toBe('2026-12-18');
    expect(cmd.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Grand Banquet',
      vendorCategory: 'Banquet Hall',
      firstHalfBooked: true,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain('18 December 2026');
    expect(resp.message).toContain('First Half is booked, but Second Half is available');
  });

  // Case 3: "18 दिसंबर को मेरी उपलब्धता चेक करो।"
  it('Case 3: "18 दिसंबर को मेरी उपलब्धता चेक करो।"', () => {
    const cmd = parseVendorVoiceCommand('18 दिसंबर को मेरी उपलब्धता चेक करो।', 'hi', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('hi');
    expect(cmd.date).toBe('2026-12-18');
    expect(cmd.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'रॉयल ग्रैंड',
      vendorCategory: 'बैंक्वेट',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain('ज़रूर, मैं 18 दिसंबर 2026 की उपलब्धता चेक करता हूँ।');
    expect(resp.message).toContain('आपके दोनों स्लॉट्स (फर्स्ट हाफ और सेकंड हाफ) उपलब्ध हैं।');
  });

  // Case 4: "१८ डिसेंबरला माझी उपलब्धता तपासा."
  it('Case 4: "१८ डिसेंबरला माझी उपलब्धता तपासा."', () => {
    const cmd = parseVendorVoiceCommand('१८ डिसेंबरला माझी उपलब्धता तपासा.', 'mr', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('mr');
    expect(cmd.date).toBe('2026-12-18');
    expect(cmd.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'रॉयल मेजवानी',
      vendorCategory: 'केटरिंग',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain('नक्की, मी 18 डिसेंबर 2026 ची उपलब्धता तपासतो.');
    expect(resp.message).toContain('तुमचे दोन्ही स्लॉट (फर्स्ट हाफ व सेकंड हाफ) उपलब्ध आहेत.');
  });

  // Case 5: "माझी availability 18 December ला check करा."
  it('Case 5: "माझी availability 18 December ला check करा."', () => {
    const cmd = parseVendorVoiceCommand('माझी availability 18 December ला check करा.', 'en', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('mr');
    expect(cmd.date).toBe('2026-12-18');
    expect(cmd.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'रॉयल मेजवानी',
      vendorCategory: 'केटरिंग',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain('नक्की, मी 18 डिसेंबर 2026 ची उपलब्धता तपासतो.');
  });

  // Case 6: "Check my availability tomorrow."
  it('Case 6: "Check my availability tomorrow."', () => {
    const cmd = parseVendorVoiceCommand('Check my availability tomorrow.', 'en', refDate);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.detectedLang).toBe('en');
    expect(cmd.date).toBe('2026-11-02'); // refDate is 2026-11-01
  });

  // Case 7: "Actually, check 19th December instead."
  it('Case 7: "Actually, check 19th December instead."', () => {
    // Context prior state was 18th December
    const priorContext: VendorConversationContext = {
      role: 'VENDOR',
      detectedLang: 'en',
      intent: 'CHECK_AVAILABILITY',
      date: '2026-12-18',
    };

    const cmd = parseVendorVoiceCommand('Actually, check 19th December instead.', 'en', refDate, priorContext);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.date).toBe('2026-12-19'); // Overrides 18th December
    expect(cmd.date).not.toBe(priorContext.date);
  });

  // Case 8: English request followed by Hindi clarification.
  it('Case 8: English request followed by Hindi clarification.', () => {
    // Step 1: English request establishes context
    const step1 = parseVendorVoiceCommand('Check my availability on 18th December.', 'en', refDate);
    expect(step1.intent).toBe('CHECK_AVAILABILITY');
    expect(step1.date).toBe('2026-12-18');
    expect(step1.detectedLang).toBe('en');

    const contextAfterStep1: VendorConversationContext = {
      role: 'VENDOR',
      detectedLang: step1.detectedLang,
      intent: step1.intent,
      date: step1.date,
    };

    // Step 2: Follow-up question in Hindi without restating date
    const step2 = parseVendorVoiceCommand('क्या पहला स्लॉट खाली है?', 'hi', refDate, contextAfterStep1);
    expect(step2.detectedLang).toBe('hi');
    expect(step2.intent).toBe('CHECK_AVAILABILITY');
    expect(step2.date).toBe('2026-12-18'); // Retained from context
    expect(step2.slot).toBe('FIRST_HALF');
    expect(step2.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(step2, {
      vendorBusinessName: 'रॉयल कैटरर्स',
      vendorCategory: 'कैटरिंग',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain('ज़रूर, मैं 18 दिसंबर 2026 की उपलब्धता चेक करता हूँ।');
  });

  // Case 9: Marathi request followed by English clarification.
  it('Case 9: Marathi request followed by English clarification.', () => {
    // Step 1: Marathi request establishes context
    const step1 = parseVendorVoiceCommand('१८ डिसेंबरला माझी उपलब्धता तपासा.', 'mr', refDate);
    expect(step1.intent).toBe('CHECK_AVAILABILITY');
    expect(step1.date).toBe('2026-12-18');
    expect(step1.detectedLang).toBe('mr');

    const contextAfterStep1: VendorConversationContext = {
      role: 'VENDOR',
      detectedLang: step1.detectedLang,
      intent: step1.intent,
      date: step1.date,
    };

    // Step 2: Follow-up question in English without restating date
    const step2 = parseVendorVoiceCommand('What about the afternoon slot?', 'en', refDate, contextAfterStep1);
    expect(step2.detectedLang).toBe('en');
    expect(step2.intent).toBe('CHECK_AVAILABILITY');
    expect(step2.date).toBe('2026-12-18'); // Retained from context
    expect(step2.slot).toBe('SECOND_HALF');
    expect(step2.needsClarification).toBeFalsy();

    const resp = generateVoiceResponse(step2, {
      vendorBusinessName: 'Royal Catering',
      vendorCategory: 'Catering',
      firstHalfBooked: false,
      secondHalfBooked: false,
    });
    expect(resp.message).toContain("Sure, I'll check your availability for 18 December 2026.");
  });

  // Case 10: Repeated follow-up without restating the date.
  it('Case 10: Repeated follow-up without restating the date.', () => {
    const establishedContext: VendorConversationContext = {
      role: 'VENDOR',
      detectedLang: 'en',
      intent: 'CHECK_AVAILABILITY',
      date: '2026-12-18',
    };

    // User asks to check availability again without repeating "18th December"
    const cmd = parseVendorVoiceCommand('Check my availability again please.', 'en', refDate, establishedContext);
    expect(cmd.intent).toBe('CHECK_AVAILABILITY');
    expect(cmd.date).toBe('2026-12-18'); // Context retained, does NOT ask "On which date...?"
    expect(cmd.needsClarification).toBeFalsy();

    // Query backend slot database for authenticated vendor
    const slotStatus = getDaySlotStatus('test-vendor-case-10', '2026-12-18');
    const resp = generateVoiceResponse(cmd, {
      vendorBusinessName: 'Royal Grand Banquet',
      vendorCategory: 'Banquet Hall',
      firstHalfBooked: slotStatus.firstHalfBooked,
      secondHalfBooked: slotStatus.secondHalfBooked,
    });
    expect(resp.message).toContain('18 December 2026');
  });

  // Part 1 Voice Consistency Standard Test
  it('Voice Consistency: Verifies shared voice configuration prioritizes Indian English, Hindi, and Marathi', () => {
    const mockVoices: SpeechSynthesisVoice[] = [
      { name: 'Microsoft David', lang: 'en-US', default: true, localService: true, voiceURI: 'david' },
      { name: 'Microsoft Ravi', lang: 'en-IN', default: false, localService: true, voiceURI: 'ravi' },
      { name: 'Microsoft Kalpana', lang: 'hi-IN', default: false, localService: true, voiceURI: 'kalpana' },
    ];

    const voiceEn = getStandardVoice(mockVoices, 'en');
    expect(voiceEn?.name).toBe('Microsoft Ravi'); // Standardized en-IN over en-US

    const voiceHi = getStandardVoice(mockVoices, 'hi');
    expect(voiceHi?.name).toBe('Microsoft Kalpana'); // Authentic hi-IN
  });
});

describe('WEDORA — VENDOR AI ASSISTANT: QUOTATIONS, AVAILABILITY & CONVERSATION ACCURACY (Section 9 Acceptance Tests)', () => {
  const refDate = new Date('2026-11-01T21:48:55+05:30');

  // 1. Deterministic Calculation Test Cases
  describe('Requirement 1 & 2: Deterministic Calculations & Test Cases', () => {
    it('Case 1: 500 guests × ₹1,200 = ₹6,00,000', () => {
      const calc = calculateQuotation({ guestCount: 500, pricePerPlate: 1200 });
      expect(calc.subtotal).toBe(600000);
      expect(calc.totalAmount).toBe(600000);
      expect(calc.formula).toBe('Subtotal = 500 × ₹1,200 = ₹6,00,000');

      const cmd = parseVendorVoiceCommand('Quote for 500 guests at ₹1,200 per plate.');
      expect(cmd.intent).toBe('CREATE_QUOTE');
      expect(cmd.guestCount).toBe(500);
      expect(cmd.pricePerPlate).toBe(1200);
      expect(cmd.quotedAmount).toBe(600000);

      const resp = generateVoiceResponse(cmd, {
        vendorBusinessName: 'Royal Feast Catering',
        vendorCategory: 'Catering',
      });
      expect(resp.message).toBe('Your provisional quotation for 500 guests at ₹1,200 per plate is ₹6,00,000. Would you like to review it?');
    });

    it('Case 2: 500 guests × ₹500 = ₹2,50,000', () => {
      const calc = calculateQuotation({ guestCount: 500, pricePerPlate: 500 });
      expect(calc.subtotal).toBe(250000);
      expect(calc.totalAmount).toBe(250000);

      const cmd = parseVendorVoiceCommand('500 guests at 500 per plate');
      expect(cmd.guestCount).toBe(500);
      expect(cmd.pricePerPlate).toBe(500);
      expect(cmd.quotedAmount).toBe(250000);
    });

    it('Case 3: 300 guests × ₹700 = ₹2,10,000', () => {
      const calc = calculateQuotation({ guestCount: 300, pricePerPlate: 700 });
      expect(calc.subtotal).toBe(210000);
      expect(calc.totalAmount).toBe(210000);

      const cmd = parseVendorVoiceCommand('Calculate quotation for 300 guests at ₹700 per plate');
      expect(cmd.intent).toBe('CREATE_QUOTE');
      expect(cmd.guestCount).toBe(300);
      expect(cmd.pricePerPlate).toBe(700);
      expect(cmd.quotedAmount).toBe(210000);

      const resp = generateVoiceResponse(cmd, {
        vendorBusinessName: 'Royal Feast Catering',
        vendorCategory: 'Catering',
      });
      expect(resp.message).toBe('Your provisional quotation for 300 guests at ₹700 per plate is ₹2,10,000. Would you like to review it?');
    });

    it('Case 4: 600 guests × ₹800 = ₹4,80,000', () => {
      const calc = calculateQuotation({ guestCount: 600, pricePerPlate: 800 });
      expect(calc.subtotal).toBe(480000);
      expect(calc.totalAmount).toBe(480000);

      const cmd = parseVendorVoiceCommand('600 guests at 800 per plate quotation');
      expect(cmd.intent).toBe('CREATE_QUOTE');
      expect(cmd.guestCount).toBe(600);
      expect(cmd.pricePerPlate).toBe(800);
      expect(cmd.quotedAmount).toBe(480000);
    });
  });

  // 2. Spoken and Transliterated Numbers
  describe('Requirement 3: Spoken & Transliterated Multilingual Expressions', () => {
    it('"500 people, 500 rupees per plate" extracts accurately', () => {
      const cmd = parseVendorVoiceCommand('500 people, 500 rupees per plate');
      expect(cmd.guestCount).toBe(500);
      expect(cmd.pricePerPlate).toBe(500);
      expect(cmd.quotedAmount).toBe(250000);
    });

    it('"500 log hain aur per plate 800 rupaye hai" extracts accurately', () => {
      const cmd = parseVendorVoiceCommand('500 log hain aur per plate 800 rupaye hai');
      expect(cmd.guestCount).toBe(500);
      expect(cmd.pricePerPlate).toBe(800);
      expect(cmd.quotedAmount).toBe(400000);
    });

    it('"300 lok aahet ani pratyek plate 700 rupaye aahe" extracts accurately', () => {
      const cmd = parseVendorVoiceCommand('300 lok aahet ani pratyek plate 700 rupaye aahe');
      expect(cmd.guestCount).toBe(300);
      expect(cmd.pricePerPlate).toBe(700);
      expect(cmd.quotedAmount).toBe(210000);
    });
  });

  // 3. Live Corrections without Losing Context
  describe('Requirement 4: Live Corrections during Conversation', () => {
    it('Updates guest count to 600, recalculates with existing ₹800 rate = ₹4,80,000 without asking for rate again', () => {
      // Step 1: Initial quote established
      const step1 = parseVendorVoiceCommand('500 log hain aur per plate 800 rupaye hai');
      expect(step1.guestCount).toBe(500);
      expect(step1.pricePerPlate).toBe(800);
      expect(step1.quotedAmount).toBe(400000);

      const contextAfterStep1: VendorConversationContext = {
        role: 'VENDOR',
        detectedLang: step1.detectedLang,
        intent: 'CREATE_QUOTE',
        guestCount: step1.guestCount,
        pricePerPlate: step1.pricePerPlate,
        quotedAmount: step1.quotedAmount,
      };

      // Step 2: Vendor correction
      const step2 = parseVendorVoiceCommand('Actually, the guest count is 600', 'en', refDate, contextAfterStep1);
      expect(step2.intent).toBe('CREATE_QUOTE');
      expect(step2.guestCount).toBe(600);
      expect(step2.pricePerPlate).toBe(800); // Retained from context!
      expect(step2.quotedAmount).toBe(480000); // 600 × 800 = 4,80,000!

      const resp = generateVoiceResponse(step2, {
        vendorBusinessName: 'Royal Feast Catering',
        vendorCategory: 'Catering',
      });
      expect(resp.message).toBe('Your provisional quotation for 600 guests at ₹800 per plate is ₹4,80,000. Would you like to review it?');
    });

    it('Prompts for rate when guest count is provided; prompts for guest count when rate is provided', () => {
      // Only guest count provided
      const missingRate = parseVendorVoiceCommand('Create a quote for 500 guests');
      expect(missingRate.intent).toBe('NEED_CLARIFICATION');
      expect(missingRate.missingField).toBe('pricePerPlate');
      expect(missingRate.guestCount).toBe(500);

      // Follow-up provides rate
      const filledRate = parseVendorVoiceCommand('₹1,200 per plate', 'en', refDate, {
        intent: 'CREATE_QUOTE',
        missingField: 'pricePerPlate',
        guestCount: 500,
      });
      expect(filledRate.intent).toBe('CREATE_QUOTE');
      expect(filledRate.guestCount).toBe(500);
      expect(filledRate.pricePerPlate).toBe(1200);
      expect(filledRate.quotedAmount).toBe(600000);

      // Only rate provided
      const missingGuests = parseVendorVoiceCommand('Create a quote at ₹1,200 per plate');
      expect(missingGuests.intent).toBe('NEED_CLARIFICATION');
      expect(missingGuests.missingField).toBe('guestCount');

      // Follow-up provides guests
      const filledGuests = parseVendorVoiceCommand('500 guests', 'en', refDate, {
        intent: 'CREATE_QUOTE',
        missingField: 'guestCount',
        pricePerPlate: 1200,
      });
      expect(filledGuests.intent).toBe('CREATE_QUOTE');
      expect(filledGuests.guestCount).toBe(500);
      expect(filledGuests.pricePerPlate).toBe(1200);
      expect(filledGuests.quotedAmount).toBe(600000);
    });
  });

  // 4. Reliable Date & Time-Slot Availability Management
  describe('Requirement 5: Reliable Date & Time-Slot Availability Management', () => {
    it('Outputs exact required availability phrasing for FIRST_HALF and SECOND_HALF', () => {
      // First Half Available
      const checkFirstOpen = parseVendorVoiceCommand('Is my first half on 15 December 2026 available?');
      expect(checkFirstOpen.slot).toBe('FIRST_HALF');
      const respFirstOpen = generateVoiceResponse(checkFirstOpen, {
        vendorBusinessName: 'Royal Banquet',
        vendorCategory: 'Banquet Hall',
        firstHalfBooked: false,
        secondHalfBooked: false,
      });
      expect(respFirstOpen.message).toContain('Your first-half slot on 15 December 2026 is available.');

      // First Half Booked
      const respFirstBooked = generateVoiceResponse(checkFirstOpen, {
        vendorBusinessName: 'Royal Banquet',
        vendorCategory: 'Banquet Hall',
        firstHalfBooked: true,
        secondHalfBooked: false,
      });
      expect(respFirstBooked.message).toContain('Your first-half slot on 15 December 2026 is already booked.');

      // Second Half Available
      const checkSecondOpen = parseVendorVoiceCommand('Check second half on 15 December 2026');
      expect(checkSecondOpen.slot).toBe('SECOND_HALF');
      const respSecondOpen = generateVoiceResponse(checkSecondOpen, {
        vendorBusinessName: 'Royal Banquet',
        vendorCategory: 'Banquet Hall',
        firstHalfBooked: false,
        secondHalfBooked: false,
      });
      expect(respSecondOpen.message).toContain('Your second-half slot on 15 December 2026 is available.');

      // Second Half Booked
      const respSecondBooked = generateVoiceResponse(checkSecondOpen, {
        vendorBusinessName: 'Royal Banquet',
        vendorCategory: 'Banquet Hall',
        firstHalfBooked: false,
        secondHalfBooked: true,
      });
      expect(respSecondBooked.message).toContain('Your second-half slot on 15 December 2026 is already booked.');
    });
  });
});
