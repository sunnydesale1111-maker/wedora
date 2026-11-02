import React, { useState, useMemo, useEffect } from 'react';
import {
  Store,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRightLeft,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Vendor } from '@/types/vendor';
import { DEMO_VENDORS } from '@/data/demoVendors';
import {
  getVerifiedCollaborationsForPlanner,
  getRecommendedVendorsForPlanner,
  PopulatedCollaboration,
} from '@/data/plannerCollaborations';
import { ParsedPlannerCommand } from '@/utils/plannerVoiceNlu';
import { PlannerVoiceAssistant } from './PlannerVoiceAssistant';
import { EventPerformanceForecast } from './EventPerformanceForecast';
import { PlannerVendorCalendar } from './PlannerVendorCalendar';
import { VendorSwapModal } from './VendorSwapModal';
import { formatRating } from '@/utils/formatters';

export const PlannerVendorDirectory: React.FC = () => {
  const {
    activeEvent,
    activeEventId,
    events,
    setActiveEventId,
    shortlist,
    addToShortlist,
    removeFromShortlist,
    isShortlisted,
  } = useDemoSession();

  // Sub-tab: "directory" vs "calendar"
  const [subTab, setSubTab] = useState<'directory' | 'calendar'>('directory');

  // Filter state dynamically bound to the selected client event
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>(
    activeEvent.area ? `${activeEvent.area}, ${activeEvent.city}` : activeEvent.city || 'Baner, Pune'
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | undefined>(undefined);
  const [calendarDate, setCalendarDate] = useState<string>(activeEvent.eventDate || '2026-12-15');

  // Vendor Swap State
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [vendorToReplace, setVendorToReplace] = useState<Vendor | null>(null);
  const [replacementVendor, setReplacementVendor] = useState<Vendor | null>(null);

  // Automatically update scope, date, and category filter when active event switches (zero context leakage)
  useEffect(() => {
    if (activeEvent) {
      const loc = activeEvent.area
        ? `${activeEvent.area}, ${activeEvent.city}`
        : activeEvent.city;
      setActiveLocationFilter(loc);
      setCalendarDate(activeEvent.eventDate || '2026-12-15');
      setActiveCategoryFilter(undefined);
    }
  }, [activeEvent.id, activeEvent.area, activeEvent.city, activeEvent.eventDate]);

  // 1. Get verified past collaborations for Aditi Sharma
  const verifiedCollaborations = useMemo(() => {
    return getVerifiedCollaborationsForPlanner('planner@weddingorchestrator.com', {
      location: activeLocationFilter,
      category: activeCategoryFilter,
    });
  }, [activeLocationFilter, activeCategoryFilter]);

  // Excluded vendor IDs for alternatives
  const collaboratedVendorIds = useMemo(() => {
    return verifiedCollaborations.map((c) => c.vendor.id);
  }, [verifiedCollaborations]);

  // 2. Get recommended alternative vendors matching location & category
  const recommendedVendors = useMemo(() => {
    return getRecommendedVendorsForPlanner({
      location: activeLocationFilter,
      category: activeCategoryFilter,
      excludeVendorIds: collaboratedVendorIds,
      eventDate: calendarDate,
      limit: 6,
    });
  }, [activeLocationFilter, activeCategoryFilter, collaboratedVendorIds, calendarDate]);

  // 3. Selected Vendors for the active event (from Shortlist + active event's location-based vendors)
  const eventSelectedVendors = useMemo(() => {
    const shortlistedForEvent = shortlist
      .filter((item) => item.eventId === activeEventId && item.vendor)
      .map((item) => item.vendor!);

    if (shortlistedForEvent.length > 0) {
      return shortlistedForEvent;
    }

    // Default seed vendors for active event demonstration matched to activeEvent's locality & city
    const matchingAreaVendors = DEMO_VENDORS.filter(
      (v) =>
        v.serviceableAreas &&
        activeEvent.area &&
        v.serviceableAreas.includes(activeEvent.area)
    ).slice(0, 4);

    if (matchingAreaVendors.length >= 3) {
      return matchingAreaVendors;
    }

    return DEMO_VENDORS.filter((v) => v.primaryCity === activeEvent.city).slice(0, 4);
  }, [shortlist, activeEventId, activeEvent.area, activeEvent.city]);

  // Handle Voice Command output
  const handleCommandParsed = (cmd: ParsedPlannerCommand) => {
    if (cmd.location) {
      setActiveLocationFilter(cmd.location);
    }
    if (cmd.category) {
      setActiveCategoryFilter(cmd.category);
    }
    if (cmd.date) {
      setCalendarDate(cmd.date);
    }
  };

  // Initiate Swap Workflow
  const handleInitiateSwap = (candidateReplacement: Vendor) => {
    // Find an existing shortlisted vendor in the same category to replace
    const sameCategory = eventSelectedVendors.find(
      (v) => v.category === candidateReplacement.category
    );

    // If no same category vendor found, use the first selected vendor or null
    setVendorToReplace(sameCategory || eventSelectedVendors[0] || null);
    setReplacementVendor(candidateReplacement);
    setSwapModalOpen(true);
  };

  // Confirm Swap Workflow
  const handleConfirmSwap = (original: Vendor, replacement: Vendor) => {
    // Remove original from shortlist
    removeFromShortlist(original.id, activeEventId);
    // Add replacement to shortlist
    addToShortlist(replacement, activeEventId);

    alert(`Successfully swapped ${original.businessName} with ${replacement.businessName} for ${activeEvent.eventName}!`);
  };

  return (
    <div className="space-y-6 animate-rise overflow-x-hidden">
      {/* Event Context Switcher Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gold-soft/50 via-card to-gold-soft/30 p-4 rounded-3xl border border-gold/40 text-xs text-navy shadow-xs">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-gold shrink-0" />
            <span className="font-semibold text-plum text-sm">
              {activeEvent.eventName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
              {activeEvent.eventType}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-[11px]">
            <span className="flex items-center gap-1 font-medium text-navy">
              <CalendarIcon className="size-3 text-gold" /> {activeEvent.eventDate}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="size-3 text-gold" />{' '}
              {activeEvent.venueName ? `${activeEvent.venueName} (${activeEvent.area}, ${activeEvent.city})` : `${activeEvent.area}, ${activeEvent.city}`}
            </span>
            {activeEvent.clientName && (
              <span className="flex items-center gap-1">
                <Users className="size-3 text-gold" /> Client: <strong className="text-navy">{activeEvent.clientName}</strong>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="size-3 text-gold" /> {activeEvent.guestCount} Guests
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">Switch Client Event:</span>
          <select
            value={activeEventId}
            onChange={(e) => setActiveEventId(e.target.value)}
            className="rounded-2xl border bg-card px-3 py-1.5 text-xs font-semibold text-navy outline-none focus:border-gold shadow-2xs cursor-pointer"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.eventName} ({ev.city} • {ev.eventDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. AI Voice Assistant Prominently at Top */}
      <PlannerVoiceAssistant
        activeEvent={activeEvent}
        onCommandParsed={handleCommandParsed}
        onSwitchTab={setSubTab}
      />

      {/* 2. Sub-tab Navigation (Directory View vs Availability Calendar) */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setSubTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            subTab === 'directory'
              ? 'bg-plum text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <Store className="size-4" /> Directory View
        </button>
        <button
          onClick={() => setSubTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            subTab === 'calendar'
              ? 'bg-plum text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <CalendarIcon className="size-4" /> Availability Calendar
        </button>

        {/* Current Active Filter Indicator */}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline">Active Scope:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-muted font-semibold text-navy text-[11px]">
            {activeLocationFilter}
          </span>
          {activeCategoryFilter && (
            <span className="px-2.5 py-0.5 rounded-full bg-gold-soft font-semibold text-gold text-[11px]">
              {activeCategoryFilter.split(' ')[0]}
            </span>
          )}
          {(activeCategoryFilter || activeLocationFilter !== 'Baner, Pune') && (
            <button
              onClick={() => {
                setActiveLocationFilter('Baner, Pune');
                setActiveCategoryFilter(undefined);
              }}
              className="text-[11px] text-plum hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: DIRECTORY VIEW */}
      {subTab === 'directory' && (
        <div className="space-y-8">
          {/* SECTION A: PREVIOUSLY WORKED-WITH VENDORS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-plum">
                  Vendors We've Worked With – {activeLocationFilter}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verified platform collaboration records for Lead Planner Aditi Sharma
                </p>
              </div>
              <span className="text-xs font-bold text-gold bg-gold-soft px-3 py-1 rounded-full border border-gold/30">
                {verifiedCollaborations.length} Verified Records
              </span>
            </div>

            {verifiedCollaborations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {verifiedCollaborations.map(({ record, vendor }) => {
                  const isSaved = isShortlisted(vendor.id, activeEventId);
                  const dateStatus = vendor.availabilityDates[calendarDate] || 'Available';
                  const isAvailable = dateStatus !== 'Fully Booked' && dateStatus !== 'Unavailable';

                  return (
                    <div
                      key={record.id}
                      className="rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-md hover:border-gold/50 transition flex flex-col justify-between space-y-4 min-h-[300px] h-full"
                    >
                      {/* Top Badges */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="size-3 text-emerald-700" /> Verified Partner
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {record.eventsCompletedTogether} Past Events
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-base text-navy leading-snug">
                          {vendor.businessName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="size-3 text-gold shrink-0" />
                          <span>{record.locationLabel}</span>
                          <span className="mx-1">•</span>
                          <span>{vendor.category.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Performance & Collaboration Notes */}
                      <div className="rounded-2xl bg-muted/40 p-3 text-xs space-y-1.5 border border-border/60">
                        <div className="flex items-center justify-between font-semibold">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="size-3.5 fill-amber-500" />
                            <span className="text-navy">{formatRating(record.clientRating, 4.8)} / 5.0</span>
                          </div>
                          <span className="text-emerald-700">
                            {record.onTimeDeliveryRate}% On-Time Score
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground italic leading-relaxed line-clamp-2">
                          "{record.collaborationNotes}"
                        </p>
                      </div>

                      {/* Availability & Actions */}
                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {isAvailable ? (
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="size-3.5" /> Available on {calendarDate}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                              <XCircle className="size-3.5" /> Booked on {calendarDate}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              if (isSaved) {
                                removeFromShortlist(vendor.id, activeEventId);
                              } else {
                                addToShortlist(vendor, activeEventId);
                              }
                            }}
                            className={`p-2 rounded-xl border transition ${
                              isSaved
                                ? 'bg-gold-soft border-gold text-gold'
                                : 'bg-card border-border hover:border-gold text-muted-foreground'
                            }`}
                            title={isSaved ? 'Remove from event shortlist' : 'Shortlist vendor'}
                          >
                            {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                          </button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInitiateSwap(vendor)}
                            className="rounded-xl text-[11px] px-2.5 h-8 font-semibold flex items-center gap-1"
                          >
                            <ArrowRightLeft className="size-3" /> Swap
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center space-y-2">
                <AlertCircle className="size-8 text-gold mx-auto" />
                <h4 className="font-display font-semibold text-navy">
                  No Past Collaboration Records Found in {activeLocationFilter}
                </h4>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Lead Planner Aditi Sharma has not completed platform events in this specific location yet.
                  Explore verified recommended alternative vendors below.
                </p>
              </div>
            )}
          </div>

          {/* SECTION B: RECOMMENDED ALTERNATIVE VENDORS */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-plum">
                  Recommended Vendors in {activeLocationFilter}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Top-rated available alternatives based on verified order completions and platform reviews
                </p>
              </div>
              <span className="text-xs font-bold text-navy bg-muted px-3 py-1 rounded-full">
                {recommendedVendors.length} Recommendations
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedVendors.map((vendor) => {
                const isSaved = isShortlisted(vendor.id, activeEventId);
                const dateStatus = vendor.availabilityDates[calendarDate] || 'Available';
                const isAvailable = dateStatus !== 'Fully Booked' && dateStatus !== 'Unavailable';

                return (
                  <div
                    key={vendor.id}
                    className="rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-md hover:border-gold/50 transition flex flex-col justify-between space-y-4 min-h-[300px] h-full"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {vendor.isNearbyCoverage && vendor.nearbyCoverageNote ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-300">
                            {vendor.nearbyCoverageNote}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-gold-soft px-2 py-0.5 rounded-full">
                            Alternative Option
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {vendor.completedOrders} Orders
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base text-navy leading-snug">
                        {vendor.businessName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3 text-gold shrink-0" />
                        <span>{vendor.primaryCity} ({vendor.serviceableAreas?.slice(0, 2).join(', ')})</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-muted/40 p-3 text-xs space-y-1.5 border border-border/60">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-navy">
                          Base: ₹{(vendor.startingPrice || 0).toLocaleString('en-IN')}{' '}
                          {vendor.priceUnit ? `(${vendor.priceUnit})` : ''}
                        </span>
                        <span className="text-emerald-700">
                          {vendor.onTimeDeliveryPercent}% On-Time
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {vendor.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        {isAvailable ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="size-3.5" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                            <XCircle className="size-3.5" /> Booked
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (isSaved) {
                              removeFromShortlist(vendor.id, activeEventId);
                            } else {
                              addToShortlist(vendor, activeEventId);
                            }
                          }}
                          className={`p-2 rounded-xl border transition ${
                            isSaved
                              ? 'bg-gold-soft border-gold text-gold'
                              : 'bg-card border-border hover:border-gold text-muted-foreground'
                          }`}
                          title={isSaved ? 'Remove from event shortlist' : 'Shortlist vendor'}
                        >
                          {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
                        </button>

                        <Button
                          size="sm"
                          variant="hero"
                          onClick={() => handleInitiateSwap(vendor)}
                          className="rounded-xl text-[11px] px-3 h-8 font-semibold flex items-center gap-1"
                        >
                          <ArrowRightLeft className="size-3" /> Swap Vendor
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: EVENT PERFORMANCE FORECAST */}
          <div className="pt-4 border-t border-border">
            <EventPerformanceForecast
              activeEvent={activeEvent}
              selectedVendors={eventSelectedVendors}
              eventDate={calendarDate}
            />
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABILITY CALENDAR */}
      {subTab === 'calendar' && (
        <PlannerVendorCalendar
          vendors={DEMO_VENDORS.filter(
            (v) =>
              v.primaryCity === activeEvent.city ||
              v.serviceableAreas?.some((a) => a.toLowerCase().includes(activeLocationFilter.toLowerCase()))
          )}
          activeEvent={activeEvent}
          selectedDate={calendarDate}
          onDateChange={setCalendarDate}
        />
      )}

      {/* VENDOR SWAP MODAL */}
      <VendorSwapModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        originalVendor={vendorToReplace}
        replacementVendor={replacementVendor}
        eventName={activeEvent.eventName}
        eventDate={calendarDate}
        onConfirmSwap={handleConfirmSwap}
      />
    </div>
  );
};

