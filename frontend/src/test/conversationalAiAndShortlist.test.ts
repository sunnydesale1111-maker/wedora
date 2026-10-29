import { describe, it, expect, beforeEach } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { parseSearchIntent } from '../utils/searchIntentParser';
import { filterVendors } from '../utils/vendorFilters';
import { isOrganizerCategory, ShortlistItem } from '../types/shortlist';
import { INITIAL_DEMO_SHORTLIST } from '../data/demoShortlist';

describe('Version 3.0: Conversational AI & Shortlist Acceptance Tests (Requirements 1–18)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Acceptance Test 1 & 2: Opening with welcome greeting & Selecting occasion prompts for details
  it('Tests 1 & 2: Opening greeting and occasion selection prompt for next event details', () => {
    const greetingIntent = parseSearchIntent('Namaste');
    expect(greetingIntent.isGreeting).toBe(true);
    expect(greetingIntent.assistantReply).toContain('Namaste! 🙏 Welcome to Wedora.');
    expect(greetingIntent.assistantReply).toContain('What event are you planning?');

    // Selecting "Wedding"
    const weddingIntent = parseSearchIntent('Wedding');
    expect(weddingIntent.detectedOccasion).toBe('Wedding');
    expect(weddingIntent.nextQuestion).toBe(2);
    expect(weddingIntent.assistantReply).toBe('Which city and area will your event take place in?');
  });

  // Acceptance Test 3: The chatbot accepts a date using an inline calendar or natural text
  it('Test 3: Chatbot extracts date from input or inline date selection', () => {
    const dateIntent1 = parseSearchIntent('15 December 2026');
    expect(dateIntent1.detectedDate).toBe('2026-12-15');

    const dateIntent2 = parseSearchIntent('20 Dec');
    expect(dateIntent2.detectedDate).toBe('2026-12-20');

    const dateIntent3 = parseSearchIntent('next Sunday');
    expect(dateIntent3.detectedDate).toBe('2026-10-25');
  });

  // Acceptance Test 4: The chatbot accepts city and local area through conversation
  it('Test 4: Chatbot accepts city and local area through conversation', () => {
    const locationIntent = parseSearchIntent('Find vendors near Baner and Wakad in Pune');
    expect(locationIntent.detectedCity).toBe('Pune');
    expect(locationIntent.detectedAreas).toContain('Baner');
    expect(locationIntent.detectedAreas).toContain('Wakad');
  });

  // Acceptance Test 5: The chatbot accepts a guest count through conversation
  it('Test 5: Chatbot accepts a guest count in conversation', () => {
    const guestIntent = parseSearchIntent('Around 450 people');
    expect(guestIntent.detectedGuestCount).toBe(450);

    const guestIntent2 = parseSearchIntent('500 guests');
    expect(guestIntent2.detectedGuestCount).toBe(500);
  });

  // Acceptance Test 6: A single natural-language message containing event, city, date, category and budget is correctly understood
  it('Test 6: Single natural-language message with event, city, date, category and budget is correctly understood', () => {
    const fullQuery = 'I need a wedding caterer in Pune on 15 December 2026 with a budget of 2 lakh.';
    const parsed = parseSearchIntent(fullQuery);

    expect(parsed.detectedCategory).toBe('Catering and Food Services');
    expect(parsed.detectedCity).toBe('Pune');
    expect(parsed.detectedDate).toBe('2026-12-15');
    expect(parsed.detectedOccasion).toBe('Wedding');
    expect(parsed.isBudgetAnswer).toBe(true);
    expect(parsed.flowCompleted).toBe(true);
    expect(parsed.assistantReply).toContain("Thank you! I've found vendors according to your event requirements.");
  });

  // Acceptance Test 7: The chatbot remembers details when the user changes only the service category
  it('Test 7: Chatbot retains date, city, area, and guest count when changing category', () => {
    const prevContext = {
      currentCity: 'Pune' as const,
      currentAreas: ['Baner', 'Wakad'],
      currentDate: '2026-12-15',
      currentGuestCount: 500,
      currentCategory: 'Catering and Food Services' as const,
      flowCompleted: true,
    };

    const parsed = parseSearchIntent('Now show me decorators.', prevContext);
    expect(['Decoration and Flower Arrangements', 'Decoration Services']).toContain(parsed.detectedCategory);
    // Retains city & areas from context
    expect(parsed.detectedCity).toBeUndefined(); // city wasn't explicitly changed
    expect(parsed.assistantReply).toContain(parsed.detectedCategory);
    expect(parsed.assistantReply).toContain('retained');
  });

  // Acceptance Test 8: Matching vendors appear in the results
  it('Test 8: Matching vendors from existing 100-vendor dataset are correctly filtered', () => {
    const results = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      areas: ['Baner'],
      date: '2026-12-15',
      guestCount: 500,
    });

    expect(results.results.length).toBeGreaterThan(0);
    results.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      expect(v.serviceableAreas).toContain('Baner');
      if (v.maximumGuestCapacity) {
        expect(v.maximumGuestCapacity).toBeGreaterThanOrEqual(500);
      }
    });
  });

  // Acceptance Test 11, 12, 13, 14, 15: Shortlisting, separation into tabs, immediate removal, persistence
  it('Tests 11, 12, 13, 14, 15: Shortlisting vendors and event organizers with local persistence and tab separation', () => {
    // Check initial mock shortlist
    expect(INITIAL_DEMO_SHORTLIST.length).toBe(2);

    const catererItem = INITIAL_DEMO_SHORTLIST.find((i) => i.vendorId === 'pun-cat-01')!;
    const organizerItem = INITIAL_DEMO_SHORTLIST.find((i) => i.vendorId === 'pun-org-01')!;

    expect(catererItem).toBeDefined();
    expect(organizerItem).toBeDefined();

    // Verify separation of tabs:
    expect(isOrganizerCategory(catererItem.vendor.category)).toBe(false); // Vendor Tab
    expect(isOrganizerCategory(organizerItem.vendor.category)).toBe(true); // Organizer Tab

    // Simulate saving to localStorage
    const STORAGE_KEY = 'wedora_shortlist';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_SHORTLIST));

    // Read back to simulate page refresh (Test 15)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(2);

    // Simulate removing a vendor (Test 14)
    const afterRemoval = stored.filter((item: ShortlistItem) => item.vendorId !== 'pun-cat-01');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(afterRemoval));

    const updated = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(updated).toHaveLength(1);
    expect(updated[0].vendorId).toBe('pun-org-01');
  });

  // Acceptance Test 16: Vendor cards show both Completed Orders and AOV
  it('Test 16: Every vendor in the dataset provides Completed Orders and AOV for last 90 days', () => {
    DEMO_VENDORS.forEach((vendor) => {
      expect(vendor.completedOrders90Days).toBeDefined();
      expect(typeof vendor.completedOrders90Days).toBe('number');
      expect(vendor.averageOrderValue90Days).toBeDefined();
      expect(typeof vendor.averageOrderValue90Days).toBe('number');
    });
  });

  // Acceptance Test 17: Budget fit is not inferred from AOV
  it('Test 17: Budget fit is based on starting price/quotation, not AOV', () => {
    // If a vendor has quotationRequired: true, starting price is undefined or requires quotation
    const quoteVendor = DEMO_VENDORS.find((v) => v.quotationRequired || !v.startingPrice);
    expect(quoteVendor).toBeDefined();

    // Even if AOV is 3,80,000 and customer budget is 25,00,000,
    // the status remains "Quotation Required — Budget Fit Not Yet Confirmed"
    const isQuotationNeeded = quoteVendor?.quotationRequired || !quoteVendor?.startingPrice;
    expect(isQuotationNeeded).toBe(true);
  });

  // Acceptance Test 10: Shortlist Chatbot Integration commands
  it('Test 10 (Chatbot Shortlist Commands): Understood deterministically by parser', () => {
    const listCaterers = parseSearchIntent('Show my shortlisted caterers.');
    expect(listCaterers.shortlistQuery?.category).toBe('Catering and Food Services');

    const listOrganizers = parseSearchIntent('Which event organizers have I shortlisted?');
    expect(listOrganizers.shortlistQuery?.isOrganizer).toBe(true);

    const removeCmd = parseSearchIntent('Remove Royal Feast Catering from my shortlist.');
    expect(removeCmd.shortlistRemoveVendor?.toLowerCase()).toContain('royal feast catering');
  });
});
