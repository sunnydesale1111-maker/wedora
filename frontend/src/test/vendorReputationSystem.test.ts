import { describe, it, expect } from 'vitest';
import { DEMO_VENDORS } from '../data/demoVendors';
import { filterVendors, getVendorAreaMetrics, calculateVendorRankScore } from '../utils/vendorFilters';
import { CANONICAL_CATEGORIES, Vendor } from '../types/vendor';

describe('Wedora Vendor Reputation System — Version 1.0 Acceptance Tests', () => {
  // 1. All-time Performance Metrics Verification
  it('1. All vendors have all-time completed orders, referrals, repeat bookings, and on-time delivery', () => {
    DEMO_VENDORS.forEach((v) => {
      expect(v.completedOrders).toBeDefined();
      expect(typeof v.completedOrders).toBe('number');
      expect(v.completedOrders).toBeGreaterThanOrEqual(0);

      expect(v.successfulReferralBookings).toBeDefined();
      expect(typeof v.successfulReferralBookings).toBe('number');
      expect(v.successfulReferralBookings).toBeGreaterThanOrEqual(0);
      expect(v.successfulReferralBookings).toBeLessThanOrEqual(v.completedOrders);

      expect(v.repeatCustomerBookings).toBeDefined();
      expect(typeof v.repeatCustomerBookings).toBe('number');
      expect(v.repeatCustomerBookings).toBeGreaterThanOrEqual(0);
      expect(v.repeatCustomerBookings).toBeLessThanOrEqual(v.completedOrders);

      expect(v.onTimeDeliveryPercent).toBeDefined();
      expect(v.onTimeDeliveryPercent).toBeGreaterThanOrEqual(90);
      expect(v.onTimeDeliveryPercent).toBeLessThanOrEqual(100);

      expect(v.serviceCommitmentsMetPercent).toBeDefined();
      expect(v.serviceCommitmentsMetPercent).toBeGreaterThanOrEqual(90);
      expect(v.serviceCommitmentsMetPercent).toBeLessThanOrEqual(100);
    });
  });

  // 2. Verified Customer Feedback Records
  it('2. Active vendors have authentic customer feedback records with balanced praise and constructive notes', () => {
    const activeVendors = DEMO_VENDORS.filter((v) => !v.isNewToPlatform && v.completedOrders > 10);
    expect(activeVendors.length).toBeGreaterThan(100);

    activeVendors.forEach((v) => {
      expect(v.customerFeedback).toBeDefined();
      expect(v.customerFeedback!.length).toBeGreaterThanOrEqual(2);

      v.customerFeedback!.forEach((fb) => {
        expect(fb.id).toBeDefined();
        expect(fb.customerName.length).toBeGreaterThan(2);
        expect(fb.eventType.length).toBeGreaterThan(3);
        expect(fb.location).toContain(v.primaryCity);
        expect(fb.isVerifiedBooking).toBe(true);
        expect(fb.comment.length).toBeGreaterThan(30);
      });
    });
  });

  // 3. Service Reliability Indicators
  it('3. Service reliability indicators are mathematically sound and consistent', () => {
    DEMO_VENDORS.forEach((v) => {
      expect(v.vendorCausedCancellations).toBeDefined();
      expect(v.vendorCausedCancellations).toBeGreaterThanOrEqual(0);
      expect(v.vendorCausedCancellations).toBeLessThanOrEqual(5);

      if (v.completedOrders > 0) {
        expect(v.serviceCommitmentsMetPercent).toBeGreaterThanOrEqual(90);
      }
    });
  });

  // 4. Area-Specific Performance & "Limited history" fallback
  it('4. Area-specific metrics provide local insights or display limited history fallback', () => {
    const puneCaterer = DEMO_VENDORS.find(
      (v) => v.primaryCity === 'Pune' && v.category === 'Catering and Food Services' && !v.isNewToPlatform
    )!;

    // Searching in a served area
    const servedArea = puneCaterer.serviceableAreas[0];
    const localMetrics = getVendorAreaMetrics(puneCaterer, [servedArea], 'Pune');
    expect(localMetrics.areaLabel).toBe(`in ${servedArea}`);
    expect(localMetrics.completedOrders).toBeGreaterThanOrEqual(0);

    // Searching in an unserved / limited area
    const unservedArea = puneCaterer.primaryCity === 'Pune' ? 'Magarpatta' : 'Thane';
    const isActuallyServed = puneCaterer.serviceableAreas.includes(unservedArea);
    if (!isActuallyServed) {
      const limitedMetrics = getVendorAreaMetrics(puneCaterer, [unservedArea], puneCaterer.primaryCity);
      expect(limitedMetrics.hasLimitedHistory).toBe(true);
    }
  });

  // 5. Fair Visibility for New Vendors
  it('5. New vendors are flagged cleanly as New to Wedora without fake transaction inflation', () => {
    const newVendors = DEMO_VENDORS.filter((v) => v.isNewToPlatform);
    expect(newVendors.length).toBeGreaterThanOrEqual(10);

    newVendors.forEach((v) => {
      expect(v.isNewToPlatform).toBe(true);
      // Raw order count is realistic (0 or at most early 2)
      expect(v.completedOrders).toBeLessThanOrEqual(2);
      expect(v.successfulReferralBookings).toBeLessThanOrEqual(v.completedOrders);

      // Area metrics mark hasLimitedHistory
      const metrics = getVendorAreaMetrics(v, v.serviceableAreas.slice(0, 1), v.primaryCity);
      expect(metrics.hasLimitedHistory).toBe(true);

      // Ranking gives fair exploration boost (score >= 0.60)
      const rankScore = calculateVendorRankScore(v, v.serviceableAreas.slice(0, 1), v.primaryCity);
      expect(rankScore).toBeGreaterThanOrEqual(0.60);
    });
  });

  // 6. Transparent Performance-Based Ranking
  it('6. Performance-based ranking prioritizes high-confidence reliability and feedback over small unproven samples', () => {
    const caterers = DEMO_VENDORS.filter(
      (v) => v.primaryCity === 'Pune' && (v.category === 'Catering and Food Services' || v.secondaryCategories?.includes('Catering and Food Services'))
    );

    const sortedRecommended = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      sortBy: 'recommended',
    });

    expect(sortedRecommended.results.length).toBeGreaterThanOrEqual(7);

    // The top ranked vendor should have strong performance history
    const topVendor = sortedRecommended.results[0];
    expect(topVendor.completedOrders).toBeGreaterThan(20);
    expect(topVendor.onTimeDeliveryPercent).toBeGreaterThanOrEqual(93);
    expect(topVendor.verifiedCustomerFeedbackCount).toBeGreaterThan(10);
  });

  // 7. Sorting Options Update Order Correctly
  it('7. Sorting by completed_orders, referrals, on_time_delivery, and repeat_orders updates results order', () => {
    // A. Completed Orders sort
    const byOrders = filterVendors({ city: 'Pune', sortBy: 'completed_orders' });
    for (let i = 0; i < byOrders.results.length - 1; i++) {
      expect(byOrders.results[i].completedOrders).toBeGreaterThanOrEqual(
        byOrders.results[i + 1].completedOrders
      );
    }

    // B. Referrals sort
    const byReferrals = filterVendors({ city: 'Mumbai', sortBy: 'referrals' });
    for (let i = 0; i < byReferrals.results.length - 1; i++) {
      expect(byReferrals.results[i].successfulReferralBookings).toBeGreaterThanOrEqual(
        byReferrals.results[i + 1].successfulReferralBookings
      );
    }

    // C. On-Time Delivery sort
    const byDelivery = filterVendors({ city: 'Pune', sortBy: 'on_time_delivery' });
    for (let i = 0; i < byDelivery.results.length - 1; i++) {
      expect(byDelivery.results[i].onTimeDeliveryPercent).toBeGreaterThanOrEqual(
        byDelivery.results[i + 1].onTimeDeliveryPercent
      );
    }

    // D. Repeat Bookings sort
    const byRepeats = filterVendors({ city: 'Mumbai', sortBy: 'repeat_orders' });
    for (let i = 0; i < byRepeats.results.length - 1; i++) {
      expect(byRepeats.results[i].repeatCustomerBookings).toBeGreaterThanOrEqual(
        byRepeats.results[i + 1].repeatCustomerBookings
      );
    }
  });

  // 8. Eligibility Filtering Precedes Ranking
  it('8. Eligibility filtering strictly precedes ranking without hallucination or leakage', () => {
    const banerPuneCaterers = filterVendors({
      category: 'Catering and Food Services',
      city: 'Pune',
      areas: ['Baner'],
      sortBy: 'recommended',
    });

    banerPuneCaterers.results.forEach((v) => {
      expect(v.primaryCity).toBe('Pune');
      expect(v.serviceableAreas).toContain('Baner');
      const isCatering =
        v.category === 'Catering and Food Services' ||
        v.secondaryCategories?.includes('Catering and Food Services');
      expect(isCatering).toBe(true);
    });
  });
});
