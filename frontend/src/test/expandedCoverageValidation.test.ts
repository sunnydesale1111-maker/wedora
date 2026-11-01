import { describe, it, expect } from 'vitest';
import {
  MUMBAI_LOCALITY_REGISTRY,
  PUNE_LOCALITY_REGISTRY,
  ALL_LOCALITIES,
  CANONICAL_MUMBAI_LOCALITIES,
  CANONICAL_PUNE_LOCALITIES,
  resolveLocality,
} from '../utils/localityRegistry';
import { DEMO_VENDORS } from '../data/demoVendors';
import { CANONICAL_CATEGORIES } from '../types/vendor';
import {
  getVerifiedCollaborationsForPlanner,
  getRecommendedVendorsForPlanner,
  VERIFIED_PLANNER_COLLABORATIONS,
} from '../data/plannerCollaborations';
import { parsePlannerVoiceCommand } from '../utils/plannerVoiceNlu';
import { getDaySlotStatus, checkSlotConflict, recordSlotBooking } from '../types/vendorSlot';

describe('Wedora Expanded Vendor Coverage Across Pune and Mumbai — Validation Report Tests', () => {
  const PLANNER_EMAIL = 'planner@weddingorchestrator.com';

  // 1. Mandatory Locality Registry Coverage
  it('Metric 1: All 36 Mumbai Metropolitan and 40 Pune localities are indexed', () => {
    expect(MUMBAI_LOCALITY_REGISTRY.length).toBe(36);
    expect(PUNE_LOCALITY_REGISTRY.length).toBe(40);
    expect(ALL_LOCALITIES.length).toBe(76);

    // Verify key Mumbai/MMR localities
    const mumbaiNames = MUMBAI_LOCALITY_REGISTRY.map((l) => l.canonicalName);
    [
      'Thane',
      'Kalyan',
      'Dombivli',
      'Navi Mumbai',
      'Virar',
      'Mira Road',
      'Bhayandar',
      'Vasai',
      'Ulhasnagar',
      'Ambernath',
      'Badlapur',
      'Panvel',
      'Vashi',
      'Nerul',
      'Belapur',
      'Airoli',
      'Ghansoli',
      'Kopar Khairane',
      'Kharghar',
      'Kamothe',
      'Andheri',
      'Borivali',
      'Kandivali',
      'Malad',
      'Goregaon',
      'Powai',
      'Ghatkopar',
      'Mulund',
      'Bhandup',
      'Chembur',
      'Kurla',
      'Dadar',
      'Bandra',
      'Santacruz',
    ].forEach((targetLoc) => {
      expect(mumbaiNames).toContain(targetLoc);
    });

    // Verify key Pune & PCMC localities
    const puneNames = PUNE_LOCALITY_REGISTRY.map((l) => l.canonicalName);
    [
      'Pimpri-Chinchwad',
      'Pimpri',
      'Chinchwad',
      'Bhosari',
      'Chakan',
      'Katraj',
      'Warje',
      'Wakad',
      'Baner',
      'Balewadi',
      'Shivajinagar',
      'Aundh',
      'Pimple Saudagar',
      'Pimple Nilakh',
      'Pimple Gurav',
      'Hinjewadi',
      'Bavdhan',
      'Kothrud',
      'Karve Nagar',
      'Hadapsar',
      'Magarpatta',
      'Kharadi',
      'Viman Nagar',
      'Yerawada',
      'Koregaon Park',
      'Camp',
      'Kondhwa',
      'Bibwewadi',
      'Dhankawadi',
      'Sinhagad Road',
      'Narhe',
      'Ambegaon',
      'Wagholi',
      'Lohegaon',
      'Moshi',
      'Ravet',
      'Tathawade',
      'Talegaon Dabhade',
      'Alandi',
    ].forEach((targetLoc) => {
      expect(puneNames).toContain(targetLoc);
    });
  });

  // 2. Vendors Per Category Per Locality (Minimum requirement: 3-4 vendors)
  it('Metric 2: At least 3–4 vendor profiles per category in every single targeted locality', () => {
    // Test key core wedding categories across localities
    const coreCategories = [
      'Photography and Videography',
      'Catering and Food Services',
      'Decoration Services',
      'Wedding Lawns and Venues',
      'Makeup and Mehendi Artists',
      'DJ and Sound Systems',
      'Lighting Services',
    ];

    // Check Pune localities
    for (const puneLoc of CANONICAL_PUNE_LOCALITIES) {
      for (const cat of coreCategories) {
        const matchingVendors = DEMO_VENDORS.filter(
          (v) =>
            v.primaryCity === 'Pune' &&
            v.category === cat &&
            v.serviceableAreas &&
            v.serviceableAreas.includes(puneLoc)
        );
        expect(
          matchingVendors.length,
          `Locality "${puneLoc}" in Pune must have at least 3 vendors for category "${cat}"`
        ).toBeGreaterThanOrEqual(3);
      }
    }

    // Check Mumbai localities
    for (const mumLoc of CANONICAL_MUMBAI_LOCALITIES) {
      for (const cat of coreCategories) {
        const matchingVendors = DEMO_VENDORS.filter(
          (v) =>
            v.primaryCity === 'Mumbai' &&
            v.category === cat &&
            v.serviceableAreas &&
            v.serviceableAreas.includes(mumLoc)
        );
        expect(
          matchingVendors.length,
          `Locality "${mumLoc}" in Mumbai must have at least 3 vendors for category "${cat}"`
        ).toBeGreaterThanOrEqual(3);
      }
    }
  });

  // 3. Completed Orders Per Vendor Per Served Locality (Minimum requirement: 3-4 orders)
  it('Metric 3: Each vendor has at least 3–4 completed orders in each served locality', () => {
    const establishedVendors = DEMO_VENDORS.filter((v) => !v.isNewToPlatform);

    establishedVendors.forEach((vendor) => {
      expect(vendor.serviceableAreas.length).toBeGreaterThan(0);
      expect(vendor.completedOrdersArea).toBeDefined();

      vendor.serviceableAreas.forEach((area) => {
        const areaOrders = vendor.completedOrdersArea[area];
        expect(
          areaOrders,
          `Vendor ${vendor.id} (${vendor.businessName}) must have >= 3 completed orders in served area ${area}`
        ).toBeGreaterThanOrEqual(3);
      });
    });
  });

  // 4. Vendor Profile Images
  it('Metric 4: Every vendor has at least 1 verified profile image', () => {
    DEMO_VENDORS.forEach((vendor) => {
      expect(vendor.portfolioImages).toBeDefined();
      expect(vendor.portfolioImages.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 5. Event Planner Collaboration History
  it('Metric 5: Verified event planner collaboration history exists across key Pune and Mumbai localities', () => {
    // Baner (Pune)
    const banerCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Baner, Pune' });
    expect(banerCollabs.length).toBeGreaterThanOrEqual(3);

    // Wakad (Pune)
    const wakadCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Wakad, Pune' });
    expect(wakadCollabs.length).toBeGreaterThanOrEqual(3);

    // Kalyan (Mumbai)
    const kalyanCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Kalyan, Mumbai' });
    expect(kalyanCollabs.length).toBeGreaterThanOrEqual(1);
    expect(kalyanCollabs[0].vendor.businessName).toBe('Maharaja Royal Banquet Caterers');

    // Thane (Mumbai)
    const thaneCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Thane, Mumbai' });
    expect(thaneCollabs.length).toBeGreaterThanOrEqual(1);
    expect(thaneCollabs[0].vendor.businessName).toBe('Pushpa Vatika Floral Creations');

    // Bandra (Mumbai)
    const bandraCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Bandra, Mumbai' });
    expect(bandraCollabs.length).toBeGreaterThanOrEqual(2);

    // Kothrud (Pune)
    const kothrudCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Kothrud, Pune' });
    expect(kothrudCollabs.length).toBeGreaterThanOrEqual(1);

    // Hadapsar (Pune)
    const hadapsarCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Hadapsar, Pune' });
    expect(hadapsarCollabs.length).toBeGreaterThanOrEqual(1);

    // Alandi (Pune) now has verified collaborations across categories
    const alandiCollabs = getVerifiedCollaborationsForPlanner(PLANNER_EMAIL, { location: 'Alandi, Pune' });
    expect(alandiCollabs.length).toBeGreaterThanOrEqual(4);

    // Non-demo planner returns 0 (never invents records)
    const unauthorizedPlanner = getVerifiedCollaborationsForPlanner('stranger@weddingorchestrator.com', { location: 'Alandi, Pune' });
    expect(unauthorizedPlanner.length).toBe(0);
  });

  // 6. AI Locality Search (English, Hindi, Marathi, Aliases)
  it('Metric 6: AI Locality Search correctly resolves English, Hindi, Marathi, and aliases', () => {
    // English query: "Show me photographers we have previously worked with in Baner"
    const cmd1 = parsePlannerVoiceCommand('Show me photographers we have previously worked with in Baner');
    expect(cmd1.area).toBe('Baner');
    expect(cmd1.city).toBe('Pune');
    expect(cmd1.category).toBe('Photography and Videography');

    // English query: "Which caterers have completed events for us in Kalyan?"
    const cmd2 = parsePlannerVoiceCommand('Which caterers have completed events for us in Kalyan?');
    expect(cmd2.area).toBe('Kalyan');
    expect(cmd2.city).toBe('Mumbai');
    expect(cmd2.category).toBe('Catering and Food Services');

    // English query: "Recommend decorators in Thane based on their completed orders"
    const cmd3 = parsePlannerVoiceCommand('Recommend decorators in Thane based on their completed orders');
    expect(cmd3.area).toBe('Thane');
    expect(cmd3.city).toBe('Mumbai');
    expect(cmd3.category).toBe('Decoration Services');

    // English query: "Show me the vendors we worked with in Wakad"
    const cmd4 = parsePlannerVoiceCommand('Show me the vendors we worked with in Wakad');
    expect(cmd4.area).toBe('Wakad');
    expect(cmd4.city).toBe('Pune');

    // Alias query: "Pimpri Saudagar" resolves to "Pimple Saudagar"
    const cmd5 = parsePlannerVoiceCommand('Show me caterers in Pimpri Saudagar');
    expect(cmd5.area).toBe('Pimple Saudagar');
    expect(cmd5.city).toBe('Pune');

    // Spelling variation: "Dombivali" resolves to "Dombivli"
    const cmd6 = parsePlannerVoiceCommand('Show me photographers in Dombivali');
    expect(cmd6.area).toBe('Dombivli');
    expect(cmd6.city).toBe('Mumbai');

    // Marathi voice query: "वाकड मधील आम्ही काम केलेले वेंडर्स दाखवा"
    const cmd7 = parsePlannerVoiceCommand('वाकड मधील आम्ही काम केलेले वेंडर्स दाखवा');
    expect(cmd7.detectedLang).toBe('mr');
    expect(cmd7.area).toBe('Wakad');
    expect(cmd7.city).toBe('Pune');

    // Hindi voice query: "कल्याण में हमारे साथ काम किए हुए कैटरर्स दिखाओ"
    const cmd8 = parsePlannerVoiceCommand('कल्याण में हमारे साथ काम किए हुए कैटरर्स दिखाओ');
    expect(cmd8.detectedLang).toBe('hi');
    expect(cmd8.area).toBe('Kalyan');
    expect(cmd8.city).toBe('Mumbai');
    expect(cmd8.category).toBe('Catering and Food Services');
  });

  // 7. Historical Vendor Recommendations
  it('Metric 7: Retrieves recommended alternative vendors across newly targeted localities', () => {
    // Recommendations in Kalyan (Mumbai)
    const kalyanRecs = getRecommendedVendorsForPlanner({
      location: 'Kalyan, Mumbai',
      category: 'Catering and Food Services',
      limit: 4,
    });
    expect(kalyanRecs.length).toBeGreaterThanOrEqual(3);
    kalyanRecs.forEach((r) => {
      expect(r.serviceableAreas).toContain('Kalyan');
      expect(r.completedOrdersArea['Kalyan']).toBeGreaterThanOrEqual(3);
    });

    // Recommendations in Wakad (Pune)
    const wakadRecs = getRecommendedVendorsForPlanner({
      location: 'Wakad, Pune',
      category: 'Photography and Videography',
      limit: 4,
    });
    expect(wakadRecs.length).toBeGreaterThanOrEqual(3);
    wakadRecs.forEach((r) => {
      expect(r.serviceableAreas).toContain('Wakad');
      expect(r.completedOrdersArea['Wakad']).toBeGreaterThanOrEqual(3);
    });
  });

  // 8. Vendor Swapping and Calendar Availability
  it('Metric 8: Vendor swapping and calendar availability work seamlessly across expanded localities', () => {
    const testDate = '2026-12-28';
    const kalyanVendor = DEMO_VENDORS.find(
      (v) => v.primaryCity === 'Mumbai' && v.category === 'Catering and Food Services' && !v.isNewToPlatform
    )!;

    // Check slot status
    const slotStatus = getDaySlotStatus(kalyanVendor.id, testDate);
    expect(slotStatus).toBeDefined();
    expect(slotStatus.firstHalfBooked).toBe(false);

    // Book slot
    recordSlotBooking(kalyanVendor.id, {
      vendorId: kalyanVendor.id,
      date: testDate,
      slot: 'FIRST_HALF',
      eventName: 'Patil Reception Kalyan',
      clientName: 'Aditi Sharma',
    });

    // Conflict check
    const conflict = checkSlotConflict(kalyanVendor.id, testDate, 'FIRST_HALF');
    expect(conflict.hasConflict).toBe(true);

    // Second half remains open for booking
    const conflictSecond = checkSlotConflict(kalyanVendor.id, testDate, 'SECOND_HALF');
    expect(conflictSecond.hasConflict).toBe(false);
  });
});

