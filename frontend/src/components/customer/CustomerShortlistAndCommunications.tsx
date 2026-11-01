import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Briefcase,
  Store,
  MessageSquare,
  MessageSquareQuote,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status, SimpleTable } from '@/components/dashboard';
import { useDemoSession } from '@/hooks/useDemoSession';
import { WeddingEvent } from '@/types/event';
import { Vendor } from '@/types/vendor';
import { isOrganizerCategory } from '@/types/shortlist';
import { VendorProfileModal } from '@/components/vendors/VendorProfileModal';
import { RequestQuotationModal } from '@/components/bookings/RequestQuotationModal';

interface CustomerShortlistAndCommunicationsProps {
  activeEvent: WeddingEvent;
}

type MainSectionTab =
  | 'shortlisted_vendors'
  | 'shortlisted_organizers'
  | 'vendor_comms'
  | 'organizer_comms';

export const CustomerShortlistAndCommunications: React.FC<CustomerShortlistAndCommunicationsProps> = ({
  activeEvent,
}) => {
  const {
    session,
    shortlist,
    removeFromShortlist,
    inquiries,
    quotations,
    createInquiry,
    acceptQuotationAndBook,
  } = useDemoSession();

  const [activeTab, setActiveTab] = useState<MainSectionTab>('shortlisted_vendors');
  const [selectedProfileVendor, setSelectedProfileVendor] = useState<Vendor | null>(null);
  const [selectedQuoteVendor, setSelectedQuoteVendor] = useState<Vendor | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filter shortlist for active event
  const eventShortlist = useMemo(() => {
    return shortlist.filter((item) => item.eventId === activeEvent.id);
  }, [shortlist, activeEvent.id]);

  // Sub-tabs: Vendors vs Organizers
  const shortlistedVendors = useMemo(() => {
    return eventShortlist.filter((item) => !isOrganizerCategory(item.vendor.category));
  }, [eventShortlist]);

  const shortlistedOrganizers = useMemo(() => {
    return eventShortlist.filter((item) => isOrganizerCategory(item.vendor.category));
  }, [eventShortlist]);

  // Real Inquiries & Quotations for active event
  const eventInquiries = useMemo(() => {
    return inquiries.filter(
      (inq) =>
        inq.eventId === activeEvent.id ||
        (inq.requesterEmail && inq.requesterEmail.toLowerCase() === session.email.toLowerCase())
    );
  }, [inquiries, activeEvent.id, session.email]);

  const vendorInquiries = useMemo(() => {
    return eventInquiries.filter((inq) => !isOrganizerCategory(inq.serviceCategory));
  }, [eventInquiries]);

  const organizerInquiries = useMemo(() => {
    return eventInquiries.filter((inq) => isOrganizerCategory(inq.serviceCategory));
  }, [eventInquiries]);

  // Quotations linked to inquiries
  const vendorQuotes = useMemo(() => {
    const inqIds = new Set(vendorInquiries.map((i) => i.id));
    return quotations.filter((q) => inqIds.has(q.inquiryId));
  }, [quotations, vendorInquiries]);

  const organizerQuotes = useMemo(() => {
    const inqIds = new Set(organizerInquiries.map((i) => i.id));
    return quotations.filter((q) => inqIds.has(q.inquiryId));
  }, [quotations, organizerInquiries]);

  const handleAcceptQuote = (quoteId: string, businessName: string) => {
    acceptQuotationAndBook(quoteId);
    setFeedbackMsg(`Successfully accepted quotation from ${businessName}! Booking confirmed in your ledger.`);
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  return (
    <div className="space-y-6 animate-rise min-w-0 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-display text-plum font-bold">
          Shortlists & Communications
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage saved vendors, organizer proposals, and real inquiry correspondence for{' '}
          <strong className="text-navy">{activeEvent.eventName}</strong>.
        </p>
      </div>

      {feedbackMsg && (
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-4 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-rise">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold text-emerald-700 hover:underline ml-3"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Responsive Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-secondary/60 border border-border">
        <button
          onClick={() => setActiveTab('shortlisted_vendors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'shortlisted_vendors'
              ? 'bg-card text-plum shadow-sm border border-gold/40'
              : 'text-muted-foreground hover:text-navy'
          }`}
        >
          <Store className="size-3.5 text-gold" />
          <span>Shortlisted Vendors ({shortlistedVendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shortlisted_organizers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'shortlisted_organizers'
              ? 'bg-card text-plum shadow-sm border border-gold/40'
              : 'text-muted-foreground hover:text-navy'
          }`}
        >
          <Briefcase className="size-3.5 text-gold" />
          <span>Shortlisted Organizers ({shortlistedOrganizers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendor_comms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'vendor_comms'
              ? 'bg-card text-plum shadow-sm border border-gold/40'
              : 'text-muted-foreground hover:text-navy'
          }`}
        >
          <MessageSquare className="size-3.5 text-gold" />
          <span>Vendor Communications ({vendorInquiries.length + vendorQuotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('organizer_comms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'organizer_comms'
              ? 'bg-card text-plum shadow-sm border border-gold/40'
              : 'text-muted-foreground hover:text-navy'
          }`}
        >
          <MessageSquareQuote className="size-3.5 text-gold" />
          <span>Organizer Communications ({organizerInquiries.length + organizerQuotes.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: SHORTLISTED VENDORS ================= */}
      {activeTab === 'shortlisted_vendors' && (
        <div className="space-y-4 animate-rise">
          {shortlistedVendors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shortlistedVendors.map((item) => {
                const vendor = item.vendor;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-soft hover:shadow-float transition min-h-[295px] h-full"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded-full">
                          {vendor.category}
                        </span>
                        <button
                          onClick={() => removeFromShortlist(vendor.id, activeEvent.id)}
                          className="p-1.5 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <h3 className="font-display font-bold text-plum text-lg">
                        {vendor.businessName}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="size-3 text-gold" />
                        <span>{vendor.primaryCity} · {vendor.serviceableAreas?.slice(0, 2).join(', ')}</span>
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="font-bold text-navy flex items-center gap-1">
                          <Star className="size-3.5 fill-gold text-gold" /> {(vendor.rating || 4.7).toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{vendor.completedOrders || 25}+ orders</span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t text-xs flex items-center justify-between">
                        <span className="text-muted-foreground">Pricing</span>
                        <strong className="text-navy font-semibold">
                          From ₹{vendor.startingPrice?.toLocaleString('en-IN') || '45,000'}
                        </strong>
                      </div>
                    </div>

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
            <div className="rounded-3xl border bg-card p-12 text-center space-y-3">
              <Bookmark className="size-10 text-gold mx-auto" />
              <h3 className="font-display font-semibold text-plum text-lg">
                No vendors shortlisted yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore the Vendor Directory or ask the AI Assistant to discover caterers, photographers, and decorators for your event!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SHORTLISTED ORGANIZERS ================= */}
      {activeTab === 'shortlisted_organizers' && (
        <div className="space-y-4 animate-rise">
          {shortlistedOrganizers.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shortlistedOrganizers.map((item) => {
                const organizer = item.vendor;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-3xl border bg-card p-5 shadow-soft hover:shadow-float transition min-h-[295px] h-full"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-plum bg-plum/10 px-2 py-0.5 rounded-full">
                          Turnkey Planner
                        </span>
                        <button
                          onClick={() => removeFromShortlist(organizer.id, activeEvent.id)}
                          className="p-1.5 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <h3 className="font-display font-bold text-plum text-lg">
                        {organizer.businessName}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="size-3 text-gold" />
                        <span>{organizer.primaryCity} ({organizer.serviceableAreas?.slice(0, 2).join(', ')})</span>
                      </p>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {organizer.description || 'Full-scale wedding production and event coordination.'}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="font-bold text-navy flex items-center gap-1">
                          <Star className="size-3.5 fill-gold text-gold" /> {(organizer.rating || 4.8).toFixed(1)}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{organizer.completedOrders || 30}+ weddings</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t">
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => setSelectedProfileVendor(organizer)}
                        className="text-xs font-semibold py-1.5"
                      >
                        <Eye className="size-3.5 mr-1" /> Profile
                      </Button>
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => setSelectedQuoteVendor(organizer)}
                        className="text-xs font-semibold py-1.5"
                      >
                        <MessageSquareQuote className="size-3.5 mr-1" /> Request Proposal
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border bg-card p-12 text-center space-y-3">
              <Briefcase className="size-10 text-gold mx-auto" />
              <h3 className="font-display font-semibold text-plum text-lg">
                No event organizers shortlisted yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Visit the Event Planners directory to view verified agencies capable of managing your wedding celebration end-to-end.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: VENDOR COMMUNICATIONS ================= */}
      {activeTab === 'vendor_comms' && (
        <div className="space-y-6 animate-rise">
          {/* Formal Quotations from Vendors */}
          <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display text-plum font-bold">
                  Formal Vendor Quotations Received
                </h3>
                <p className="text-xs text-muted-foreground">
                  Official quotations submitted by catering, photography, and decor vendors.
                </p>
              </div>
              <span className="text-xs font-semibold text-gold bg-gold/15 px-2.5 py-1 rounded-full">
                {vendorQuotes.length} Quotes
              </span>
            </div>

            {vendorQuotes.length > 0 ? (
              <SimpleTable
                head={['Vendor', 'Scope of Work', 'Quoted Amount', 'Status', 'Action']}
                rows={vendorQuotes.map((q) => [
                  <strong key={q.id} className="text-navy">{q.vendorBusinessName}</strong>,
                  <span key={q.id} className="max-w-xs truncate block text-xs">{q.serviceScope}</span>,
                  `₹${q.quotedAmount.toLocaleString('en-IN')}`,
                  <Status key={q.id} s={q.status} />,
                  q.status === 'SENT' ? (
                    <Button
                      key={q.id}
                      size="sm"
                      variant="hero"
                      onClick={() => handleAcceptQuote(q.id, q.vendorBusinessName)}
                      className="text-xs"
                    >
                      Accept & Book
                    </Button>
                  ) : (
                    <span key={q.id} className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Booked
                    </span>
                  ),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No vendor quotations received yet. Click "Request Quote" on any vendor in your directory or shortlist!
              </p>
            )}
          </div>

          {/* Pending Inquiries to Vendors */}
          <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="text-lg font-display text-plum font-bold">
              My Sent Vendor Inquiries
            </h3>
            {vendorInquiries.length > 0 ? (
              <SimpleTable
                head={['Vendor', 'Category', 'Requirements', 'Date Sent', 'Status']}
                rows={vendorInquiries.map((inq) => [
                  <strong key={inq.id} className="text-navy">{inq.vendorBusinessName}</strong>,
                  inq.serviceCategory,
                  <span key={inq.id} className="max-w-sm truncate block text-xs">{inq.requirements}</span>,
                  new Date(inq.createdAt).toLocaleDateString('en-IN'),
                  <Status key={inq.id} s={inq.status} />,
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No active vendor inquiries sent yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ORGANIZER COMMUNICATIONS ================= */}
      {activeTab === 'organizer_comms' && (
        <div className="space-y-6 animate-rise">
          {/* Organizer Proposals Received */}
          <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display text-plum font-bold">
                  Event Organizer Proposals & Turnkey Quotations
                </h3>
                <p className="text-xs text-muted-foreground">
                  Proposals submitted by professional event planners and wedding management agencies.
                </p>
              </div>
              <span className="text-xs font-semibold text-plum bg-plum/10 px-2.5 py-1 rounded-full">
                {organizerQuotes.length} Proposals
              </span>
            </div>

            {organizerQuotes.length > 0 ? (
              <SimpleTable
                head={['Organizer Agency', 'Management Scope', 'Quoted Retainer', 'Status', 'Action']}
                rows={organizerQuotes.map((q) => [
                  <strong key={q.id} className="text-navy">{q.vendorBusinessName}</strong>,
                  <span key={q.id} className="max-w-xs truncate block text-xs">{q.serviceScope}</span>,
                  `₹${q.quotedAmount.toLocaleString('en-IN')}`,
                  <Status key={q.id} s={q.status} />,
                  q.status === 'SENT' ? (
                    <Button
                      key={q.id}
                      size="sm"
                      variant="hero"
                      onClick={() => handleAcceptQuote(q.id, q.vendorBusinessName)}
                      className="text-xs"
                    >
                      Accept & Retain Organizer
                    </Button>
                  ) : (
                    <span key={q.id} className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" /> Retained
                    </span>
                  ),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No organizer proposals received yet. Request a consultation proposal from the Event Planners directory!
              </p>
            )}
          </div>

          {/* Consultation Requests Sent to Organizers */}
          <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-soft space-y-4">
            <h3 className="text-lg font-display text-plum font-bold">
              My Consultation Requests to Organizers
            </h3>
            {organizerInquiries.length > 0 ? (
              <SimpleTable
                head={['Organizer', 'Event Scope', 'Requirements', 'Date Sent', 'Status']}
                rows={organizerInquiries.map((inq) => [
                  <strong key={inq.id} className="text-navy">{inq.vendorBusinessName}</strong>,
                  inq.serviceCategory,
                  <span key={inq.id} className="max-w-sm truncate block text-xs">{inq.requirements}</span>,
                  new Date(inq.createdAt).toLocaleDateString('en-IN'),
                  <Status key={inq.id} s={inq.status} />,
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No consultation inquiries sent to organizers yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedProfileVendor && (
        <VendorProfileModal
          vendor={selectedProfileVendor}
          onClose={() => setSelectedProfileVendor(null)}
          onSelectForEvent={() => {
            // Already in shortlist
            setSelectedProfileVendor(null);
          }}
          isShortlisted={true}
        />
      )}

      {selectedQuoteVendor && (
        <RequestQuotationModal
          vendor={selectedQuoteVendor}
          event={activeEvent}
          onClose={() => setSelectedQuoteVendor(null)}
          onSubmit={(inquiryData) => {
            createInquiry({
              eventId: activeEvent.id,
              vendorId: selectedQuoteVendor.id,
              vendorBusinessName: selectedQuoteVendor.businessName,
              serviceCategory: selectedQuoteVendor.category,
              requirements: inquiryData.requirements,
              guestCount: inquiryData.guestCount || activeEvent.guestCount,
            });
            setFeedbackMsg(`Inquiry submitted to ${selectedQuoteVendor.businessName}!`);
            setSelectedQuoteVendor(null);
            setTimeout(() => setFeedbackMsg(null), 5000);
          }}
        />
      )}
    </div>
  );
};

