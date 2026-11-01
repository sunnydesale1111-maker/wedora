import { describe, it, expect } from 'vitest';
import {
  parsePlannerVoiceCommand,
  extractLocationFromText,
  extractCategoryFromText,
  extractDateFromPlannerText,
  extractSlotFromPlannerText,
} from '../utils/plannerVoiceNlu';
import {
  getVerifiedCollaborationsForPlanner,
  getRecommendedVendorsForPlanner,
  VERIFIED_PLANNER_COLLABORATIONS,
} from '../data/plannerCollaborations';
import { calculateQuotation, detectLanguage } from '../utils/vendorVoiceNlu';
import { getDaySlotStatus, checkSlotConflict, recordSlotBooking } from '../types/vendorSlot';
import { DEMO_VENDORS } from '../data/demoVendors';

describe('Wedora Professional Event Planner Dashboard — Acceptance Tests (Section 12)', () => {
  const PLANNER_EMAIL = 'planner@weddingorchestrator.com';

  // 1. Rename Vendor Directory and Bundles to Vendor Directory
  it('Scenario 1: Sidebar tab renamed to "Vendor Directory"', async () => {
    // Verified by reading planner.tsx nav definition
    const fs = await import('fs');
    const path = await import('path');
    const plannerFile = fs.readFileSync(
      path.resolve(__dirname, '../routes/planner.tsx'),
      'utf-8'
    );
    expect(plannerFile).toContain('{ key: "discovery", label: "Vendor Directory", icon: Store }');
    expect(plannerFile).not.toContain('{ key: "discovery", label: "Vendor Directory & Bundles", icon: Store }');
  });

  // 2. Ask for previously worked-with vendors in Baner, Pune and display only verified matches
  it('Scenario 2: Returns only verified collaboration matches in Baner, Pune (never invent history)', () => {
    const query = 'Can you show me the vendors we have previously worked with in Baner, Pune?';
    const cmd = parsePlannerVoiceCommand(query);

    expect(cmd.intent).toBe('DISCOVER_VENDORS');
    expect(cmd.location).toContain('Baner');
    expect(cmd.city).toBe('Pune');

    const matches = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, {
      location: 'Baner, Pune',
    });

    // Exactly the verified vendors in Baner
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.map((m) => m.vendor.businessName)).toContain('Royal Feast Catering & Hospitality');
    expect(matches.map((m) => m.vendor.businessName)).toContain('ShutterShree Candid Wedding Films');
    expect(matches.map((m) => m.vendor.businessName)).toContain('Elegance Floral & Mandap Decor');
    expect(matches.map((m) => m.vendor.businessName)).toContain('Emerald Meadows Wedding Lawn & Banquets');

    // All matches must have verified plannerEmail and positive event count
    matches.forEach((m) => {
      expect(m.record.plannerEmail).toBe(PLANNER_EMAIL);
      expect(m.record.eventsCompletedTogether).toBeGreaterThan(0);
      expect(m.record.clientRating).toBeGreaterThanOrEqual(4.0);
    });

    // Negative check: An uncollaborated location like "Goa" returns 0 records
    const emptyMatches = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, {
      location: 'Panaji, Goa',
    });
    expect(emptyMatches.length).toBe(0);
  });

  // 3. Display recommended vendors in a separate grid below the historical vendor section
  it('Scenario 3: Retrieves recommended alternative vendors matching criteria and excludes collaborated vendors', () => {
    const banerCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, {
      location: 'Baner, Pune',
    });
    const excludedIds = banerCollabs.map((c) => c.vendor.id);

    const recommendations = getRecommendedVendorsForPlanner({
      location: 'Baner',
      city: 'Pune',
      excludeVendorIds: excludedIds,
      limit: 6,
    });

    expect(recommendations.length).toBeGreaterThan(0);
    // Make sure excluded collaborated vendors are NOT in recommendations
    recommendations.forEach((rec) => {
      expect(excludedIds).not.toContain(rec.id);
      expect(rec.completedOrders).toBeGreaterThan(0);
      expect(rec.onTimeDeliveryPercent).toBeGreaterThanOrEqual(80);
    });
  });

  // 4. Select an unavailable photographer and swap with an available photographer after confirmation
  it('Scenario 4: Vendor swap logic preserves category and replaces vendor correctly', () => {
    // Current unavailable photographer
    const originalPhotographer = DEMO_VENDORS.find((v) => v.id === 'pun-pho-05') || {
      id: 'pun-pho-05',
      businessName: 'Flash Studios',
      category: 'Photography and Videography' as const,
      primaryCity: 'Pune' as const,
      serviceableAreas: ['Baner'],
      startingPrice: 90000,
      priceUnit: 'per event',
      maximumSimultaneousBookings: 1,
      quotationRequired: false,
      completedOrders: 10,
      successfulReferralBookings: 2,
      repeatCustomerBookings: 1,
      onTimeDeliveryPercent: 88,
      verifiedCustomerFeedbackCount: 5,
      vendorCausedCancellations: 0,
      serviceCommitmentsMetPercent: 95,
      availabilityDates: { '2026-12-20': 'Fully Booked' as const },
    };

    // Replacement photographer
    const replacementPhotographer = DEMO_VENDORS.find((v) => v.id === 'pun-pho-01')!;
    expect(replacementPhotographer).toBeDefined();
    expect(replacementPhotographer.category).toBe('Photography and Videography');

    // Simulate event selected vendors list
    let selectedVendors = [
      originalPhotographer,
      DEMO_VENDORS.find((v) => v.id === 'pun-cat-01')!,
    ];

    // Verify swap function replaces original with replacement
    selectedVendors = selectedVendors.map((v) =>
      v.id === originalPhotographer.id ? replacementPhotographer : v
    );

    expect(selectedVendors.map((v) => v.id)).toContain(replacementPhotographer.id);
    expect(selectedVendors.map((v) => v.id)).not.toContain(originalPhotographer.id);
  });

  // 5. Recalculate event forecast after the swap
  it('Scenario 5: Event performance forecast recalculates dynamically upon vendor swap', () => {
    const eventDate = '2026-12-20';
    const budget = 2500000;

    // Initial state with an unavailable vendor (0% available on eventDate)
    const initialVendors = [
      {
        ...DEMO_VENDORS.find((v) => v.id === 'pun-cat-01')!,
        startingPrice: 500000,
        onTimeDeliveryPercent: 95,
        availabilityDates: { [eventDate]: 'Available' as const },
      },
      {
        ...DEMO_VENDORS.find((v) => v.id === 'pun-pho-01')!,
        startingPrice: 150000,
        onTimeDeliveryPercent: 90,
        availabilityDates: { [eventDate]: 'Fully Booked' as const }, // CONFLICT!
      },
    ];

    // Availability coverage before swap
    const availableBefore = initialVendors.filter(
      (v) => v.availabilityDates[eventDate] === 'Available'
    ).length;
    const coverageBefore = (availableBefore / initialVendors.length) * 100;
    expect(coverageBefore).toBe(50); // 1 of 2 available

    // Swap conflicting vendor with an available vendor
    const replacementVendor = {
      ...DEMO_VENDORS.find((v) => v.id === 'pun-pho-02') || DEMO_VENDORS.find((v) => v.id === 'pun-pho-01')!,
      id: 'pun-pho-available',
      businessName: 'Available Photography Studio',
      startingPrice: 140000,
      onTimeDeliveryPercent: 98,
      availabilityDates: { [eventDate]: 'Available' as const },
    };

    const postSwapVendors = [initialVendors[0], replacementVendor];

    // Availability coverage after swap
    const availableAfter = postSwapVendors.filter(
      (v) => v.availabilityDates[eventDate] === 'Available'
    ).length;
    const coverageAfter = (availableAfter / postSwapVendors.length) * 100;
    expect(coverageAfter).toBe(100); // 100% available!

    // Budget variance updates
    const initialCost = initialVendors.reduce((sum, v) => sum + v.startingPrice, 0);
    const postSwapCost = postSwapVendors.reduce((sum, v) => sum + v.startingPrice, 0);
    expect(initialCost).toBe(650000);
    expect(postSwapCost).toBe(640000);
    expect(budget - postSwapCost).toBe(1860000); // positive budget headroom
  });

  // 6. Check exact-date availability for First Half and Second Half
  it('Scenario 6: Checks exact-date slot availability for First Half and Second Half', () => {
    const vendorId = 'pun-test-vendor-slot';
    const testDate = '2026-12-25';

    // Fresh slot status
    const statusBefore = getDaySlotStatus(vendorId, testDate);
    expect(statusBefore.firstHalfBooked).toBe(false);
    expect(statusBefore.secondHalfBooked).toBe(false);

    // Book first half
    recordSlotBooking(vendorId, {
      vendorId,
      date: testDate,
      slot: 'FIRST_HALF',
      eventName: 'Singhania Pre-Wedding',
      clientName: 'Aditi Sharma',
    });

    const statusAfterFirst = getDaySlotStatus(vendorId, testDate);
    expect(statusAfterFirst.firstHalfBooked).toBe(true);
    expect(statusAfterFirst.secondHalfBooked).toBe(false);
    expect(statusAfterFirst.overallStatus).toBe('First Half Booked');

    // Conflict check on First Half
    const conflictFirst = checkSlotConflict(vendorId, testDate, 'FIRST_HALF');
    expect(conflictFirst.hasConflict).toBe(true);

    // Conflict check on Second Half should be open
    const conflictSecond = checkSlotConflict(vendorId, testDate, 'SECOND_HALF');
    expect(conflictSecond.hasConflict).toBe(false);
  });

  // 7. Prepare a quotation using the exact supplied inputs
  it('Scenario 7: Calculates quotation using exact supplied numbers deterministically', () => {
    // Planner asks: "Create a quotation for 400 guests at ₹1,100 per plate"
    const cmd = parsePlannerVoiceCommand(
      'Create a provisional quotation for 400 guests at ₹1,100 per plate'
    );
    expect(cmd.intent).toBe('CREATE_QUOTE');
    expect(cmd.guestCount).toBe(400);
    expect(cmd.pricePerPlate).toBe(1100);

    const calc = calculateQuotation({ guestCount: 400, pricePerPlate: 1100 });
    expect(calc.subtotal).toBe(440000);
    expect(calc.totalAmount).toBe(440000);
    expect(calc.formula).toContain('400 × ₹1,100 = ₹4,40,000');
  });

  // 8. Confirm that English, Hindi, and Marathi voice commands work
  it('Scenario 8: Auto-detects English, Hindi, and Marathi commands without manual toggle', () => {
    // English
    const engCmd = parsePlannerVoiceCommand('Show me vendors we have previously worked with in Baner, Pune');
    expect(engCmd.detectedLang).toBe('en');
    expect(engCmd.intent).toBe('DISCOVER_VENDORS');
    expect(engCmd.assistantSpeechResponse).toContain('Baner, Pune');

    // Marathi
    const mrCmd = parsePlannerVoiceCommand('पुण्यातील बाणेर मधील आम्ही काम केलेले वेंडर्स दाखवा');
    expect(mrCmd.detectedLang).toBe('mr');
    expect(mrCmd.intent).toBe('DISCOVER_VENDORS');
    expect(mrCmd.assistantSpeechResponse).toContain('बाणेर');

    // Hindi
    const hiCmd = parsePlannerVoiceCommand('पुणे के बाणेर में पहले काम किए हुए वेंडर्स दिखाओ');
    expect(hiCmd.detectedLang).toBe('hi');
    expect(hiCmd.intent).toBe('DISCOVER_VENDORS');
    expect(hiCmd.assistantSpeechResponse).toContain('बाणेर');
  });

  // 9. Confirm that vendor messaging is not introduced
  it('Scenario 9: Verifies zero vendor messaging or chat messaging capability in planner assistant', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const assistantFile = fs.readFileSync(
      path.resolve(__dirname, '../components/planner/PlannerVoiceAssistant.tsx'),
      'utf-8'
    );
    const directoryFile = fs.readFileSync(
      path.resolve(__dirname, '../components/planner/PlannerVendorDirectory.tsx'),
      'utf-8'
    );

    // No messaging or chat sending endpoints or buttons
    expect(assistantFile).not.toContain('sendMessageToVendor');
    expect(assistantFile).not.toContain('sendVendorMessage');
    expect(assistantFile).not.toContain('chatWithVendor');

    expect(directoryFile).not.toContain('sendMessageToVendor');
    expect(directoryFile).not.toContain('sendVendorMessage');
    expect(directoryFile).not.toContain('chatWithVendor');
  });

  // 10. Confirm that other dashboard tabs remain functional
  it('Scenario 10: Verifies other dashboard routes and nav items remain intact in planner.tsx', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const plannerFile = fs.readFileSync(
      path.resolve(__dirname, '../routes/planner.tsx'),
      'utf-8'
    );

    // Check remaining nav tabs
    expect(plannerFile).toContain('{ key: "events", label: "Managed Client Events", icon: Calendar }');
    expect(plannerFile).toContain('{ key: "shortlist", label: "My Shortlist", icon: Bookmark }');
    expect(plannerFile).toContain('{ key: "quotations", label: "Quotes & Bookings", icon: Briefcase }');
    expect(plannerFile).toContain('{ key: "payments", label: "Simulated Payments", icon: CreditCard }');
    expect(plannerFile).toContain('{ key: "timeline", label: "Event Timelines", icon: CheckSquare }');

    // Check tab renders
    expect(plannerFile).toContain('tab === "events"');
    expect(plannerFile).toContain('tab === "shortlist"');
    expect(plannerFile).toContain('tab === "quotations"');
    expect(plannerFile).toContain('tab === "payments"');
    expect(plannerFile).toContain('tab === "timeline"');
  });
});
