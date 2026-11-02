import React, { useEffect } from 'react';
import { Vendor } from '@/types/vendor';
import {
  MapPin,
  ShieldCheck,
  CalendarCheck,
  X,
  Layers,
  Check,
  Sparkles,
  Users,
  CheckCircle2,
  ThumbsUp,
  RotateCcw,
  Clock,
  MessageSquare,
  AlertCircle,
  Quote,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/components/dashboard';
import { getVendorAreaMetrics } from '@/utils/vendorFilters';
import { formatRating } from '@/utils/formatters';

interface VendorProfileModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onRequestQuote: (vendor: Vendor) => void;
  onShortlist?: (vendor: Vendor) => void;
  isShortlisted?: boolean;
  targetDate?: string;
  availabilityStatus?: string;
  selectedAreas?: string[];
  selectedCity?: string;
}

export function VendorProfileModal({
  vendor,
  onClose,
  onRequestQuote,
  onShortlist,
  isShortlisted = false,
  targetDate = '2026-12-15',
  availabilityStatus = 'Available',
  selectedAreas,
  selectedCity,
}: VendorProfileModalProps) {
  if (!vendor) return null;

  const metrics = getVendorAreaMetrics(vendor, selectedAreas, selectedCity);

  const isNewVendor =
    vendor.isNewToPlatform ||
    (vendor.completedOrders === 0 && (vendor.completedOrders90Days || 0) === 0);

  const completedOrders = vendor.completedOrders ?? vendor.completedOrders90Days ?? 0;
  const referrals = vendor.successfulReferralBookings ?? vendor.referralsTotal ?? 0;
  const repeats = vendor.repeatCustomerBookings ?? vendor.repeatOrdersTotal ?? 0;
  const onTimeDelivery = vendor.onTimeDeliveryPercent ?? 96;
  const feedbackCount = vendor.verifiedCustomerFeedbackCount ?? (vendor.customerFeedback?.length || 0);
  const cancellations = vendor.vendorCausedCancellations ?? 0;
  const commitmentsMet = vendor.serviceCommitmentsMetPercent ?? 97;
  const isDemonstrationData = vendor.isDemoData || vendor.isDemonstrationProfile;

  // Prevent background page from scrolling while modal is open (single active scroll area)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-3xl rounded-3xl bg-card shadow-float border border-gold/40 relative flex flex-col max-h-[88vh] overflow-hidden animate-rise">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-gold/20 relative shrink-0 bg-card">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-secondary"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex size-16 items-center justify-center arch bg-gradient-plum text-gold font-display text-2xl shrink-0 shadow-soft">
              {vendor.businessName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-gold font-semibold">
                  {vendor.category}
                </span>
                <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                  ID: {vendor.id}
                </span>
                <Status s={availabilityStatus} />
                {isDemonstrationData ? (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-semibold border border-amber-300 dark:border-amber-800">
                    Demonstration Profile (Demo Data)
                  </span>
                ) : isNewVendor ? (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-gold-soft text-navy px-2.5 py-0.5 rounded-full font-semibold border border-gold/40">
                    <Sparkles className="size-3 text-gold" />
                    New to Wedora
                  </span>
                ) : null}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display text-plum mt-1 font-semibold">
                {vendor.businessName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-navy">
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
                {vendor.rating && (
                  <>
                    <span className="text-muted">·</span>
                    <span className="flex items-center gap-1 font-semibold text-navy">
                      <Star className="size-3.5 fill-gold text-gold" />
                      {formatRating(vendor.rating, 4.8)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body - Sole Contained Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain">

        {/* ================= SECTION 3: VENDOR PERFORMANCE & TRUST ================= */}
        <div className="my-6 rounded-2xl bg-secondary/80 p-5 border border-gold/30">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-plum uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="size-4 text-gold" />
                Vendor Performance & Trust
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Differentiated performance indicators based on completed events (No five-star ratings)
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground bg-card/80 border px-2.5 py-1 rounded-full font-medium">
              Performance History
            </span>
          </div>

          {isNewVendor ? (
            /* Section 7: Fair Visibility for New Vendors */
            <div className="mt-4 p-4 rounded-xl bg-card border border-gold/30 flex items-start gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-full bg-gold-soft text-gold shrink-0 mt-0.5">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-navy">New to Wedora</h4>
                <div className="text-xs font-medium text-plum">
                  Building their performance history
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  This vendor has completed official onboarding and identity verification on Wedora. As an emerging partner, their past transactions are not yet recorded in the all-time automated completion ledger. You can connect with them directly for custom proposals, sample portfolios, and initial availability holds.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {/* 5 Core Trust Signals (PRD Section 3.1 - 3.5) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 3.1 Completed Orders */}
                <div className="rounded-xl bg-card p-3.5 border shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold text-navy flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-gold" />
                      Completed Orders
                    </span>
                  </div>
                  <div className="font-display text-xl text-navy font-bold mt-2">
                    {completedOrders} Completed Orders
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    Events successfully completed through Wedora
                  </span>
                </div>

                {/* 3.2 Successful Referral Bookings */}
                <div className="rounded-xl bg-card p-3.5 border shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold text-navy flex items-center gap-1.5">
                      <ThumbsUp className="size-3.5 text-gold" />
                      Referral Bookings
                    </span>
                  </div>
                  <div className="font-display text-xl text-plum font-bold mt-2">
                    {referrals} Successful Referral Bookings
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    New customers who booked after a previous customer's recommendation
                  </span>
                </div>

                {/* 3.3 Repeat Customer Bookings */}
                <div className="rounded-xl bg-card p-3.5 border shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold text-navy flex items-center gap-1.5">
                      <RotateCcw className="size-3.5 text-gold" />
                      Repeat Bookings
                    </span>
                  </div>
                  <div className="font-display text-xl text-navy font-bold mt-2">
                    {repeats} Repeat Customer Bookings
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    Bookings from returning customers
                  </span>
                </div>

                {/* 3.4 On-Time Service Delivery */}
                <div className="rounded-xl bg-card p-3.5 border shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold text-navy flex items-center gap-1.5">
                      <Clock className="size-3.5 text-gold" />
                      On-Time Delivery
                    </span>
                  </div>
                  <div className="font-display text-xl text-success font-bold mt-2">
                    {onTimeDelivery}% On-Time Delivery
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    Based on recorded event delivery outcomes
                  </span>
                </div>

                {/* 3.5 Verified Customer Feedback */}
                <div className="rounded-xl bg-card p-3.5 border shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-[11px] font-semibold text-navy flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-gold" />
                      Verified Customer Feedback
                    </span>
                  </div>
                  <div className="font-display text-xl text-navy font-bold mt-2">
                    {feedbackCount} Verified Customer Experiences
                  </div>
                  <span className="text-[11px] text-muted-foreground mt-1 leading-snug">
                    Feedback from customers with completed event bookings (No 5-star ratings)
                  </span>
                </div>
              </div>

              {/* ================= SECTION 5: SERVICE RELIABILITY INDICATORS ================= */}
              <div className="rounded-xl bg-card p-4 border shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-navy uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-gold" />
                    Service Reliability
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Operational Records
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-secondary/60">
                    <span className="text-[11px] text-muted-foreground block">On-Time Delivery:</span>
                    <strong className="text-sm font-semibold text-success">{onTimeDelivery}%</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/60">
                    <span className="text-[11px] text-muted-foreground block">Completed Events:</span>
                    <strong className="text-sm font-semibold text-navy">{completedOrders}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/60">
                    <span className="text-[11px] text-muted-foreground block">Vendor Cancellations:</span>
                    <strong className="text-sm font-semibold text-navy">{cancellations}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-secondary/60">
                    <span className="text-[11px] text-muted-foreground block">Commitments Met:</span>
                    <strong className="text-sm font-semibold text-plum">{commitmentsMet}%</strong>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  * Operational metrics are derived from recorded milestone deliveries and completed booking ledgers.
                </p>
              </div>

              {/* ================= SECTION 6: AREA-SPECIFIC PERFORMANCE ================= */}
              <div className="rounded-xl bg-card p-4 border shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-navy uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-gold" />
                    Area Experience: {selectedAreas && selectedAreas.length > 0 ? selectedAreas.join(', ') : vendor.primaryCity}
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Local Insights
                  </span>
                </div>

                {metrics.hasLimitedHistory ? (
                  <div className="p-3 rounded-lg bg-secondary/70 border border-gold/20 flex items-start gap-2.5">
                    <AlertCircle className="size-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-navy">
                        Limited performance history in this area
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        This vendor has focused activity across other localities in {vendor.primaryCity} ({vendor.serviceableAreas.join(', ')}). They are fully equipped and verified to deliver events in this area.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg bg-secondary/60 flex flex-col justify-between">
                        <span className="text-[11px] text-muted-foreground">Completed Orders:</span>
                        <strong className="text-sm font-semibold text-navy mt-1">
                          {metrics.completedOrders} Completed Orders
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-secondary/60 flex flex-col justify-between">
                        <span className="text-[11px] text-muted-foreground">Referral Bookings:</span>
                        <strong className="text-sm font-semibold text-plum mt-1">
                          {metrics.customerReferrals} Successful Referral Bookings
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-lg bg-secondary/60 flex flex-col justify-between">
                        <span className="text-[11px] text-muted-foreground">Repeat Bookings:</span>
                        <strong className="text-sm font-semibold text-navy mt-1">
                          {metrics.repeatOrders} Repeat Customer Bookings
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= SECTION 4: WHAT CUSTOMERS EXPERIENCED ================= */}
        <div className="my-6 rounded-2xl bg-secondary/80 p-5 border border-gold/30">
          <div className="flex items-center justify-between border-b border-gold/20 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-plum uppercase tracking-wider flex items-center gap-2">
                <Quote className="size-4 text-gold" />
                What Customers Experienced
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Authentic customer experiences from completed bookings (Balanced feedback)
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground bg-card/80 border px-2.5 py-1 rounded-full font-medium">
              Verified Feedback
            </span>
          </div>

          {vendor.customerFeedback && vendor.customerFeedback.length > 0 ? (
            <div className="space-y-3">
              {vendor.customerFeedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-card p-3.5 border shadow-xs space-y-2 transition hover:border-gold/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <strong className="text-navy font-semibold">{item.customerName}</strong>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground font-medium">
                        {item.eventType}, {item.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.eventMonthYear && (
                        <span className="text-[10px] text-muted-foreground">
                          {item.eventMonthYear}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success-soft px-2 py-0.5 rounded-full">
                        <ShieldCheck className="size-3" />
                        Verified Booking
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-navy/90 leading-relaxed italic">
                    "{item.comment}"
                  </p>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground pt-1 italic text-center">
                * All customer feedback shown represents simulated booking experiences for demonstration purposes.
              </p>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground italic text-center py-4 bg-card rounded-xl border">
              No written customer feedback yet for this vendor profile.
            </div>
          )}
        </div>

        {/* Business Profile Description */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-navy">
            Business Profile & Description
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {vendor.description}
          </p>
        </div>

        {/* Service Offerings */}
        {vendor.serviceOfferings && vendor.serviceOfferings.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-xs font-semibold text-navy flex items-center gap-1.5 mb-2">
              <Sparkles className="size-3.5 text-gold" />
              Service Offerings & Capabilities:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {vendor.serviceOfferings.map((so) => (
                <span
                  key={so}
                  className="rounded-lg bg-gold-soft/40 px-2.5 py-1 text-[11px] font-medium text-navy border border-gold/30"
                >
                  {so}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Secondary Categories if End-to-End or Multi-service */}
        {vendor.secondaryCategories && vendor.secondaryCategories.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <h4 className="text-xs font-semibold text-navy flex items-center gap-1.5 mb-2">
              <Layers className="size-3.5 text-gold" />
              Additional Coordinated Services:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {vendor.secondaryCategories.map((sc) => (
                <span
                  key={sc}
                  className="rounded-full bg-plum-soft px-2.5 py-1 text-[11px] font-medium text-plum border border-plum/20"
                >
                  {sc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Capacity & Pricing Specifications */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl bg-secondary/70 p-3.5 text-xs">
          <div>
            <span className="text-muted-foreground block font-medium">Guest Capacity:</span>
            <span className="font-semibold text-navy">
              {vendor.maximumGuestCapacity
                ? `Up to ${vendor.maximumGuestCapacity} guests`
                : 'Customizable / Open'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Max Simultaneous:</span>
            <span className="font-semibold text-navy">
              {vendor.maximumSimultaneousBookings
                ? `${vendor.maximumSimultaneousBookings} events/day`
                : '1 event/day'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block font-medium">Starting Price:</span>
            <span className="font-semibold text-plum">
              {vendor.startingPrice
                ? `₹${vendor.startingPrice.toLocaleString('en-IN')} (${vendor.priceUnit || 'per event'})`
                : 'Quotation Required'}
            </span>
          </div>
        </div>

        {/* Calendar Note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-navy bg-gold-soft/50 p-2.5 rounded-xl border border-gold/30">
          <CalendarCheck className="size-4 text-gold shrink-0" />
          <span>
            Calendar status for <strong>{targetDate}</strong>: <strong className="text-plum">{availabilityStatus}</strong> (Confirmation required for contract lock).
          </span>
        </div>
      </div>

      {/* Modal Footer Actions - Always accessible at bottom without extra scrolling */}
      <div className="p-4 sm:p-6 border-t border-border bg-card/95 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="text-xs text-muted-foreground">
          Contact: {vendor.contactEmail || `contact@${vendor.id}.demo`}
        </div>
        <div className="flex items-center gap-2">
          {onShortlist && (
            <Button
              variant={isShortlisted ? 'gold' : 'soft'}
              size="sm"
              className="text-xs"
              onClick={() => onShortlist(vendor)}
            >
              {isShortlisted ? <Check className="size-3 mr-1" /> : null}
              {isShortlisted ? 'Shortlisted ✓' : 'Add to Shortlist'}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="hero"
            size="sm"
            onClick={() => {
              onClose();
              onRequestQuote(vendor);
            }}
          >
            Request Quotation
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}
