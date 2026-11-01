import React, { useState, useMemo, useEffect } from 'react';
import {
  Store,
  Calendar as CalendarIcon,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Building2,
  Users,
  DollarSign,
  Heart,
  MessageSquareQuote,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Vendor, AvailabilityStatus } from '@/types/vendor';
import { WeddingEvent } from '@/types/event';
import { DEMO_VENDORS } from '@/data/demoVendors';
import { isOrganizerCategory } from '@/types/shortlist';
import { getRecommendedVendorsForPlanner } from '@/data/plannerCollaborations';
import { ParsedPlannerCommand } from '@/utils/plannerVoiceNlu';
import { CustomerVoiceAssistant } from './CustomerVoiceAssistant';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';

interface CustomerVendorDirectoryProps {
  activeEvent: WeddingEvent;
  onNavigateToOrganizers?: () => void;
}

const CATEGORIES = [
  { label: 'All Vendors', value: 'ALL' },
  { label: 'Catering & Food', value: 'Catering and Food Services' },
  { label: 'Photography & Film', value: 'Photography and Videography' },
  { label: 'Decor & Flowers', value: 'Decoration Services' },
  { label: 'Venues & Halls', value: 'Wedding Lawns and Venues' },
  { label: 'DJ & Sound', value: 'DJ and Sound Systems' },
  { label: 'Makeup & Styling', value: 'Makeup and Mehendi Artists' },
];

