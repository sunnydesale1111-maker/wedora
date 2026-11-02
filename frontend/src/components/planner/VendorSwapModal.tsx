import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRightLeft,
  Check,
  X,
  AlertTriangle,
  Calendar,
  Star,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { Button } from '@/components/ui/button';
import { DEMO_VENDORS } from '@/data/demoVendors';
import { BASE_MANUAL_COLLABORATIONS } from '@/data/plannerCollaborations';
import {
  getEligibleReplacementVendors,
  isSameCategory,
  normalizeVendorCategory,
  SwapAlternativeItem,
} from '@/utils/vendorSwapHelper';
import { saveVendorSwapToSupabase, checkSlotAvailability } from '@/lib/supabaseData';

export interface VendorSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalVendor?: Vendor | null;
  replacementVendor?: Vendor | null;
  eventName: string;
  eventDate: string;
  eventCity?: string;
  eventArea?: string;
  eventSlot?: string;
  eventId?: string;
  selectedVendors?: Vendor[];
  onConfirmSwap: (originalVendor: Vendor, replacementVendor: Vendor) => void;
}

export const VendorSwapModal: React.FC<VendorSwapModalProps> = ({
  isOpen,
  onClose,
  originalVendor,
  replacementVendor,
  eventName,
  eventDate,
  eventCity = 'Pune',
  eventArea = 'Baner',
  eventSlot = 'FULL_DAY',
  eventId = 'evt-01',
  selectedVendors = [],
  onConfirmSwap,
}) => {
  // Navigation Steps: 'SELECT' (browse multiple same-category alternatives) -> 'CONFIRM' (review and commit)
  const [step, setStep] = useState<'SELECT' | 'CONFIRM'>('SELECT');
  const [selectedReplacement, setSelectedReplacement] = useState<Vendor | null>(null);

  // Active filters and event slot parameters
  const [activeDate, setActiveDate] = useState<string>(eventDate || '2026-12-15');
  const [activeSlot, setActiveSlot] = useState<string>(eventSlot || 'FULL_DAY');
  const [categoryFilterTab, setCategoryFilterTab] = useState<'ALL' | 'PARTNERS' | 'ALTERNATIVES'>('ALL');

  // Expanded card for "View Details"
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  // Pagination / View More state
  const [visibleCount, setVisibleCount] = useState<number>(5);

  // Live conflict validation state
  const [isValidatingConflict, setIsValidatingConflict] = useState<boolean>(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // SSR mount check for React portal
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const scrollPositionRef = useRef<number>(0);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Strict Background Scroll Lock, Position Preservation, and Escape Key Handling
  useEffect(() => {
    if (!isOpen) return;

    // 1. Capture exact current scroll position before modal locks the background
    const scrollY =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    scrollPositionRef.current = scrollY;

    // 2. Capture the element that triggered the modal (Swap button)
    triggerElementRef.current = document.activeElement as HTMLElement | null;

    // 3. Prevent background scrolling without causing page layout jump
    const originalOverflow = document.body.style.overflow;
    const originalOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';

    // 4. Keyboard Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);

      // Restore background scroll behavior
      document.body.style.overflow = originalOverflow;
      document.body.style.overscrollBehavior = originalOverscroll;

      // Restore exact previous scroll position instantly without smooth scrolling jump
      window.scrollTo({
        top: scrollPositionRef.current,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      // Restore focus to original Swap button without triggering automatic page scrolling
      if (
        triggerElementRef.current &&
        typeof triggerElementRef.current.focus === 'function'
      ) {
        try {
          triggerElementRef.current.focus({ preventScroll: true });
        } catch {
          triggerElementRef.current.focus();
        }
      }
    };
  }, [isOpen, onClose]);

  // Reset state whenever modal opens or originalVendor changes
  useEffect(() => {
    if (isOpen) {
      setActiveDate(eventDate || '2026-12-15');
      setActiveSlot(eventSlot || 'FULL_DAY');
      setVisibleCount(5);
      setExpandedVendorId(null);
      setConflictError(null);
      setIsSubmitting(false);

      if (replacementVendor && !originalVendor) {
        setSelectedReplacement(replacementVendor);
        setStep('CONFIRM');
      } else {
        setSelectedReplacement(replacementVendor || null);
        setStep('SELECT');
      }
    }
  }, [isOpen, originalVendor, replacementVendor, eventDate, eventSlot]);

  // Compute eligible vendors query results
  const queryResult = useMemo(() => {
    if (!originalVendor) {
      return {
        items: [],
        totalEligible: 0,
        onlyOneOption: false,
        requiresDateOrSlot: false,
      };
    }

    const selectedIds = selectedVendors.map((v) => v.id);

    return getEligibleReplacementVendors({
      vendorToReplace: originalVendor,
      allVendors: DEMO_VENDORS,
      location: eventArea ? `${eventArea}, ${eventCity}` : eventCity,
      eventDate: activeDate,
      slot: activeSlot,
      selectedVendorIds: selectedIds,
      collaborations: BASE_MANUAL_COLLABORATIONS,
    });
  }, [originalVendor, activeDate, activeSlot, eventArea, eventCity, selectedVendors]);

  // Filter items by tab: ALL, PARTNERS, ALTERNATIVES
  const filteredItems = useMemo(() => {
    if (categoryFilterTab === 'PARTNERS') {
      return queryResult.items.filter((item) => item.isPastPartner);
    }
    if (categoryFilterTab === 'ALTERNATIVES') {
      return queryResult.items.filter((item) => !item.isPastPartner);
    }
    return queryResult.items;
  }, [queryResult.items, categoryFilterTab]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Handlers
  const handleSelectReplacement = (vendor: Vendor) => {
    setSelectedReplacement(vendor);
    setConflictError(null);
    setStep('CONFIRM');
  };

  const handleConfirm = async () => {
    if (!originalVendor || !selectedReplacement) return;

    setIsValidatingConflict(true);
    setConflictError(null);
    setIsSubmitting(true);

    try {
      // 1. Live Backend Conflict Check in Supabase to prevent race conditions
      const conflict = await checkSlotAvailability(selectedReplacement.id, activeDate, activeSlot);
      if (!conflict.isAvailable) {
        setConflictError(conflict.reason || `Conflict detected: ${selectedReplacement.businessName} is already booked on ${activeDate}.`);
        setIsValidatingConflict(false);
        setIsSubmitting(false);
        return;
      }

      // 2. Persist to Supabase timeline tasks and availability
      const saveRes = await saveVendorSwapToSupabase({
        eventId,
        originalVendorId: originalVendor.id,
        originalVendorName: originalVendor.businessName,
        replacementVendorId: selectedReplacement.id,
        replacementVendorName: selectedReplacement.businessName,
        category: originalVendor.category,
        eventDate: activeDate,
        slot: activeSlot,
      });

      if (!saveRes.success) {
        setConflictError(saveRes.error || 'Failed to persist vendor swap in database.');
        setIsValidatingConflict(false);
        setIsSubmitting(false);
        return;
      }

      // 3. Update application state via callback
      onConfirmSwap(originalVendor, selectedReplacement);
      onClose();
    } catch (err: any) {
      setConflictError(err?.message || 'An error occurred while confirming vendor swap.');
    } finally {
      setIsValidatingConflict(false);
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !originalVendor || !isMounted) return null;

  const originalPrice = originalVendor.startingPrice || 0;
  const replacementPrice = selectedReplacement?.startingPrice || 0;
  const priceDiff = replacementPrice - originalPrice;
  const canonicalCategory = normalizeVendorCategory(originalVendor.category);

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-6 pb-3 sm:pb-6 px-3 sm:px-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      data-testid="vendor-swap-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="swap-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-card w-full max-w-3xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] rounded-3xl border border-gold/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 shrink-0">
              <ArrowRightLeft className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="swap-modal-title"
                  data-testid="swap-modal-title"
                  className="text-lg sm:text-xl font-display font-bold text-plum truncate"
                >
                  {step === 'SELECT'
                    ? `Swap Vendor: ${originalVendor.businessName}`
                    : 'Confirm Vendor Replacement'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold-soft px-2.5 py-0.5 rounded-full border border-gold/30">
                  {canonicalCategory}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Event: <strong className="text-navy">{eventName}</strong> • Location:{' '}
                {eventArea ? `${eventArea}, ${eventCity}` : eventCity}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition shrink-0 ml-2"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* STEP 1: SELECT ELIGIBLE REPLACEMENT VENDOR */}
        {step === 'SELECT' && (
          <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-5">
            {/* Context & Scope Strip: Replacing Original Vendor Summary */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  Vendor to Replace
                </span>
                <h4 className="font-display font-semibold text-navy text-sm">
                  {originalVendor.businessName}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Base Price: ₹{originalPrice.toLocaleString('en-IN')}{' '}
                  {originalVendor.priceUnit ? `(${originalVendor.priceUnit})` : ''} • Category:{' '}
                  {canonicalCategory}
                </p>
              </div>

              {/* Slot / Date Controls for Real-time Availability */}
              <div className="flex items-center gap-2 bg-card p-1.5 rounded-xl border border-border">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground px-2">
                  <Calendar className="size-3 text-gold" />
                  <input
                    type="date"
                    value={activeDate}
                    onChange={(e) => setActiveDate(e.target.value)}
                    className="bg-transparent font-semibold text-navy focus:outline-none text-[11px]"
                  />
                </div>
                <div className="border-l border-border pl-2 pr-1">
                  <select
                    value={activeSlot}
                    onChange={(e) => setActiveSlot(e.target.value)}
                    className="bg-transparent font-semibold text-navy focus:outline-none text-[11px]"
                  >
                    <option value="FULL_DAY">Full Day</option>
                    <option value="FIRST_HALF">First Half (Morning)</option>
                    <option value="SECOND_HALF">Second Half (Evening)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Count Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <button
                  onClick={() => setCategoryFilterTab('ALL')}
                  className={`px-3 py-1.5 rounded-full transition ${
                    categoryFilterTab === 'ALL'
                      ? 'bg-plum text-white shadow-xs'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  All Eligible ({queryResult.totalEligible})
                </button>
                <button
                  onClick={() => setCategoryFilterTab('PARTNERS')}
                  className={`px-3 py-1.5 rounded-full transition ${
                    categoryFilterTab === 'PARTNERS'
                      ? 'bg-plum text-white shadow-xs'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Past Partners ({queryResult.items.filter((i) => i.isPastPartner).length})
                </button>
                <button
                  onClick={() => setCategoryFilterTab('ALTERNATIVES')}
                  className={`px-3 py-1.5 rounded-full transition ${
                    categoryFilterTab === 'ALTERNATIVES'
                      ? 'bg-plum text-white shadow-xs'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Other Verified ({queryResult.items.filter((i) => !i.isPastPartner).length})
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground">
                Showing {Math.min(visibleCount, filteredItems.length)} of {filteredItems.length} options
              </span>
            </div>

            {/* Special Notice for Single Eligible Vendor */}
            {queryResult.onlyOneOption && (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5"
                data-testid="single-result-notice"
              >
                <Info className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Limited Available Matches</p>
                  <p className="text-[11px] text-amber-800">
                    Only 1 matching vendor is currently eligible and available in this category for{' '}
                    <strong>{activeDate}</strong> ({activeSlot.replace('_', ' ')}).
                  </p>
                </div>
              </div>
            )}

            {/* Zero Results State */}
            {filteredItems.length === 0 && (
              <div
                className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center space-y-3"
                data-testid="no-vendors-empty-state"
              >
                <AlertTriangle className="size-9 text-gold mx-auto" />
                <h4 className="font-display font-semibold text-navy text-base">
                  No Eligible Replacement Vendors Found
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  No other active <strong>{canonicalCategory}</strong> vendors are currently
                  available for <strong>{activeDate}</strong> ({activeSlot}) serving{' '}
                  {eventArea ? `${eventArea}, ${eventCity}` : eventCity}. Try selecting a different
                  time slot or adjusting your event date.
                </p>
              </div>
            )}

            {/* VENDORS CARDS LIST */}
            <div className="space-y-3.5" data-testid="replacement-vendor-list">
              {visibleItems.map(({ vendor, isPastPartner, eventsCompletedTogether, clientRating, collaborationNotes, isAvailable, dateStatus, priceDiffWithOriginal, isNearbyCoverage, nearbyCoverageNote }) => {
                const isExpanded = expandedVendorId === vendor.id;

                return (
                  <div
                    key={vendor.id}
                    data-testid={`replacement-vendor-card-${vendor.id}`}
                    className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs hover:border-gold/60 transition space-y-3"
                  >
                    {/* Top Row: Badges, Title, Price */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isPastPartner ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                              <ShieldCheck className="size-3 text-emerald-700" />
                              Verified Past Partner ({eventsCompletedTogether} past events)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold-soft px-2 py-0.5 rounded-full border border-gold/30">
                              Verified Alternative
                            </span>
                          )}

                          {isNearbyCoverage && nearbyCoverageNote && (
                            <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                              {nearbyCoverageNote}
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-navy text-base leading-tight">
                          {vendor.businessName}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                          <MapPin className="size-3 text-gold shrink-0" />
                          <span>
                            {vendor.primaryCity}{' '}
                            {vendor.serviceableAreas && vendor.serviceableAreas.length > 0
                              ? `(${vendor.serviceableAreas.slice(0, 3).join(', ')})`
                              : ''}
                          </span>
                        </div>
                      </div>

                      {/* Pricing & Variance */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold font-display text-navy">
                          ₹{(vendor.startingPrice || 0).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-muted-foreground font-normal">
                            {vendor.priceUnit ? `(${vendor.priceUnit})` : ''}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium">
                          {priceDiffWithOriginal > 0 ? (
                            <span className="text-amber-600">
                              +₹{priceDiffWithOriginal.toLocaleString('en-IN')} vs current
                            </span>
                          ) : priceDiffWithOriginal < 0 ? (
                            <span className="text-emerald-700">
                              -₹{Math.abs(priceDiffWithOriginal).toLocaleString('en-IN')} savings
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Price matched</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Performance & Availability Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-muted/40 border border-border/70 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Star className="size-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="font-semibold text-navy">{clientRating} / 5.0</span>
                        <span className="text-[10px] text-muted-foreground">
                          ({vendor.completedOrders || 0} orders)
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-navy">
                          {vendor.onTimeDeliveryPercent || 96}% On-Time
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-1 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <Clock className="size-3 text-emerald-600 shrink-0" />
                        <span>Available for {activeSlot.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Expandable Details Section */}
                    {isExpanded && (
                      <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs space-y-2 animate-in fade-in">
                        <p className="text-muted-foreground leading-relaxed">
                          {vendor.description || 'Professional vendor verified on Wedora.'}
                        </p>

                        {collaborationNotes && (
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] space-y-0.5">
                            <span className="font-bold flex items-center gap-1">
                              <ShieldCheck className="size-3 text-emerald-700" /> Collaboration Note
                              (Aditi Sharma):
                            </span>
                            <p className="italic">"{collaborationNotes}"</p>
                          </div>
                        )}

                        {vendor.features && vendor.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {vendor.features.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-navy font-medium"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Row: View Details & Select Vendor */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedVendorId(isExpanded ? null : vendor.id)
                        }
                        className="text-xs font-semibold text-plum hover:text-plum-dark flex items-center gap-1 hover:underline cursor-pointer"
                        data-testid={`view-details-btn-${vendor.id}`}
                      >
                        {isExpanded ? (
                          <>
                            Less Details <ChevronUp className="size-3.5" />
                          </>
                        ) : (
                          <>
                            View Details <ChevronDown className="size-3.5" />
                          </>
                        )}
                      </button>

                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() => handleSelectReplacement(vendor)}
                        className="rounded-full text-xs font-semibold px-4 h-8 flex items-center gap-1.5"
                        data-testid={`select-vendor-btn-${vendor.id}`}
                      >
                        <Check className="size-3.5" /> Select Vendor
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination / View More */}
            {visibleCount < filteredItems.length && (
              <div className="text-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="rounded-full px-6 text-xs font-semibold"
                  data-testid="view-more-vendors-btn"
                >
                  View More ({filteredItems.length - visibleCount} more available)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: REVIEW & CONFIRM VENDOR SWAP */}
        {step === 'CONFIRM' && selectedReplacement && (
          <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-5">
            {/* Back Button */}
            <button
              onClick={() => {
                setStep('SELECT');
                setConflictError(null);
              }}
              className="text-xs text-plum font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <ArrowLeft className="size-3.5" /> ← Back to Alternatives
            </button>

            {/* Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Vendor Card */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    Vendor to Replace
                  </span>
                  <span className="text-xs text-muted-foreground">{canonicalCategory}</span>
                </div>
                <h4 className="font-display font-bold text-base text-navy">
                  {originalVendor.businessName}
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-rose-500" />
                    <span>
                      Date: {activeDate} ({activeSlot.replace('_', ' ')})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-rose-500" />
                    <span>
                      Estimated Base: ₹{originalPrice.toLocaleString('en-IN')}{' '}
                      {originalVendor.priceUnit ? `(${originalVendor.priceUnit})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-rose-500" />
                    <span>{originalVendor.primaryCity}</span>
                  </div>
                </div>
              </div>

              {/* Selected Replacement Card */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Selected Replacement
                  </span>
                  <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-600" /> Confirmed Available
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-navy">
                  {selectedReplacement.businessName}
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Star className="size-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-navy">
                      {selectedReplacement.onTimeDeliveryPercent || 96}% On-Time Delivery
                    </span>
                    <span>({selectedReplacement.completedOrders || 0} orders)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-3.5 text-emerald-600" />
                    <span className="font-semibold text-navy">
                      ₹{replacementPrice.toLocaleString('en-IN')}{' '}
                      {selectedReplacement.priceUnit ? `(${selectedReplacement.priceUnit})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-emerald-600" />
                    <span>
                      {selectedReplacement.primaryCity}{' '}
                      {selectedReplacement.serviceableAreas
                        ? `(${selectedReplacement.serviceableAreas.slice(0, 2).join(', ')})`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Variance & Impact Banner */}
            <div className="rounded-2xl bg-muted/60 p-4 text-xs text-navy space-y-2 border border-border">
              <div className="flex items-center justify-between font-semibold">
                <span>Budget & Quotation Variance:</span>
                <span
                  className={
                    priceDiff > 0
                      ? 'text-amber-700 font-bold'
                      : priceDiff < 0
                      ? 'text-emerald-700 font-bold'
                      : 'text-muted-foreground'
                  }
                >
                  {priceDiff > 0
                    ? `+₹${priceDiff.toLocaleString('en-IN')} (Additional budget allocation)`
                    : priceDiff < 0
                    ? `-₹${Math.abs(priceDiff).toLocaleString('en-IN')} (Cost saving)`
                    : 'Exact price parity (₹0)'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px] leading-relaxed">
                <ShieldCheck className="size-4 text-gold shrink-0" />
                <span>
                  The original vendor selection remains active until you confirm. Confirmation will
                  update the event bundle, persist the audit record in Supabase, and refresh all
                  event performance analytics.
                </span>
              </div>
            </div>

            {/* Error / Conflict Alert */}
            {conflictError && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="p-4 sm:p-5 border-t border-border bg-muted/20 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-muted-foreground">
            {step === 'SELECT' ? (
              <span>Select an alternative above to review comparison</span>
            ) : (
              <span>Safe swap: No automatic cancellations of paid bookings</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-4 text-xs font-semibold"
            >
              Cancel
            </Button>

            {step === 'CONFIRM' && (
              <Button
                variant="hero"
                onClick={handleConfirm}
                disabled={isSubmitting || isValidatingConflict}
                className="rounded-full px-5 text-xs font-semibold flex items-center gap-1.5"
                data-testid="confirm-swap-button"
              >
                {isSubmitting ? (
                  <>Saving to Supabase...</>
                ) : (
                  <>
                    <Check className="size-4" /> Confirm Vendor Swap
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};
