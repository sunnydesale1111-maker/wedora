import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Calendar,
  MapPin,
  Star,
  Users,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Eye,
  MessageSquareQuote,
  Sparkles,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Vendor } from '@/types/vendor';
import { WeddingEvent } from '@/types/event';
import { DEMO_VENDORS } from '@/data/demoVendors';
import { isOrganizerCategory } from '@/types/shortlist';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';
import { formatRating } from '@/utils/formatters';

interface EventOrganizerDirectoryProps {
  activeEvent: WeddingEvent;
  onNavigateToVendorDirectory?: () => void;
}

export const EventOrganizerDirectory: React.FC<EventOrganizerDirectoryProps> = ({
  activeEvent,
  onNavigateToVendorDirectory,
}) => {
  const {
    shortlist,
    toggleShortlist,
    isShortlisted,
    createInquiry,
  } = useDemoSession();

  // Modals state
  const [selectedProfileOrganizer, setSelectedProfileOrganizer] = useState<Vendor | null>(null);
  const [selectedQuoteOrganizer, setSelectedQuoteOrganizer] = useState<Vendor | null>(null);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState<string | null>(null);

  // Filter DEMO_VENDORS to only organizers
  // Strictly NO filter panel and NO AI Voice Assistant
  const organizers = useMemo(() => {
    const list = DEMO_VENDORS.filter((v) => isOrganizerCategory(v.category));

    // Sort by: vendors matching event's primary city first, then by rating & orders
    return list.sort((a, b) => {
      const cityMatchesA = a.primaryCity.toLowerCase() === activeEvent.city.toLowerCase() ? 1 : 0;
      const cityMatchesB = b.primaryCity.toLowerCase() === activeEvent.city.toLowerCase() ? 1 : 0;
      if (cityMatchesA !== cityMatchesB) return cityMatchesB - cityMatchesA;

      const scoreA = (a.rating || 4.5) * 20 + (a.completedOrders || 20);
      const scoreB = (b.rating || 4.5) * 20 + (b.completedOrders || 20);
      return scoreB - scoreA;
    });
  }, [activeEvent.city]);

  const handleRequestQuoteSubmit = (inquiryData: {
    requirements: string;
    guestCount?: number;
  }) => {
    if (!selectedQuoteOrganizer) return;

    createInquiry({
      eventId: activeEvent.id,
      vendorId: selectedQuoteOrganizer.id,
      vendorBusinessName: selectedQuoteOrganizer.businessName,
      serviceCategory: selectedQuoteOrganizer.category,
      requirements: inquiryData.requirements,
      guestCount: inquiryData.guestCount || activeEvent.guestCount,
    });

    setInquirySuccessMsg(
      `Consultation & quote request sent to ${selectedQuoteOrganizer.businessName}! Check "My Shortlist & Communications" tab to track responses.`
    );
    setSelectedQuoteOrganizer(null);

    setTimeout(() => {
      setInquirySuccessMsg(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 animate-rise min-w-0 max-w-full overflow-x-hidden">
      {/* 1. Compact Event Summary at the Top */}
      <div className="rounded-3xl border border-gold/30 bg-card p-5 sm:p-6 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-0.5 rounded-full">
                Turnkey Event Management
              </span>
              <span className="text-[11px] font-bold text-plum bg-plum/10 px-2.5 py-0.5 rounded-full">
                Verified Event Organizers Only
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display text-plum font-bold mt-1.5">
              Hire a Professional Event Organizer
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hand over end-to-end planning, vendor contract management, and on-the-day execution to an experienced wedding agency.
            </p>
          </div>

          {onNavigateToVendorDirectory && (
            <Button
              variant="soft"
              size="sm"
              onClick={onNavigateToVendorDirectory}
              className="text-xs font-semibold self-start sm:self-auto border border-gold/40 text-plum hover:bg-gold-soft"
            >
              ← Prefer to coordinate vendors yourself?
            </Button>
          )}
        </div>

        {/* Compact Event Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-xs">
          <div className="flex items-center gap-2 text-navy">
            <Calendar className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Event Date</span>
              <strong>{activeEvent.eventDate}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <MapPin className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Location</span>
              <strong>{activeEvent.area || activeEvent.city}, {activeEvent.city}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <Users className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Guest Capacity</span>
              <strong>{activeEvent.guestCount} Guests</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-navy">
            <DollarSign className="size-4 text-gold shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Allocated Budget</span>
              <strong>₹{activeEvent.estimatedBudget.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry feedback message */}
      {inquirySuccessMsg && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-rise">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{inquirySuccessMsg}</span>
          </div>
          <button
            onClick={() => setInquirySuccessMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Directory Count Indicator (No AI, No Filter Panel) */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong>{organizers.length}</strong> verified wedding organizers & event management firms
        </span>
        <span className="text-[11px] font-medium text-gold">
          Turnkey Accountability & Full Management
        </span>
      </div>

      {/* 2. Compact Scrollable Listing Container (Six cards visible at a time on desktop) */}
      <div className="rounded-3xl border border-border bg-card/60 p-4 sm:p-5 shadow-soft">
        <div className="max-h-[590px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-gold/30 hover:scrollbar-thumb-gold/50 overscroll-contain">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizers.map((organizer) => {
              const isSaved = isShortlisted(organizer.id, activeEvent.id);
              const specialties = [
                'Turnkey Weddings',
                'Sangeet & Reception',
                'Destination Weddings',
                'Vendor Coordination',
              ];

              return (
                <div
                  key={organizer.id}
                  className="flex flex-col justify-between rounded-2xl border bg-card p-4 sm:p-5 shadow-soft hover:shadow-float hover:border-gold/50 transition duration-200 min-h-[275px] h-full"
                >
                  <div>
                    {/* Top: Verified Badge & Bookmark */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="size-3 text-emerald-600" />
                        <span>Wedora Verified Agency</span>
                      </div>

                      <button
                        onClick={() => toggleShortlist(organizer, activeEvent.id, activeEvent.estimatedBudget)}
                        className={`p-1.5 rounded-full border transition ${
                          isSaved
                            ? 'bg-gold text-plum border-gold shadow-sm'
                            : 'bg-secondary text-muted-foreground hover:text-gold hover:border-gold/40'
                        }`}
                        title={isSaved ? 'Remove from Shortlist' : 'Shortlist Organizer'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="size-3.5 fill-current" />
                        ) : (
                          <Bookmark className="size-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Organizer Name */}
                    <h3 className="font-display font-bold text-plum text-base sm:text-lg leading-snug">
                      {organizer.businessName}
                    </h3>

                    {/* Coverage / Areas Served */}
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3 text-gold shrink-0" />
                      <span>
                        Primary: <strong>{organizer.primaryCity}</strong> ({organizer.serviceableAreas?.slice(0, 2).join(', ') || 'Metropolitan Region'})
                      </span>
                    </p>

                    {/* Description / Bio */}
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {organizer.description ||
                        'Comprehensive end-to-end wedding production, guest hospitality, theme decoration, caterer liaison, and stage direction.'}
                    </p>

                    {/* Specialties Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-medium bg-gold-soft/40 text-navy px-1.5 py-0.5 rounded-full border border-gold/20"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Portfolio Metrics */}
                    <div className="flex items-center gap-2.5 mt-2.5 pt-2.5 border-t text-[11px]">
                      <div className="flex items-center gap-1 font-bold text-navy">
                        <Star className="size-3 fill-gold text-gold" />
                        <span>{formatRating(organizer.rating, 4.8)}</span>
                      </div>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {organizer.completedOrders || 40}+ weddings
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {organizer.onTimeDeliveryPercent || 99}% on-time
                      </span>
                    </div>

                    {/* Package / Engagement Retainer */}
                    <div className="mt-2 text-[11px] flex items-center justify-between text-muted-foreground">
                      <span>Planning Retainer:</span>
                      <strong className="text-navy font-semibold">
                        From ₹{(organizer.startingPrice || 120000).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t">
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => setSelectedProfileOrganizer(organizer)}
                      className="text-xs font-semibold py-1 h-8"
                    >
                      <Eye className="size-3 mr-1" /> Profile
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => setSelectedQuoteOrganizer(organizer)}
                      className="text-xs font-semibold py-1 h-8"
                    >
                      <MessageSquareQuote className="size-3 mr-1" /> Proposal
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedProfileOrganizer && (
        <VendorProfileModal
          vendor={selectedProfileOrganizer}
          onClose={() => setSelectedProfileOrganizer(null)}
          onSelectForEvent={() => {
            toggleShortlist(selectedProfileOrganizer, activeEvent.id, activeEvent.estimatedBudget);
            setSelectedProfileOrganizer(null);
          }}
          isShortlisted={isShortlisted(selectedProfileOrganizer.id, activeEvent.id)}
        />
      )}

      {/* Request Proposal Modal */}
      {selectedQuoteOrganizer && (
        <RequestQuotationModal
          vendor={selectedQuoteOrganizer}
          event={activeEvent}
          onClose={() => setSelectedQuoteOrganizer(null)}
          onSubmit={handleRequestQuoteSubmit}
        />
      )}
    </div>
  );
};

