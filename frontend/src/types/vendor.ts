export type City = 'Mumbai' | 'Pune';

export type VendorCategory =
  | 'Catering and Food Services'
  | 'Decoration Services'
  | 'Flower Arrangements'
  | 'Decoration and Flower Arrangements'
  | 'Lighting Services'
  | 'DJ and Sound Systems'
  | 'Furniture and Equipment Rental'
  | 'Wedding Lawns and Venues'
  | 'Hotels and Guest Accommodation'
  | 'Hotels, Lodging and Guest Accommodation'
  | 'Photography and Videography'
  | 'Event Organizers / Wedding Planners'
  | 'End-to-End Event Management'
  | 'End-to-End Event Management Providers'
  | 'Logistics and Transportation'
  | 'Makeup and Mehendi Artists';

export const CANONICAL_CATEGORIES = [
  'Catering and Food Services',
  'Decoration Services',
  'Flower Arrangements',
  'Lighting Services',
  'DJ and Sound Systems',
  'Furniture and Equipment Rental',
  'Wedding Lawns and Venues',
  'Hotels and Guest Accommodation',
  'Photography and Videography',
  'Event Organizers / Wedding Planners',
  'End-to-End Event Management',
  'Logistics and Transportation',
  'Makeup and Mehendi Artists',
] as const;

export type CanonicalCategory = typeof CANONICAL_CATEGORIES[number];

export type AvailabilityStatus =
  | 'Available'
  | 'Tentative'
  | 'Fully Booked'
  | 'Unavailable'
  | 'Not Updated'
  | 'Unverified'
  | 'Unverified Availability';

export interface CustomerFeedback {
  id: string;
  customerName: string; // e.g. "A. Patil", "R. Shah"
  eventType: string; // e.g. "Wedding", "Engagement", "Reception", "Sangeet"
  location: string; // e.g. "Baner, Pune", "Andheri, Mumbai"
  comment: string; // Fictional customer feedback
  isVerifiedBooking: boolean; // Always true for verified completions
  eventMonthYear?: string; // e.g. "December 2025"
}

export interface AreaPerformance {
  completedOrders: number;
  repeatOrders: number;
  customerReferrals: number;
  areaLabel: string;
  hasLimitedHistory?: boolean;
}

export interface VendorReliability {
  onTimeDeliveryPercent: number;
  completedEvents: number;
  vendorCausedCancellations: number;
  serviceCommitmentsMetPercent: number;
}

export type VendorSortOption =
  | 'recommended'
  | 'completed_orders'
  | 'referrals'
  | 'on_time_delivery'
  | 'repeat_orders'
  | 'price_asc'
  | 'price_desc';

export interface Vendor {
  id: string;
  businessName: string;
  primaryCity: City;
  serviceableAreas: string[];
  category: VendorCategory;
  secondaryCategories?: VendorCategory[];
  description: string;
  serviceOfferings?: string[];
  maximumGuestCapacity?: number;
  maximumSimultaneousBookings: number;
  startingPrice?: number;
  priceUnit?: string; // e.g. "per plate", "per event", "per day", "per room"
  quotationRequired: boolean;
  availabilityDates: Record<string, AvailabilityStatus>;

  // Wedora Performance & Trust Reputation System (All-Time Window)
  completedOrders: number;
  successfulReferralBookings: number;
  repeatCustomerBookings: number;
  onTimeDeliveryPercent: number;
  verifiedCustomerFeedbackCount: number;
  vendorCausedCancellations: number;
  serviceCommitmentsMetPercent: number;

  // Verified Customer Feedback Records
  customerFeedback?: CustomerFeedback[];

  // Area-specific Breakdown
  completedOrdersArea?: Record<string, number>;
  repeatOrdersArea?: Record<string, number>;
  referralsArea?: Record<string, number>;
  repeatOrdersTotal?: number;
  referralsTotal?: number;

  // Retained internally for test/backward compatibility; not shown in UI
  completedOrders90Days?: number;
  averageOrderValue90Days?: number;

  portfolioImages: string[];
  serviceTags: string[];
  isNewToPlatform: boolean;
  contactEmail?: string;
  contactPhone?: string;
  profileCreatedAt?: string;
  isActive?: boolean;
  isDemoData?: boolean;
  isDemonstrationProfile?: boolean;
  demonstrationNote?: string;
  rating?: number;
  isNearbyCoverage?: boolean;
  nearbyCoverageNote?: string;
}

export interface SearchFilters {
  query?: string;
  category?: VendorCategory | string;
  categories?: (VendorCategory | string)[];
  city?: City | string;
  areas?: string[];
  date?: string; // YYYY-MM-DD
  guestCount?: number;
  minOrders?: number;
  maxBudget?: number;
  sortBy?: VendorSortOption;
}

export interface SearchIntent {
  rawQuery: string;
  detectedCity?: City;
  detectedAreas?: string[];
  detectedCategory?: VendorCategory;
  detectedCategories?: VendorCategory[];
  detectedDate?: string;
  isDateAnswer?: boolean;
  isDateNotFinalized?: boolean;
  detectedGuestCount?: number;
  detectedMinOrders?: number;
  detectedMaxBudget?: number;
  detectedOccasion?: string;
  detectedSortBy?: 'completed_orders' | 'repeat_orders' | 'referrals' | 'price_asc' | 'price_desc';
  isGreeting?: boolean;
  shortlistQuery?: { category?: string; isOrganizer?: boolean; city?: string; all?: boolean };
  shortlistRemoveVendor?: string;
  shortlistIndex?: number; // 0-indexed position (e.g. "shortlist the second vendor" -> 1)
  actionPrompt?: 'SELECT_OCCASION' | 'SELECT_DATE' | 'SELECT_LOCATION' | 'SELECT_GUESTS' | 'SELECT_CATEGORY' | 'SELECT_BUDGET';
  assistantReply: string;
  missingInformation?: string[];
  nextQuestion?: 1 | 2 | 3 | 4 | 5;
  flowCompleted?: boolean;
  isBudgetAnswer?: boolean;
  suggestedOptions?: string[];
}