export const CustomerVendorDirectory: React.FC<CustomerVendorDirectoryProps> = ({
  activeEvent,
  onNavigateToOrganizers,
}) => {
  const {
    shortlist,
    toggleShortlist,
    isShortlisted,
    calendarOverrides,
    createInquiry,
  } = useDemoSession();

  // Active filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [localityFilter, setLocalityFilter] = useState<string>(
    activeEvent.area ? `${activeEvent.area}, ${activeEvent.city}` : activeEvent.city
  );
  const [voiceQueryFilter, setVoiceQueryFilter] = useState<{
    category?: string;
    locality?: string;
    date?: string;
  }>({});

  // Modals state
  const [selectedProfileVendor, setSelectedProfileVendor] = useState<Vendor | null>(null);
  const [selectedQuoteVendor, setSelectedQuoteVendor] = useState<Vendor | null>(null);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  // Sync locality when active event changes
  useEffect(() => {
    const loc = activeEvent.area
      ? `${activeEvent.area}, ${activeEvent.city}`
      : activeEvent.city;
    setLocalityFilter(loc);
    setVoiceQueryFilter({});
  }, [activeEvent.id, activeEvent.area, activeEvent.city]);

  // Voice command handler
  const handleVoiceCommand = (command: ParsedPlannerCommand) => {
    const updates: { category?: string; locality?: string; date?: string } = {};

    if (command.category) {
      setSelectedCategory(command.category);
      updates.category = command.category;
    }
    if (command.location || command.area) {
      const loc = command.location || command.area || '';
      setLocalityFilter(loc);
      updates.locality = loc;
    }
    if (command.date) {
      updates.date = command.date;
    }
    setVoiceQueryFilter(updates);
  };

  const isProvisional =
    activeEvent.venueStatus === 'NOT_FINALIZED' ||
    Boolean(activeEvent.isVenueProvisional) ||
    activeEvent.venueName?.toLowerCase().includes('not finalized');

  // Compute matched vendors
  const displayedVendors = useMemo(() => {
    const activeCat =
      selectedCategory !== 'ALL' ? selectedCategory : voiceQueryFilter.category;
    const activeLoc = voiceQueryFilter.locality || localityFilter;

    // Use recommended vendors helper for intelligent locality + nearby adjacency
    const vendors = getRecommendedVendorsForPlanner({
      location: activeLoc,
      city: activeEvent.city,
      category: activeCat,
      eventDate: voiceQueryFilter.date || activeEvent.eventDate,
      limit: 24,
    });

    // Filter out organizer categories (which belong to the separate organizer directory)
    return vendors.filter((v) => !isOrganizerCategory(v.category));
  }, [
    selectedCategory,
    voiceQueryFilter,
    localityFilter,
    activeEvent.city,
    activeEvent.eventDate,
  ]);

  // Helper to determine live vendor availability on event date
  const getVendorAvailability = (vendor: Vendor): AvailabilityStatus => {
    const checkDate = voiceQueryFilter.date || activeEvent.eventDate;
    if (calendarOverrides[vendor.id]?.[checkDate]) {
      return calendarOverrides[vendor.id][checkDate];
    }
    return vendor.calendarAvailability?.[checkDate] || 'Available';
  };

  const handleRequestQuoteSubmit = (inquiryData: {
    requirements: string;
    guestCount?: number;
  }) => {
    if (!selectedQuoteVendor) return;

    createInquiry({
      eventId: activeEvent.id,
      vendorId: selectedQuoteVendor.id,
      vendorBusinessName: selectedQuoteVendor.businessName,
      serviceCategory: selectedQuoteVendor.category,
      requirements: inquiryData.requirements,
      guestCount: inquiryData.guestCount || activeEvent.guestCount,
    });

    setQuoteSuccessMsg(
      `Quotation request sent to ${selectedQuoteVendor.businessName}! Check "My Shortlist & Communications" tab for updates.`
    );
    setSelectedQuoteVendor(null);

    setTimeout(() => {
      setQuoteSuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 animate-rise min-w-0 max-w-full overflow-x-hidden">
      {/* 1. Event Context Header */}
      <div className="rounded-3xl border border-gold/30 bg-card p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-0.5 rounded-full">
                Active Event Context
              </span>
              {isProvisional && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="size-3 text-amber-600" />
                  Venue Not Finalized: Provisional Recommendations
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-display text-plum font-bold mt-1.5">
              {activeEvent.eventName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeEvent.eventType} · Registered for {activeEvent.clientName}
            </p>
          </div>

          {onNavigateToOrganizers && (
            <Button
              variant="soft"
              size="sm"
              onClick={onNavigateToOrganizers}
              className="text-xs font-semibold self-start sm:self-auto border border-gold/40 text-plum hover:bg-gold-soft"
            >
              Need Full Event Management? View Organizers →
            </Button>
          )}
        </div>

        {/* Quick event parameters banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs">
          <div className="flex items-center gap-2 text-navy">
            <CalendarIcon className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Date</span>
              <strong>{activeEvent.eventDate}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <MapPin className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Locality</span>
              <strong>{activeEvent.area || activeEvent.city}, {activeEvent.city}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <Users className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Guest Count</span>
              <strong>{activeEvent.guestCount} Guests</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <DollarSign className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Estimated Budget</span>
              <strong>₹{activeEvent.estimatedBudget.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* Provisional Venue Disclaimer */}
        {isProvisional && (
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Provisional Mode:</strong> You indicated that your venue is not finalized yet. Vendors displayed below are curated for the general <strong>{activeEvent.area || activeEvent.city}</strong> region. Quoted rates and logistics may be refined once the physical venue is locked.
            </p>
          </div>
        )}
      </div>

      {/* 2. Multilingual AI Voice Assistant */}
      <CustomerVoiceAssistant
        activeEvent={activeEvent}
        onCommandParsed={handleVoiceCommand}
      />

      {/* Success Notification */}
      {quoteSuccessMsg && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-rise">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{quoteSuccessMsg}</span>
          </div>
          <button
            onClick={() => setQuoteSuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setVoiceQueryFilter((prev) => ({ ...prev, category: undefined }));
              }}
              className={`shrink-0 px-3.5 py-2 rounded-2xl font-medium transition border ${
                isActive
                  ? 'bg-plum text-gold font-semibold border-gold shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-gold/50 hover:text-navy'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 4. Filter status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground px-1">
        <div>
          Showing <strong>{displayedVendors.length}</strong> verified vendors in{' '}
          <strong className="text-navy">{localityFilter}</strong> for{' '}
          <strong className="text-navy">{activeEvent.eventDate}</strong>
        </div>
        {(selectedCategory !== 'ALL' || voiceQueryFilter.category || voiceQueryFilter.locality) && (
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setVoiceQueryFilter({});
              setLocalityFilter(
                activeEvent.area
                  ? `${activeEvent.area}, ${activeEvent.city}`
                  : activeEvent.city
              );
            }}
            className="text-gold hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 5. Uniform Vendor Cards Grid */}
      {displayedVendors.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedVendors.map((vendor) => {
            const isSaved = isShortlisted(vendor.id, activeEvent.id);
            const availability = getVendorAvailability(vendor);
            const isNearby = vendor.isNearbyCoverage;

            return (
              <div
                key={vendor.id}
                className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-soft hover:shadow-float hover:border-gold/50 transition duration-200 min-h-[295px] h-full"
              >
                {/* Top section: Category, Verified & Bookmark */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                        {vendor.category}
                      </span>
                      {(vendor.isDemoData || vendor.isDemonstrationProfile) && (
                        <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full">
                          Demonstration Profile (Demo Data)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleShortlist(vendor, activeEvent.id, activeEvent.estimatedBudget)}
                      className={`p-2 rounded-full border transition ${
                        isSaved
                          ? 'bg-gold text-plum border-gold shadow-sm'
                          : 'bg-secondary text-muted-foreground hover:text-gold hover:border-gold/40'
                      }`}
                      title={isSaved ? 'Remove from Shortlist' : 'Add to Shortlist'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="size-4 fill-current" />
                      ) : (
                        <Bookmark className="size-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-plum text-lg leading-snug">
                    {vendor.businessName}
                  </h3>

                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3 text-gold shrink-0" />
                    <span>{vendor.primaryCity} · {vendor.serviceableAreas?.slice(0, 2).join(', ')}</span>
                  </p>

                  {/* Nearby Locality Coverage Badge */}
                  {isNearby && (
                    <div className="mt-2 text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 px-2 py-0.5 rounded-full inline-block font-medium">
                      {vendor.nearbyCoverageNote || `Nearby Coverage: ${vendor.primaryCity}`}
                    </div>
                  )}

                  {/* Rating & Performance Metrics */}
                  <div className="flex items-center gap-3 mt-3 text-xs">
                    <div className="flex items-center gap-1 font-bold text-navy">
                      <Star className="size-3.5 fill-gold text-gold" />
                      <span>{(vendor.rating || 4.7).toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {vendor.completedOrders || 35}+ completed
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      {vendor.onTimeDeliveryPercent || 98}% on-time
                    </span>
                  </div>

                  {/* Pricing Overview */}
                  <div className="mt-3 pt-2.5 border-t text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">Starting from</span>
                    <strong className="text-navy font-semibold text-sm">
                      ₹{vendor.startingPrice?.toLocaleString('en-IN') || '45,000'}
                    </strong>
                  </div>

                  {/* Availability Badge for Event Date */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground text-[11px]">Availability ({activeEvent.eventDate}):</span>
                    {availability === 'Available' ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="size-3 text-emerald-600" /> Available
                      </span>
                    ) : availability === 'Limited Availability' ? (
                      <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                        <Clock className="size-3 text-amber-600" /> Limited Slots
                      </span>
                    ) : (
                      <span className="text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1 text-[11px]">
                        <XCircle className="size-3 text-rose-600" /> Booked
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: View Profile & Request Quote */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t">
                  <Button
                    variant="soft"
                    size="sm"
                    onClick={() => setSelectedProfileVendor(vendor)}
                    className="text-xs font-semibold py-1.5"
                  >
                    <Eye className="size-3.5 mr-1" /> Profile
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => setSelectedQuoteVendor(vendor)}
                    className="text-xs font-semibold py-1.5"
                  >
                    <MessageSquareQuote className="size-3.5 mr-1" /> Request Quote
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border bg-card p-10 text-center space-y-3">
          <Store className="size-10 text-gold mx-auto" />
          <h3 className="font-display font-semibold text-plum text-lg">No vendors found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No vendors found matching your selected category and locality. Try resetting your filter or speaking another locality to the AI Assistant.
          </p>
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              setSelectedCategory('ALL');
              setVoiceQueryFilter({});
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Profile Modal */}
      {selectedProfileVendor && (
        <VendorProfileModal
          vendor={selectedProfileVendor}
          onClose={() => setSelectedProfileVendor(null)}
          onSelectForEvent={() => {
            toggleShortlist(selectedProfileVendor, activeEvent.id, activeEvent.estimatedBudget);
            setSelectedProfileVendor(null);
          }}
          isShortlisted={isShortlisted(selectedProfileVendor.id, activeEvent.id)}
        />
      )}

      {/* Request Quotation Modal */}
      {selectedQuoteVendor && (
        <RequestQuotationModal
          vendor={selectedQuoteVendor}
          event={activeEvent}
          onClose={() => setSelectedQuoteVendor(null)}
          onSubmit={handleRequestQuoteSubmit}
        />
      )}
    </div>
  );
};

