import { Vendor, SearchFilters, AvailabilityStatus } from '../types/vendor';
import { DEMO_VENDORS } from '../data/demoVendors';

export interface CalendarOverrides {
  [vendorId: string]: {
    [date: string]: AvailabilityStatus;
  };
}

/**
 * Categories where guest capacity is an operational constraint.
 * For categories not in this list (e.g. Photography, Lighting, DJ, Decor),
 * guest count filtering is not applied.
 */
export const CAPACITY_RELEVANT_CATEGORIES: string[] = [
  'Catering and Food Services',
  'Wedding Lawns and Venues',
  'Hotels and Guest Accommodation',
  'Hotels, Lodging and Guest Accommodation',
  'Event Organizers / Wedding Planners',
  'End-to-End Event Management',
  'End-to-End Event Management Providers',
];

export interface VendorAreaMetricsResult {
  completedOrders: number;
  repeatOrders: number;
  customerReferrals: number;
  areaLabel: string;
  hasLimitedHistory: boolean;
}

/**
 * Computes area-specific verified performance metrics for a vendor
 * given the user's selected area(s) or city.
 * Follows PRD Section 6: If insufficient area data (< 2 orders), marks hasLimitedHistory = true
 * so the UI displays "Limited performance history in this area".
 */
export function getVendorAreaMetrics(
  vendor: Vendor,
  selectedAreas?: string[],
  selectedCity?: string
): VendorAreaMetricsResult {
  const isNew = vendor.isNewToPlatform || ((vendor.completedOrders || vendor.completedOrders90Days || 0) === 0);

  if (isNew) {
    return {
      completedOrders: 0,
      repeatOrders: 0,
      customerReferrals: 0,
      areaLabel: 'in Your Area',
      hasLimitedHistory: true,
    };
  }

  // 1. Single area selected (e.g. Baner, Wakad, Andheri)
  if (selectedAreas && selectedAreas.length === 1) {
    const area = selectedAreas[0];
    const servesArea = vendor.serviceableAreas.some((a) => a.toLowerCase() === area.toLowerCase());
    const areaOrders = vendor.completedOrdersArea?.[area];

    // If vendor doesn't serve this area or has fewer than 2 completed orders here:
    if (!servesArea || areaOrders === undefined || areaOrders < 2) {
      return {
        completedOrders: areaOrders || 0,
        repeatOrders: vendor.repeatOrdersArea?.[area] || 0,
        customerReferrals: vendor.referralsArea?.[area] || 0,
        areaLabel: `in ${area}`,
        hasLimitedHistory: true,
      };
    }

    const repeat = vendor.repeatOrdersArea?.[area] ?? Math.max(1, Math.round(areaOrders * 0.25));
    const refs = vendor.referralsArea?.[area] ?? Math.max(1, Math.round(areaOrders * 0.35));

    return {
      completedOrders: areaOrders,
      repeatOrders: repeat,
      customerReferrals: refs,
      areaLabel: `in ${area}`,
      hasLimitedHistory: false,
    };
  }

  // 2. Multiple areas selected (e.g. Baner, Wakad)
  if (selectedAreas && selectedAreas.length > 1) {
    let completed = 0;
    let repeat = 0;
    let refs = 0;
    let matchingAreasCount = 0;

    selectedAreas.forEach((area) => {
      if (vendor.serviceableAreas.some((a) => a.toLowerCase() === area.toLowerCase())) {
        matchingAreasCount++;
        const o = vendor.completedOrdersArea?.[area] || 0;
        completed += o;
        repeat += vendor.repeatOrdersArea?.[area] || Math.max(0, Math.round(o * 0.25));
        refs += vendor.referralsArea?.[area] || Math.max(0, Math.round(o * 0.35));
      }
    });

    if (matchingAreasCount === 0 || completed < 2) {
      return {
        completedOrders: completed,
        repeatOrders: repeat,
        customerReferrals: refs,
        areaLabel: 'in Selected Areas',
        hasLimitedHistory: true,
      };
    }

    return {
      completedOrders: completed,
      repeatOrders: repeat,
      customerReferrals: refs,
      areaLabel: 'in Selected Areas',
      hasLimitedHistory: false,
    };
  }

  // 3. City-wide search (e.g. Pune, Mumbai)
  const city = selectedCity || vendor.primaryCity;
  const totalCompleted = vendor.completedOrders || vendor.completedOrders90Days || 0;
  const totalRepeat = vendor.repeatCustomerBookings || vendor.repeatOrdersTotal || Math.max(1, Math.round(totalCompleted * 0.2));
  const totalRefs = vendor.successfulReferralBookings || vendor.referralsTotal || Math.max(1, Math.round(totalCompleted * 0.3));

  return {
    completedOrders: totalCompleted,
    repeatOrders: totalRepeat,
    customerReferrals: totalRefs,
    areaLabel: `in ${city}`,
    hasLimitedHistory: totalCompleted < 2,
  };
}

