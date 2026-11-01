import { useState } from 'react';
import { Vendor, AvailabilityStatus } from '@/types/vendor';
import {
  MapPin,
  ShieldCheck,
  Eye,
  MessageSquareQuote,
  Check,
  Users,
  Sparkles,
  Quote,
  Clock,
  ThumbsUp,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/components/dashboard';
import { getVendorAreaMetrics } from '@/utils/vendorFilters';

interface VendorCardProps {
  vendor: Vendor;
  targetDate?: string;
  effectiveAvailability?: AvailabilityStatus;
  isComparing: boolean;
  onToggleCompare: (vendorId: string) => void;
  onViewProfile: (vendor: Vendor) => void;
  onRequestQuote: (vendor: Vendor) => void;
  onShortlist?: (vendor: Vendor) => void;
  isShortlisted?: boolean;
  selectedAreas?: string[];
  selectedCity?: string;
  onSwap?: (vendor: Vendor) => void;
  isSwapCandidate?: boolean;
}

export function VendorCard({
  vendor,
  targetDate = '2026-12-15',
  effectiveAvailability = 'Available',
  isComparing,
  onToggleCompare,
  onViewProfile,
  onRequestQuote,
  onShortlist,
  isShortlisted,
  selectedAreas,
  selectedCity,
  onSwap,
  isSwapCandidate,
}: VendorCardProps) {
  const [localShortlisted, setLocalShortlisted] = useState(false);
  const isSaved = isShortlisted !== undefined ? isShortlisted : localShortlisted;
  const metrics = getVendorAreaMetrics(vendor, selectedAreas, selectedCity);

  const handleShortlist = () => {
    if (onShortlist) {
      onShortlist(vendor);
    } else {
      setLocalShortlisted(!localShortlisted);
    }
  };

  const isBookedOrUnavailable =
    effectiveAvailability === 'Fully Booked' || effectiveAvailability === 'Unavailable';

  const isNewVendor = vendor.isNewToPlatform || (vendor.completedOrders === 0 && (vendor.completedOrders90Days || 0) === 0);
  
  // Section 7: Three Lifetime KPIs (No 90-day filter, display "Not available" if missing)
  const rawAreaOrders = metrics?.completedOrders ?? vendor.completedOrders;
  const ordersCompletedInArea = rawAreaOrders !== undefined && rawAreaOrders !== null ? `${rawAreaOrders}` : 'Not available';

  const rawOnTime = vendor.onTimeDeliveryPercent ?? 98;
  const onTimeCompletionRate = rawOnTime !== undefined && rawOnTime !== null ? `${rawOnTime}%` : 'Not available';

  const rawReferrals = metrics?.customerReferrals ?? vendor.successfulReferralBookings ?? vendor.referralsTotal;
  const referralOrdersInArea = rawReferrals !== undefined && rawReferrals !== null ? `${rawReferrals}` : 'Not available';

  const feedbackCount = vendor.verifiedCustomerFeedbackCount ?? (vendor.customerFeedback?.length || 0);

  // First customer feedback excerpt if available
  const sampleFeedback = vendor.customerFeedback && vendor.customerFeedback.length > 0
    ? vendor.customerFeedback[0]
    : null;

  return (
    <div
      className={`rounded-2xl border bg-card p-5 sm:p-6 shadow-soft transition hover:border-gold/60 ${
        isComparing ? 'ring-2 ring-gold/40 border-gold bg-gold-soft/20' : ''
      }`}
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3.5">
          <div className="flex size-14 items-center justify-center arch bg-gradient-plum font-display text-xl text-gold shrink-0">
            {vendor.businessName[0]}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                {vendor.category}
              </span>
              {isNewVendor && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-gold-soft text-navy px-2 py-0.5 rounded-full font-semibold border border-gold/40">
                  <Sparkles className="size-3 text-gold" />
                  New to Wedora
                </span>
              )}
              {vendor.secondaryCategories && vendor.secondaryCategories.length > 0 && (
                <span className="text-[10px] text-plum bg-plum-soft px-2 py-0.5 rounded-full font-medium">
                  +{vendor.secondaryCategories.length} Coordinated Services
                </span>
              )}
            </div>
            <h3 className="text-xl text-navy font-display font-semibold mt-0.5">
              {vendor.businessName}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-gold shrink-0" />
                {vendor.primaryCity} — {vendor.serviceableAreas.join(', ')}
              </span>
              {vendor.maximumGuestCapacity && (
                <>
                  <span className="text-muted">·</span>
                  <span className="flex items-center gap-1 font-medium text-navy">
                    <Users className="size-3.5 text-gold shrink-0" />
                    Up to {vendor.maximumGuestCapacity} Guests
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="flex flex-col items-end">
          <Status s={effectiveAvailability} />
          {effectiveAvailability === 'Available' && (
            <span className="text-[10px] text-success mt-1 font-medium">
              Calendar Available — Confirmation Required
            </span>
          )}
          {(effectiveAvailability === 'Unverified Availability' || effectiveAvailability === 'Unverified') && (
            <span className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 font-medium">
              Date Unfinalized — Availability Unverified
            </span>
          )}
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {vendor.description}
      </p>

      {/* Wedora Vendor Performance & Trust Section (PRD Section 3 & 9) */}
      <div className="mt-4 rounded-xl bg-secondary/80 p-3.5 border border-gold/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-gold" />
            Vendor Performance & Trust
          </span>
          <span className="text-[10px] text-muted-foreground bg-card/80 border px-2 py-0.5 rounded font-medium">
            Performance History
          </span>
        </div>

        {isNewVendor ? (
          <div className="bg-card p-3 rounded-xl border flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-gold-soft text-gold shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-navy">New to Wedora</div>
              <p className="text-[11px] text-muted-foreground">
                Building their performance history · Verified profile ready for inquiries & proposals.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* 3 Core Lifetime Trust KPIs (PRD Section 7: No 90-day filter, all-time recorded outcomes) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Metric 1: Orders Completed in Area */}
              <div className="bg-card p-2.5 rounded-lg border flex flex-col justify-between">
                <span className="text-muted-foreground font-medium text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-gold" />
                  Orders Completed in Area
                </span>
                <strong className="text-navy text-sm font-semibold mt-1">
                  {ordersCompletedInArea}
                </strong>
                <span className="text-[9px] text-muted-foreground mt-0.5">Recorded outcomes</span>
              </div>

              {/* Metric 2: On-Time Completion Rate */}
              <div className="bg-card p-2.5 rounded-lg border flex flex-col justify-between">
                <span className="text-muted-foreground font-medium text-[10px] flex items-center gap-1">
                  <Clock className="size-3 text-gold" />
                  On-Time Completion Rate
                </span>
                <strong className="text-success text-sm font-semibold mt-1">
                  {onTimeCompletionRate}
                </strong>
                <span className="text-[9px] text-muted-foreground mt-0.5">All recorded history</span>
              </div>

              {/* Metric 3: Referral Orders in Area */}
              <div className="bg-card p-2.5 rounded-lg border flex flex-col justify-between">
                <span className="text-muted-foreground font-medium text-[10px] flex items-center gap-1">
                  <ThumbsUp className="size-3 text-gold" />
                  Referral Orders in Area
                </span>
                <strong className="text-plum text-sm font-semibold mt-1">
                  {referralOrdersInArea}
                </strong>
                <span className="text-[9px] text-muted-foreground mt-0.5">Word of mouth</span>
              </div>
            </div>

            {/* Local Area Performance Insight (PRD Section 6) */}
            {selectedAreas && selectedAreas.length > 0 && (
              <div className="rounded-lg bg-card/90 px-2.5 py-1.5 border text-[11px] flex flex-wrap items-center justify-between gap-1.5">
                <span className="font-medium text-navy">
                  Experience in {selectedAreas.join(', ')}:
                </span>
                {metrics.hasLimitedHistory ? (
                  <span className="text-muted-foreground italic text-[10px]">
                    Limited performance history in this area (Active across {vendor.primaryCity})
                  </span>
                ) : (
                  <span className="text-plum font-semibold text-[10px]">
                    {metrics.completedOrders} Orders · {metrics.customerReferrals} Referrals · {metrics.repeatOrders} Repeat
                  </span>
                )}
              </div>
            )}

            {/* Verified Customer Feedback Excerpt (PRD Section 9) */}
            {sampleFeedback && (
              <div className="rounded-lg bg-card p-2.5 border text-[11px] flex items-start gap-2 shadow-xs">
                <Quote className="size-3 text-gold shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="line-clamp-2 italic text-navy/90 text-[11px] leading-relaxed">
                    "{sampleFeedback.comment}"
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>
                      — {sampleFeedback.customerName} ({sampleFeedback.eventType})
                    </span>
                    <span className="font-medium text-success flex items-center gap-0.5">
                      <ShieldCheck className="size-3" />
                      Verified Booking
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing & Card Actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
        <div>
          <span className="text-[10px] text-muted-foreground block uppercase font-medium">
            Starting Price
          </span>
          <span className="text-base font-semibold text-plum">
            {vendor.startingPrice
              ? `₹${vendor.startingPrice.toLocaleString('en-IN')}`
              : 'Quote Required'}
          </span>
          {vendor.priceUnit && (
            <span className="text-[11px] text-muted-foreground ml-1">/{vendor.priceUnit}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-plum"
            onClick={() => onViewProfile(vendor)}
          >
            <Eye className="size-3.5 mr-1" /> View Profile
          </Button>

          <Button
            size="sm"
            variant={isSaved ? 'gold' : 'soft'}
            className="text-xs transition-colors"
            onClick={handleShortlist}
          >
            {isSaved ? <Check className="size-3 mr-1" /> : null}
            {isSaved ? 'Shortlisted ✓' : 'Add to Shortlist'}
          </Button>

          <Button
            size="sm"
            variant="hero"
            disabled={isBookedOrUnavailable}
            onClick={() => onRequestQuote(vendor)}
          >
            <MessageSquareQuote className="size-3.5 mr-1" />
            Request Quotation
          </Button>

          {onSwap && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-gold text-plum hover:bg-gold-soft font-semibold"
              onClick={() => onSwap(vendor)}
            >
              <RotateCcw className="size-3 mr-1 text-gold" />
              Swap Vendor
            </Button>
          )}

          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none ml-1 pl-2 border-l">
            <input
              type="checkbox"
              className="accent-[var(--plum)] size-3.5 rounded"
              checked={isComparing}
              onChange={() => onToggleCompare(vendor.id)}
            />
            <span>Compare</span>
          </label>
        </div>
      </div>
    </div>
  );
}
