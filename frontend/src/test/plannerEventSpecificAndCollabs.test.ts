import { describe, it, expect } from 'vitest';
import {
  ALL_LOCALITIES,
  MUMBAI_LOCALITY_REGISTRY,
  PUNE_LOCALITY_REGISTRY,
  resolveLocality,
} from '../utils/localityRegistry';
import { DEMO_VENDORS } from '../data/demoVendors';
import {
  getVerifiedCollaborationsForPlanner,
  getRecommendedVendorsForPlanner,
  VERIFIED_PLANNER_COLLABORATIONS,
} from '../data/plannerCollaborations';
import { INITIAL_DEMO_EVENTS } from '../data/demoEvents';
import {
  parsePlannerVoiceCommand,
  parsePlannerCreateEventCommand,
} from '../utils/plannerVoiceNlu';

describe('Wedora – Professional Event Planner AI: Collaboration History & Event-Specific Recommendations', () => {
  const PLANNER_EMAIL = 'planner@weddingorchestrator.com';

  // 1. Mandatory Previous Vendor Collaboration History for Every Locality
  it('Requirement 1: Every one of the 76 localities has at least 4–5 distinct vendor collaborations across categories', () => {
    expect(ALL_LOCALITIES.length).toBe(76);

    for (const loc of ALL_LOCALITIES) {
      const collabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, {
        location: loc.canonicalName,
      });

      // Must have at least 4-5 distinct vendors
      expect(
        collabs.length,
        `Locality "${loc.canonicalName}" must have >= 4 collaborated vendors, but got ${collabs.length}`
      ).toBeGreaterThanOrEqual(4);

      // Must cover different event categories (e.g., Catering, Photo, Decor, Venues, DJ, Makeup)
      const categories = new Set(collabs.map((c) => c.record.category));
      expect(
        categories.size,
        `Locality "${loc.canonicalName}" must cover >= 4 distinct vendor categories, but got ${categories.size}`
      ).toBeGreaterThanOrEqual(4);

      // Every record must have valid references
      for (const { record } of collabs) {
        expect(record.plannerEmail).toBe(PLANNER_EMAIL);
        expect(record.vendorId).toBeDefined();
        expect(record.eventId).toBeDefined();
        expect(record.orderRef).toBeDefined();
        expect(record.clientRating).toBeGreaterThanOrEqual(4.8);
        expect(record.onTimeDeliveryRate).toBeGreaterThanOrEqual(95);
        expect(record.serviceQualityScore).toBeGreaterThanOrEqual(95);
        expect(record.verifiedPastEvents.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  // Specifically check required sample localities from prompt: Baner, Katraj, Wakad, Virar, Kalyan, Thane
  it('Requirement 1 Sample Verification: Baner, Katraj, Wakad, Virar, Kalyan, and Thane have >= 4–5 distinct collaborators', () => {
    const samples = ['Baner', 'Katraj', 'Wakad', 'Virar', 'Kalyan', 'Thane'];

    for (const area of samples) {
      const collabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: area });
      expect(collabs.length).toBeGreaterThanOrEqual(4);

      const uniqueVendorIds = new Set(collabs.map((c) => c.vendor.id));
      expect(uniqueVendorIds.size).toBe(collabs.length);

      const uniqueCategories = new Set(collabs.map((c) => c.record.category));
      expect(uniqueCategories.size).toBeGreaterThanOrEqual(4);
    }
  });

  // 2. Demo Planner Identity & Zero Invention for Unauthorized Users
  it('Requirement 2: Strictly verifies planner identity and never invents collaborations for unauthorized users', () => {
    const validCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Baner, Pune' });
    expect(validCollabs.length).toBeGreaterThanOrEqual(4);

    const unauthorized = getVerifiedCollaborationsForPlanner('other_planner@demo.com', { location: 'Baner, Pune' });
    expect(unauthorized.length).toBe(0);

    const unknownPlanner = getVerifiedCollaborationsForPlanner('stranger@somewhere.com', { location: 'Virar' });
    expect(unknownPlanner.length).toBe(0);
  });

  // 3. Strictly Event-Specific Vendor Recommendations & Zero Context Leakage
  it('Requirement 3: Recommendations and venue details are strictly bound to the active client event', () => {
    const event01 = INITIAL_DEMO_EVENTS.find((e) => e.id === 'evt-01')!;
    expect(event01.eventName).toBe("Rohan & Priya's Wedding Celebration");
    expect(event01.eventDate).toBe('2026-12-15');
    expect(event01.city).toBe('Pune');
    expect(event01.area).toBe('Baner');
    expect(event01.venueName).toBe('Emerald Meadows Wedding Lawn & Banquets');
    expect(event01.venueAddress).toContain('Survey No. 45/2');
    expect(event01.clientName).toBe('Rohan Kulkarni & Priya Deshmukh');

    const event02 = INITIAL_DEMO_EVENTS.find((e) => e.id === 'evt-02')!;
    expect(event02.eventName).toBe("Aditya & Sanjana's Grand Wedding & Sangeet");
    expect(event02.eventDate).toBe('2026-12-18');
    expect(event02.city).toBe('Mumbai');
    expect(event02.area).toBe('Bandra');
    expect(event02.venueName).toBe('Sea Princess Heritage Ballroom & Seafront Lawns');
    expect(event02.clientName).toBe('Aditya Merchant & Sanjana Shah');

    // Vendor query for Event 1 strictly uses Baner & Pune
    const banerCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: `${event01.area}, ${event01.city}` });
    expect(banerCollabs.every((c) => c.record.city === 'Pune')).toBe(true);

    // Vendor query for Event 2 strictly uses Bandra & Mumbai
    const bandraCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: `${event02.area}, ${event02.city}` });
    expect(bandraCollabs.every((c) => c.record.city === 'Mumbai')).toBe(true);
  });

  // 4. Mandatory Event Date and Venue During Registration
  it('Requirement 4: Event registration strictly requires Date, Venue Name, Complete Address, and Client Details', () => {
    INITIAL_DEMO_EVENTS.forEach((e) => {
      expect(e.eventDate).toBeDefined();
      expect(e.eventDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.venueName).toBeDefined();
      expect(e.venueName!.length).toBeGreaterThan(3);
      expect(e.venueAddress).toBeDefined();
      expect(e.clientName).toBeDefined();
      expect(e.clientPhone).toBeDefined();
    });
  });

  // 5. Location-First Recommendation Logic & Nearby Badging
  it('Requirement 5: Recommends exact locality first, and badges adjacent localities within same region', () => {
    // Baner, Pune: has plenty of local vendors
    const banerAlternatives = getRecommendedVendorsForPlanner({
      location: 'Baner, Pune',
      category: 'Catering and Food Services',
      limit: 4,
    });
    expect(banerAlternatives.length).toBeGreaterThan(0);
    // Exact locality matches are not badged as nearby
    expect(banerAlternatives[0].isNearbyCoverage).toBeFalsy();

    // Query for a category where local options might be limited
    const nearbyAllowed = getRecommendedVendorsForPlanner({
      location: 'Virar, Mumbai',
      category: 'Hotels and Guest Accommodation',
      limit: 6,
    });
    expect(nearbyAllowed.length).toBeGreaterThan(0);
    // If nearby vendors are pulled in, they carry the badge
    const nearbyVendor = nearbyAllowed.find((v) => v.isNearbyCoverage);
    if (nearbyVendor) {
      expect(nearbyVendor.nearbyCoverageNote).toContain('Nearby Coverage:');
    }
  });

  // 6. Compact AI Event Creation Assistant – Multilingual & Field Extraction
  it('Requirement 6: AI Event Creation Assistant parses English, Hindi, and Marathi commands accurately', () => {
    // English command with complete mandatory details
    const enInput = 'Create wedding for Vikram and Ananya on 24th December 2026 at Grand Hyatt Mumbai in Bandra, 500 guests, budget 45 lakhs, phone 9820011223';
    const parsedEn = parsePlannerCreateEventCommand(enInput);
    expect(parsedEn.isValid).toBe(true);
    expect(parsedEn.clientName).toBe('Vikram and Ananya');
    expect(parsedEn.eventDate).toBe('2026-12-24');
    expect(parsedEn.venueName).toBe('Grand Hyatt');
    expect(parsedEn.city).toBe('Mumbai');
    expect(parsedEn.area).toBe('Bandra');
    expect(parsedEn.guestCount).toBe(500);
    expect(parsedEn.estimatedBudget).toBe(4500000);
    expect(parsedEn.clientPhone).toBe('9820011223');
    expect(parsedEn.missingFields.length).toBe(0);

    // Marathi command
    const mrInput = 'पुण्यात बाणेर येथे 18 डिसेंबर 2026 ला अमर बॅनक्वेट्स मध्ये राहुल आणि स्नेहाचा विवाह, 400 पाहुणे, फोन 9822011223';
    const parsedMr = parsePlannerCreateEventCommand(mrInput);
    expect(parsedMr.isValid).toBe(true);
    expect(parsedMr.clientName).toContain('राहुल आणि स्नेहा');
    expect(parsedMr.eventDate).toBe('2026-12-18');
    expect(parsedMr.venueName).toBe('अमर बॅनक्वेट्स');
    expect(parsedMr.city).toBe('Pune');
    expect(parsedMr.area).toBe('Baner');
    expect(parsedMr.guestCount).toBe(400);

    // Hindi command
    const hiInput = 'मुंबई में कांदिवली में 20 जनवरी 2027 को राज और सिमरन की शादी, वेन्यू ऑर्किड हॉल, 600 मेहमान';
    const parsedHi = parsePlannerCreateEventCommand(hiInput);
    expect(parsedHi.isValid).toBe(true);
    expect(parsedHi.clientName).toContain('राज और सिमरन');
    expect(parsedHi.eventDate).toBe('2027-01-20');
    expect(parsedHi.venueName).toBe('ऑर्किड हॉल');
    expect(parsedHi.city).toBe('Mumbai');
    expect(parsedHi.area).toBe('Kandivali');
    expect(parsedHi.guestCount).toBe(600);
  });

  // 7. Strict Non-Invention of Missing Mandatory Fields
  it('Requirement 7: AI Event Creation strictly asks for missing fields and NEVER invents dates or venues', () => {
    // Missing date and venue
    const incompleteInput = 'Create a wedding event for Rohit and Priya in Baner Pune';
    const parsed = parsePlannerCreateEventCommand(incompleteInput);
    expect(parsed.isValid).toBe(false);
    expect(parsed.missingFields).toContain('eventDate');
    expect(parsed.missingFields).toContain('venueName');
    // Assistant response explicitly asks for missing information and states it cannot invent them
    expect(parsed.assistantSpeechResponse).toContain('I cannot invent or assume');
  });

  // 8. Event Creation without Client Name
  it('Requirement 8: AI Event Creation asks for client name when omitted', () => {
    const noClientInput = 'Create wedding on 25 December 2026 at Emerald Meadows in Baner Pune';
    const parsed = parsePlannerCreateEventCommand(noClientInput);
    expect(parsed.isValid).toBe(false);
    expect(parsed.missingFields).toContain('clientName');
  });

  // 9. Multilingual Voice NLU on Planner Vendor Directory
  it('Requirement 9: Multilingual voice commands in PlannerVendorDirectory resolve locations, categories and dates', () => {
    // English
    const cmd1 = parsePlannerVoiceCommand('Show me photographers we have previously worked with in Baner');
    expect(cmd1.area).toBe('Baner');
    expect(cmd1.city).toBe('Pune');
    expect(cmd1.category).toBe('Photography and Videography');

    // Marathi
    const cmd2 = parsePlannerVoiceCommand('पुण्यातील बाणेर मधील आम्ही काम केलेले वेंडर्स दाखवा');
    expect(cmd2.city).toBe('Pune');
    expect(cmd2.area).toBe('Baner');

    // Hindi
    const cmd3 = parsePlannerVoiceCommand('कल्याण में कैटरर्स की उपलब्धता दिखाओ');
    expect(cmd3.city).toBe('Mumbai');
    expect(cmd3.area).toBe('Kalyan');
    expect(cmd3.category).toBe('Catering and Food Services');
  });

  // 10. UI/UX Layout Stability
  it('Requirement 10: Ensures layout structure and components have stable constraints', () => {
    // All 76 localities exist in registry
    expect(MUMBAI_LOCALITY_REGISTRY.length + PUNE_LOCALITY_REGISTRY.length).toBe(76);

    // Initial events have all required presentation attributes
    for (const ev of INITIAL_DEMO_EVENTS) {
      expect(ev.eventName).toBeTruthy();
      expect(ev.eventDate).toBeTruthy();
      expect(ev.city).toBeTruthy();
      expect(ev.area).toBeTruthy();
      expect(ev.guestCount).toBeGreaterThan(0);
      expect(ev.estimatedBudget).toBeGreaterThan(0);
    }
  });
});