/**
 * Transparent internally calculated vendor ranking system (PRD Section 8).
 * Starting weights:
 * - Service Reliability: 30% (Bayesian smoothed against small sample sizes)
 * - Verified Customer Feedback: 25% (normalized log scale)
 * - Completed Orders: 20% (normalized log scale)
 * - Successful Referral Bookings: 15% (referral conversion ratio & volume)
 * - Repeat Customer Bookings: 10% (repeat ratio & volume)
 *
 * Includes fair new-vendor visibility boost and area-specific relevance boost.
 * Does not expose a raw score or star rating to the user.
 */
export function calculateVendorRankScore(
  vendor: Vendor,
  requestedAreas?: string[],
  city?: string
): number {
  const totalOrders = vendor.completedOrders ?? vendor.completedOrders90Days ?? 0;

  // Fair visibility for new vendors (Section 7)
  if (vendor.isNewToPlatform || totalOrders <= 2) {
    let newScore = 0.65;
    if (requestedAreas && requestedAreas.length > 0) {
      const servesArea = requestedAreas.some((a) =>
        vendor.serviceableAreas.some((sa) => sa.toLowerCase() === a.toLowerCase())
      );
      if (servesArea) newScore += 0.05;
    }
    return newScore;
  }

  // 1. Service Reliability (30%)
  const rawDelivery = (vendor.onTimeDeliveryPercent || 95) / 100;
  const rawCommitments = (vendor.serviceCommitmentsMetPercent || 96) / 100;
  const compositeReliability = (rawDelivery * 0.7) + (rawCommitments * 0.3);
  const priorMean = 0.94;
  const priorWeight = 12;
  const smoothedReliability =
    ((totalOrders * compositeReliability) + (priorWeight * priorMean)) / (totalOrders + priorWeight);

  // 2. Verified Customer Feedback (25%)
  const feedbackCount = vendor.verifiedCustomerFeedbackCount || (vendor.customerFeedback?.length || 0) * 10;
  const feedbackScore = Math.min(1.0, Math.log10(1 + Math.max(0, feedbackCount)) / Math.log10(51));

  // 3. Completed Orders (20%)
  const ordersScore = Math.min(1.0, Math.log10(1 + Math.max(0, totalOrders)) / Math.log10(101));

  // 4. Successful Referral Bookings (15%)
  const referrals = vendor.successfulReferralBookings || vendor.referralsTotal || 0;
  const referralRatio = totalOrders > 0 ? referrals / totalOrders : 0;
  const referralScore = Math.min(1.0, (referralRatio / 0.32) * 0.6 + Math.min(1.0, referrals / 30) * 0.4);

  // 5. Repeat Customer Bookings (10%)
  const repeats = vendor.repeatCustomerBookings || vendor.repeatOrdersTotal || 0;
  const repeatRatio = totalOrders > 0 ? repeats / totalOrders : 0;
  const repeatScore = Math.min(1.0, (repeatRatio / 0.22) * 0.6 + Math.min(1.0, repeats / 20) * 0.4);

  // Weighted base score
  let score =
    (0.30 * smoothedReliability) +
    (0.25 * feedbackScore) +
    (0.20 * ordersScore) +
    (0.15 * referralScore) +
    (0.10 * repeatScore);

  // Local area demonstrated experience bonus
  if (requestedAreas && requestedAreas.length > 0) {
    const areaMetrics = getVendorAreaMetrics(vendor, requestedAreas, city);
    if (!areaMetrics.hasLimitedHistory && areaMetrics.completedOrders >= 4) {
      score += 0.05;
    }
  }

  return score;
}

/**
 * Filter the vendor dataset with full support for:
 * - Primary & Secondary service categories
 * - City & Serviceable area matching (with "Any Area in City" support)
 * - Target date availability verification (incorporating live calendar overrides)
 * - Guest capacity constraints (only where capacity is relevant)
 * - Verified transaction activity metrics (completed orders, repeat orders, referrals)
 * - Sorting: completed_orders, repeat_orders, referrals, price_asc, price_desc (AOV removed)
 */
