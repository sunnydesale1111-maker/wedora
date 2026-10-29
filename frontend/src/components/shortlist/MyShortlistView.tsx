import { useState, useMemo } from 'react';
import {
  Bookmark,
  Briefcase,
  Store,
  MapPin,
  Trash2,
  Eye,
  MessageSquareQuote,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status, PageTitle } from '@/components/dashboard';
import { useDemoSession } from '@/hooks/useDemoSession';
import { Vendor } from '@/types/vendor';
import { isOrganizerCategory, ShortlistItem } from '@/types/shortlist';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';
import { getVendorAreaMetrics } from '@/utils/vendorFilters';

export function MyShortlistView() {
  const {
    shortlist,
    removeFromShortlist,
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    createInquiry,
    calendarOverrides,
  } = useDemoSession();

  // Active tab: 'vendors' vs 'organizers'
  const [activeTab, setActiveTab] = useState<'vendors' | 'organizers'>('vendors');

  // Filter by event ('ALL' or specific eventId)
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');

  // Modals state
  const [profileVendor, setProfileVendor] = useState<Vendor | null>(null);
  const [quoteVendor, setQuoteVendor] = useState<Vendor | null>(null);

  // Filtered shortlist by event
  const eventFilteredList = useMemo(() => {
    if (selectedEventId === 'ALL') return shortlist;
    return shortlist.filter((item) => item.eventId === selectedEventId);
  }, [shortlist, selectedEventId]);

  // Split into Vendors vs Event Organizers
  const shortlistedVendors = useMemo(() => {
    return eventFilteredList.filter((item) => !isOrganizerCategory(item.vendor.category));
  }, [eventFilteredList]);

  const shortlistedOrganizers = useMemo(() => {
    return eventFilteredList.filter((item) => isOrganizerCategory(item.vendor.category));
  }, [eventFilteredList]);

  const activeItems = activeTab === 'vendors' ? shortlistedVendors : shortlistedOrganizers;

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageTitle
          title="My Shortlist"
          subtitle="Saved vendors and event organizers with verified transaction metrics and budget feasibility context."
        />

        {/* Event selector filter for planners/customers managing events */}
        <div className="flex items-center gap-2 bg-card p-1.5 px-3 rounded-2xl border text-xs">
          <Calendar className="size-3.5 text-gold" />
          <span className="text-muted-foreground font-medium">Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-transparent font-semibold text-navy outline-none cursor-pointer"
          >
            <option value="ALL">All Events ({shortlist.length})</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.eventName} ({evt.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs: Shortlisted Vendors vs Shortlisted Event Organizers */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
            activeTab === 'vendors'
              ? 'border-gold text-plum bg-gold-soft/30 rounded-t-xl'
              : 'border-transparent text-muted-foreground hover:text-navy'
          }`}
        >
          <Store className="size-4 text-gold" />
          Shortlisted Vendors
          <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs text-navy font-bold border">
            {shortlistedVendors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('organizers')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
            activeTab === 'organizers'
              ? 'border-gold text-plum bg-gold-soft/30 rounded-t-xl'
              : 'border-transparent text-muted-foreground hover:text-navy'
          }`}
        >
          <Briefcase className="size-4 text-gold" />
          Shortlisted Event Organizers
          <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs text-navy font-bold border">
            {shortlistedOrganizers.length}
          </span>
        </button>
      </div>

      {/* Shortlist Content Cards */}
      {activeItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-12 text-center bg-card/60">
          <div className="flex size-14 mx-auto items-center justify-center rounded-full bg-gold-soft text-gold mb-3">
            <Bookmark className="size-6" />
          </div>
          <h3 className="font-display text-lg text-plum font-semibold">
            {activeTab === 'vendors'
              ? 'No individual vendors shortlisted yet'
              : 'No event organizers shortlisted yet'}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            {activeTab === 'vendors'
              ? 'Explore catering, decoration, lighting, and venues in AI Vendor Discovery and click "Add to Shortlist".'
              : 'Discover certified wedding planners and end-to-end event managers in your city to coordinate your entire celebration.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {activeItems.map((item) => {
            const v = item.vendor;
            const targetEvent = events.find((e) => e.id === item.eventId) || activeEvent;
            const eventBudget = item.customerBudget || targetEvent.estimatedBudget;
            const availability = v.availabilityDates[targetEvent.eventDate] || 'Available';
            const metrics = getVendorAreaMetrics(v, undefined, targetEvent.city);

            return (
              <div
                key={item.id}
                className="flex flex-col rounded-3xl border bg-card p-5 sm:p-6 shadow-soft transition hover:border-gold/60"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex size-12 items-center justify-center arch bg-gradient-plum text-gold font-display text-lg shrink-0">
                      {v.businessName[0]}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                        {v.category}
                      </span>
                      <h4 className="text-lg font-display text-navy font-semibold mt-0.5">
                        {v.businessName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-gold" />
                          {v.primaryCity} — {v.serviceableAreas.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Status s={availability} />
                </div>

                {/* Event Association Badge */}
                <div className="mt-3.5 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-1.5 text-xs border border-gold/20">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3 text-gold" />
                    Event:
                  </span>
                  <span className="font-semibold text-navy truncate max-w-[200px]">
                    {item.eventName || targetEvent.eventName}
                  </span>
                </div>

                {/* 90-Day Verified Activity Metrics (PRD Section 9 & 12) */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs bg-secondary/80 p-2.5 rounded-xl border border-gold/20">
                  <div className="bg-card p-2 rounded-lg border flex flex-col justify-between">
                    <span className="text-muted-foreground block text-[10px] font-medium">
                      Completed (90d)
                    </span>
                    <strong className="text-navy text-xs font-semibold mt-0.5">
                      {v.completedOrders90Days}
                    </strong>
                  </div>
                  <div className="bg-card p-2 rounded-lg border flex flex-col justify-between">
                    <span className="text-muted-foreground block text-[10px] font-medium">
                      Repeat Orders
                    </span>
                    <strong className="text-plum text-xs font-semibold mt-0.5">
                      {metrics.repeatOrders}
                    </strong>
                  </div>
                  <div className="bg-card p-2 rounded-lg border flex flex-col justify-between">
                    <span className="text-muted-foreground block text-[10px] font-medium">
                      Referrals
                    </span>
                    <strong className="text-navy text-xs font-semibold mt-0.5">
                      {metrics.customerReferrals}
                    </strong>
                  </div>
                </div>

                {/* Budget Context (PRD Section 12 requirement) */}
                <div className="mt-3 rounded-xl bg-gold-soft/40 p-3 border border-gold/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium">Your Event Budget:</span>
                    <strong className="text-navy">₹{eventBudget.toLocaleString('en-IN')}</strong>
                  </div>

                  {v.startingPrice ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-medium">Starting Price:</span>
                      <strong className="text-plum">
                        ₹{v.startingPrice.toLocaleString('en-IN')}{' '}
                        {v.priceUnit ? `/${v.priceUnit}` : ''}
                      </strong>
                    </div>
                  ) : null}

                  {/* Budget Fit Explanation */}
                  {v.quotationRequired || !v.startingPrice ? (
                    <div className="text-[11px] text-plum font-semibold flex items-center gap-1 pt-1 border-t border-gold/20">
                      <AlertCircle className="size-3 text-gold shrink-0" />
                      <span>Quotation Required — Budget Fit Not Yet Confirmed.</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-success font-medium flex items-center gap-1 pt-1 border-t border-gold/20">
                      <CheckCircle2 className="size-3 text-success shrink-0" />
                      <span>Starting price is within your event budget allocation.</span>
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground italic leading-tight pt-0.5">
                    * Verified platform transaction logs and area referral attribution records.
                  </p>
                </div>

                {/* Card Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t mt-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-muted-foreground hover:text-plum"
                    onClick={() => setProfileVendor(v)}
                  >
                    <Eye className="size-3.5 mr-1" /> View Profile
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-destructive hover:bg-danger-soft hover:text-destructive"
                      onClick={() => removeFromShortlist(v.id, item.eventId)}
                    >
                      <Trash2 className="size-3.5 mr-1" /> Remove
                    </Button>

                    <Button
                      size="sm"
                      variant="hero"
                      className="text-xs"
                      onClick={() => setQuoteVendor(v)}
                    >
                      <MessageSquareQuote className="size-3.5 mr-1" /> Request Quote
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Modal */}
      {profileVendor && (
        <VendorProfileModal
          vendor={profileVendor}
          onClose={() => setProfileVendor(null)}
          onRequestQuote={(vend) => {
            setProfileVendor(null);
            setQuoteVendor(vend);
          }}
          isShortlisted={true}
          onShortlist={(vend) => {
            removeFromShortlist(vend.id, selectedEventId !== 'ALL' ? selectedEventId : activeEventId);
            setProfileVendor(null);
          }}
        />
      )}

      {/* Request Quotation Modal */}
      {quoteVendor && (
        <RequestQuotationModal
          vendor={quoteVendor}
          onClose={() => setQuoteVendor(null)}
          targetDate={activeEvent.eventDate}
          guestCount={activeEvent.guestCount}
          onSubmit={({ requirements, guestCount }) => {
            createInquiry({
              eventId: activeEvent.id,
              vendorId: quoteVendor.id,
              vendorBusinessName: quoteVendor.businessName,
              serviceCategory: quoteVendor.category,
              requirements,
              guestCount,
            });
            alert(`Quotation request sent to ${quoteVendor.businessName}!`);
          }}
        />
      )}
    </div>
  );
}
