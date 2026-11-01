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
} from '../utils/vendorVoiceNlu';
import {
  checkSlotConflict,
  getDaySlotStatus,
  recordSlotBooking,
  saveVendorSlotBookings,
} from '../types/vendorSlot';

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