export function filterVendors(
  filters: SearchFilters,
  calendarOverrides: CalendarOverrides = {},
  dataset: Vendor[] = DEMO_VENDORS
): { results: Vendor[]; totalMatched: number; criteriaApplied: string[] } {
  const criteriaApplied: string[] = [];

  let matched = dataset.filter((vendor) => {
    // 1. City Filter
    if (filters.city) {
      if (vendor.primaryCity.toLowerCase() !== filters.city.toLowerCase()) {
        return false;
      }
    }

    // 2. Category Filter (Matches either primary category OR secondary categories)
    const targetCategories: string[] = [];
    if (filters.categories && filters.categories.length > 0) {
      targetCategories.push(...filters.categories.filter((c) => c !== 'All' && c !== 'Vendors'));
    } else if (filters.category && filters.category !== 'All' && filters.category !== 'Vendors') {
      targetCategories.push(filters.category);
    }

    if (targetCategories.length > 0) {
      const anyCategoryMatches = targetCategories.some((tc) => {
        const targetCat = tc.toLowerCase();
        const primaryMatch =
          vendor.category.toLowerCase().includes(targetCat) ||
          targetCat.includes(vendor.category.toLowerCase());
        const secondaryMatch = vendor.secondaryCategories?.some(
          (sc) =>
            sc.toLowerCase().includes(targetCat) ||
            targetCat.includes(sc.toLowerCase())
        );

        // Special handling for Event Organizers & End-to-End providers
        const organizerMatch =
          (targetCat.includes('organizer') || targetCat.includes('planner')) &&
          (vendor.category === 'Event Organizers / Wedding Planners' ||
            vendor.category === 'End-to-End Event Management' ||
            vendor.category === 'End-to-End Event Management Providers');

        // Special handling for Decoration vs Flower Arrangements
        const flowerDecorMatch =
          (targetCat.includes('flower') || targetCat.includes('floral')) &&
          (vendor.category === 'Flower Arrangements' ||
            vendor.category === 'Decoration Services' ||
            vendor.category === 'Decoration and Flower Arrangements' ||
            vendor.secondaryCategories?.some((s) => s.includes('Flower') || s.includes('Decor')));

        return primaryMatch || secondaryMatch || organizerMatch || flowerDecorMatch;
      });

      if (!anyCategoryMatches) {
        return false;
      }
    }

    // 3. Serviceable Areas Filter (If specified, must serve at least one of the selected areas)
    if (filters.areas && filters.areas.length > 0) {
      const hasAreaIntersection = filters.areas.some((reqArea) =>
        vendor.serviceableAreas.some(
          (vArea) => vArea.toLowerCase() === reqArea.toLowerCase()
        )
      );
      if (!hasAreaIntersection) {
        return false;
      }
    }

    // 4. Guest Capacity Filter (PRD Requirement: Only apply to capacity-relevant categories!)
    if (filters.guestCount && filters.guestCount > 0) {
      const isSearchCategorySpecified =
        filters.category && filters.category !== 'All' && filters.category !== 'Vendors';
      const isCategoryCapacityConstrained = isSearchCategorySpecified
        ? CAPACITY_RELEVANT_CATEGORIES.some(
            (c) =>
              filters.category!.toLowerCase().includes(c.toLowerCase()) ||
              c.toLowerCase().includes(filters.category!.toLowerCase())
          )
        : CAPACITY_RELEVANT_CATEGORIES.includes(vendor.category) ||
          vendor.secondaryCategories?.some((sc) =>
            CAPACITY_RELEVANT_CATEGORIES.includes(sc)
          );

      if (isCategoryCapacityConstrained) {
        if (
          vendor.maximumGuestCapacity !== undefined &&
          vendor.maximumGuestCapacity < filters.guestCount
        ) {
          return false;
        }
      }
    }

    // 5. Target Date Availability Filter
    if (filters.date) {
      const statusOverride = calendarOverrides[vendor.id]?.[filters.date];
      const effectiveStatus: AvailabilityStatus =
        statusOverride || vendor.availabilityDates[filters.date] || 'Available';

      if (effectiveStatus === 'Fully Booked' || effectiveStatus === 'Unavailable') {
        return false;
      }
    }

    // 6. Minimum Completed Orders Filter
    if (filters.minOrders !== undefined && filters.minOrders > 0) {
      const orders = vendor.completedOrders ?? vendor.completedOrders90Days ?? 0;
      if (orders < filters.minOrders) {
        return false;
      }
    }

    // 7. Maximum Budget Filter (Starting Price)
    if (filters.maxBudget !== undefined && filters.maxBudget > 0) {
      if (vendor.startingPrice && vendor.startingPrice > filters.maxBudget) {
        return false;
      }
    }

    return true;
  });

  // Track applied criteria for UI summary tags
  if (filters.category && filters.category !== 'All') criteriaApplied.push(filters.category);
  if (filters.city) criteriaApplied.push(filters.city);
  if (filters.areas && filters.areas.length > 0) {
    criteriaApplied.push(`Area: ${filters.areas.join(', ')}`);
  } else if (filters.city) {
    criteriaApplied.push(`Any Area in ${filters.city}`);
  }
  if (filters.date) criteriaApplied.push(`Available: ${filters.date}`);
  if (filters.guestCount) {
    criteriaApplied.push(`${filters.guestCount} Guests`);
  }
  if (filters.minOrders) criteriaApplied.push(`≥ ${filters.minOrders} Completed Orders`);

  // Sorting: recommended (default), completed_orders, referrals, on_time_delivery, repeat_orders, price_asc, price_desc
  const sortBy = filters.sortBy || 'recommended';
  matched.sort((a, b) => {
    switch (sortBy) {
      case 'recommended': {
        const aScore = calculateVendorRankScore(a, filters.areas, filters.city);
        const bScore = calculateVendorRankScore(b, filters.areas, filters.city);
        return bScore - aScore;
      }
      case 'completed_orders': {
        const aOrders = a.completedOrders ?? a.completedOrders90Days ?? 0;
        const bOrders = b.completedOrders ?? b.completedOrders90Days ?? 0;
        return bOrders - aOrders;
      }
      case 'referrals': {
        const aMetrics = getVendorAreaMetrics(a, filters.areas, filters.city);
        const bMetrics = getVendorAreaMetrics(b, filters.areas, filters.city);
        const diff = bMetrics.customerReferrals - aMetrics.customerReferrals;
        if (diff !== 0) return diff;
        const aTotal = a.successfulReferralBookings ?? a.referralsTotal ?? 0;
        const bTotal = b.successfulReferralBookings ?? b.referralsTotal ?? 0;
        return bTotal - aTotal;
      }
      case 'on_time_delivery': {
        const aDelivery = a.onTimeDeliveryPercent ?? 90;
        const bDelivery = b.onTimeDeliveryPercent ?? 90;
        return bDelivery - aDelivery;
      }
      case 'repeat_orders': {
        const aMetrics = getVendorAreaMetrics(a, filters.areas, filters.city);
        const bMetrics = getVendorAreaMetrics(b, filters.areas, filters.city);
        const diff = bMetrics.repeatOrders - aMetrics.repeatOrders;
        if (diff !== 0) return diff;
        const aTotal = a.repeatCustomerBookings ?? a.repeatOrdersTotal ?? 0;
        const bTotal = b.repeatCustomerBookings ?? b.repeatOrdersTotal ?? 0;
        return bTotal - aTotal;
      }
      case 'price_asc':
        return (a.startingPrice || 9999999) - (b.startingPrice || 9999999);
      case 'price_desc':
        return (b.startingPrice || 0) - (a.startingPrice || 0);
      default: {
        const aScore = calculateVendorRankScore(a, filters.areas, filters.city);
        const bScore = calculateVendorRankScore(b, filters.areas, filters.city);
        return bScore - aScore;
      }
    }
  });

  return {
    results: matched,
    totalMatched: matched.length,
    criteriaApplied,
  };
}

/**
 * Get effective availability status for a vendor on a specific date,
 * checking any local calendar overrides first.
 * If date is unfinalized or not provided, returns 'Unverified Availability'.
 */
export function getEffectiveAvailability(
  vendor: Vendor,
  date?: string,
  calendarOverrides: CalendarOverrides = {}
): AvailabilityStatus {
  if (!date || date === 'Not finalized yet' || date.toLowerCase().includes('not finalized') || date === 'undecided') {
    return 'Unverified Availability';
  }
  if (calendarOverrides[vendor.id]?.[date]) {
    return calendarOverrides[vendor.id][date];
  }
  return vendor.availabilityDates[date] || 'Available';
}
