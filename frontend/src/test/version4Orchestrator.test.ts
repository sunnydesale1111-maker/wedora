import { describe, it, expect } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { parseSearchIntent } from '../utils/searchIntentParser';
import { filterVendors, getVendorAreaMetrics } from '../utils/vendorFilters';
import { CANONICAL_CATEGORIES, Vendor } from '../types/vendor';

describe('Version 4.0: Conversational AI, Vendor Discovery & Performance Metrics Acceptance Tests', () => {
  // ==================== SECTION 14: REQUIRED CHATBOT TEST SCENARIOS ====================

  // Scenario A — New User Conversation
  it('Scenario A: User opens chatbot -> Welcomes with Namaste, guides through event, location, category, budget, date', () => {
    // 1. Initial greeting
    const greeting = parseSearchIntent('Namaste!');
    expect(greeting.isGreeting).toBe(true);
    expect(greeting.assistantReply).toContain('Namaste! 🙏 Welcome to Wedora.');
    expect(greeting.assistantReply).toContain('What event are you planning?');

    // 2. User provides event
    const occasion = parseSearchIntent('Wedding', {});
    expect(occasion.detectedOccasion).toBe('Wedding');
    expect(occasion.nextQuestion).toBe(2);
    expect(occasion.assistantReply).toBe('Which city and area will your event take place in?');

    // 3. User provides location
    const locationTurn = parseSearchIntent('Baner, Pune', {
      currentOccasion: 'Wedding',
    });
    expect(locationTurn.detectedCity).toBe('Pune');
    expect(locationTurn.detectedAreas).toContain('Baner');
    expect(locationTurn.nextQuestion).toBe(3);
    expect(locationTurn.assistantReply).toBe('Which type of vendor would you like to find first?');

    // 4. User provides category
    const categoryTurn = parseSearchIntent('Catering', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentAreas: ['Baner'],
    });
    expect(categoryTurn.detectedCategory).toBe('Catering and Food Services');
    expect(categoryTurn.nextQuestion).toBe(4);
    expect(categoryTurn.assistantReply).toBe('What is your approximate budget for this service?');

    // 5. User provides budget
    const budgetTurn = parseSearchIntent('₹2,00,000', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentAreas: ['Baner'],
      currentCategory: 'Catering and Food Services',
    });
    expect(budgetTurn.isBudgetAnswer).toBe(true);
    expect(budgetTurn.detectedMaxBudget).toBe(200000);
    expect(budgetTurn.nextQuestion).toBe(5);
    expect(budgetTurn.assistantReply).toBe('And finally, what date is your event planned for?');

    // 6. User provides date
    const dateTurn = parseSearchIntent('15 December 2026', {
      currentOccasion: 'Wedding',
      currentCity: 'Pune',
      currentAreas: ['Baner'],
      currentCategory: 'Catering and Food Services',
      hasAnsweredBudget: true,
      currentBudget: 200000,
    });
    expect(dateTurn.detectedDate).toBe('2026-12-15');
    expect(dateTurn.flowCompleted).toBe(true);
    expect(dateTurn.assistantReply).toContain("Thank you! I've found vendors according to your event requirements.");
  });

  // Scenario B — Complete Natural-Language Request
  it('Scenario B: Complete Natural-Language Request extracts all details without repeating questions', () => {
    const query = 'I need catering for my wedding in Baner, Pune on 15 December 2026 with a budget of 2 lakh.';
    const parsed = parseSearchIntent(query);

    expect(parsed.detectedCategory).toBe('Catering and Food Services');
    expect(parsed.detectedCity).toBe('Pune');
    expect(parsed.detectedAreas).toContain('Baner');
    expect(parsed.detectedDate).toBe('2026-12-15');
    expect(parsed.detectedMaxBudget).toBe(200000);
    expect(parsed.detectedOccasion).toBe('Wedding');
    expect(parsed.flowCompleted).toBe(true);
    expect(parsed.assistantReply).toContain("Thank you! I've found vendors according to your event requirements.");
  });

  // Scenario C — Change Category
  it('Scenario C: User changes only category -> Date, city, area, and guest count are preserved', () => {
    const existingContext = {
      currentOccasion: 'Wedding',
      currentCity: 'Pune' as const,
      currentAreas: ['Baner'],
      currentDate: '2026-12-15',
      currentGuestCount: 500,
      currentCategory: 'Catering and Food Services' as const,
      flowCompleted: true,
    };

    const parsed = parseSearchIntent('Now show me decorators.', existingContext);

    expect(parsed.detectedCategory).toBe('Decoration Services');
    expect(parsed.detectedCity).toBeUndefined(); // Unchanged
    expect(parsed.detectedDate).toBeUndefined(); // Unchanged
    expect(parsed.detectedGuestCount).toBeUndefined(); // Unchanged
    expect(parsed.assistantReply).toContain('Decoration Services');
    expect(parsed.assistantReply).toContain('retained');
  });

  // Scenario D — Change Location
  it('Scenario D: User changes location -> City and area update cleanly', () => {
    const existingContext = {
      currentOccasion: 'Wedding',
      currentCity: 'Pune' as const,
      currentAreas: ['Baner'],
      currentDate: '2026-12-15',
      currentGuestCount: 500,
      currentCategory: 'Decoration Services' as const,
    };

    const parsed = parseSearchIntent('Actually, make it Andheri, Mumbai.', existingContext);

    expect(parsed.detectedCity).toBe('Mumbai');
    expect(parsed.detectedAreas).toContain('Andheri');
    expect(parsed.detectedAreas).not.toContain('Baner'); // Pune area cleared
  });

  // Scenario E — Referral Sorting
  it('Scenario E: User requests referral sorting -> Parser detects referrals sort signal', () => {
    const parsed = parseSearchIntent('Show me vendors with the most referrals in this area.');
    expect(parsed.detectedSortBy).toBe('referrals');

    const results = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      areas: ['Baner'],
      sortBy: 'referrals',
    });

    expect(results.results.length).toBeGreaterThan(1);
    const metricsFirst = getVendorAreaMetrics(results.results[0], ['Baner'], 'Pune');
    const metricsSecond = getVendorAreaMetrics(results.results[1], ['Baner'], 'Pune');
    expect(metricsFirst.customerReferrals).toBeGreaterThanOrEqual(metricsSecond.customerReferrals);
  });

  it('Scenario E2: User requests completed orders sorting -> Parser detects completed_orders', () => {
    const parsed = parseSearchIntent('Show me vendors with more completed orders.');
    expect(parsed.detectedSortBy).toBe('completed_orders');

    const results = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      sortBy: 'completed_orders',
    });

    expect(results.results.length).toBeGreaterThan(1);
    expect(results.results[0].completedOrders90Days).toBeGreaterThanOrEqual(
      results.results[1].completedOrders90Days
    );
  });

  // Scenario F — Shortlisting by Index
  it('Scenario F: User commands "Shortlist the second vendor" -> Parser returns shortlistIndex = 1', () => {
    const parsedFirst = parseSearchIntent('Shortlist the first vendor');
    expect(parsedFirst.shortlistIndex).toBe(0);

    const parsedSecond = parseSearchIntent('Shortlist the second vendor.');
    expect(parsedSecond.shortlistIndex).toBe(1);

    const parsedThird = parseSearchIntent('Shortlist the 3rd vendor');
    expect(parsedThird.shortlistIndex).toBe(2);
  });

  // Scenario G — No Results handling
  it('Scenario G: Impossible criteria returns 0 results without fabricating fictional vendors', () => {
    const results = filterVendors({
      category: 'Wedding Lawns and Venues',
      city: 'Pune',
      guestCount: 50000, // No venue can hold 50,000 guests
    });

    expect(results.totalMatched).toBe(0);
    expect(results.results).toHaveLength(0);
  });

  // ==================== SECTION 9 & 10: PERFORMANCE METRICS & AOV REMOVAL ====================

  it('Section 9 & 10: All vendors provide Completed Orders, Repeat Orders in Area, and Customer Referrals in Area', () => {
    DEMO_VENDORS.forEach((vendor) => {
      expect(vendor.completedOrders90Days).toBeDefined();
      expect(vendor.completedOrders90Days).toBeGreaterThanOrEqual(0);

      // Area metrics calculation
      const area = vendor.serviceableAreas[0];
      const metrics = getVendorAreaMetrics(vendor, [area], vendor.primaryCity);

      expect(metrics.repeatOrders).toBeGreaterThanOrEqual(0);
      expect(metrics.customerReferrals).toBeGreaterThanOrEqual(0);
      if (!vendor.isNewToPlatform && vendor.completedOrders90Days > 0) {
        expect(metrics.areaLabel).toContain(area);
      } else {
        expect(metrics.areaLabel).toBe('in Your Area');
      }
    });
  });

  it('Section 9: Multi-area and city-wide searches aggregate metrics without double-counting', () => {
    const vendor = DEMO_VENDORS.find((v) => v.serviceableAreas.length >= 2)!;
    const areas = vendor.serviceableAreas.slice(0, 2);

    const singleAreaMetrics = getVendorAreaMetrics(vendor, [areas[0]], vendor.primaryCity);
    const multiAreaMetrics = getVendorAreaMetrics(vendor, areas, vendor.primaryCity);

    expect(multiAreaMetrics.areaLabel).toBe('in Selected Areas');
    expect(multiAreaMetrics.repeatOrders).toBeGreaterThanOrEqual(singleAreaMetrics.repeatOrders);
  });

  // ==================== SECTION 6: CATEGORY COVERAGE (MIN 5 PER CITY) ====================

  it('Section 6: Every supported category has at least five vendors serving Mumbai and five serving Pune', () => {
    expect(DEMO_VENDORS.length).toBeGreaterThanOrEqual(136);

    for (const cat of CANONICAL_CATEGORIES) {
      const mumbaiCount = DEMO_VENDORS.filter(
        (v) =>
          v.primaryCity === 'Mumbai' &&
          (v.category === cat || v.secondaryCategories?.includes(cat as any))
      ).length;

      const puneCount = DEMO_VENDORS.filter(
        (v) =>
          v.primaryCity === 'Pune' &&
          (v.category === cat || v.secondaryCategories?.includes(cat as any))
      ).length;

      expect(mumbaiCount).toBeGreaterThanOrEqual(5);
      expect(puneCount).toBeGreaterThanOrEqual(5);
    }
  });

  it('Section 7: Every vendor has complete individual profile fields and valid availability data', () => {
    const seenIds = new Set<string>();

    DEMO_VENDORS.forEach((v) => {
      // Unique ID
      expect(seenIds.has(v.id)).toBe(false);
      seenIds.add(v.id);

      // Complete profile attributes
      expect(v.businessName.length).toBeGreaterThan(0);
      expect(v.description.length).toBeGreaterThan(10);
      expect(v.serviceableAreas.length).toBeGreaterThan(0);
      expect(v.serviceOfferings).toBeDefined();
      expect(v.serviceOfferings!.length).toBeGreaterThan(0);
      expect(Object.keys(v.availabilityDates).length).toBeGreaterThan(0);
      expect(v.availabilityDates['2026-12-15']).toBeDefined();
    });
  });
});
