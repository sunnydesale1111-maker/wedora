import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  CalendarCheck,
  DollarSign,
  FileText,
  Inbox,
  Store,
  UserCheck,
  CheckCircle2,
  Clock,
  Send,
  MapPin,
  Users,
  ShieldCheck,
  Layers,
  ArrowRight,
  ThumbsUp,
  RotateCcw,
} from "lucide-react";
import {
  DashboardShell,
  PageTitle,
  StatCard,
  Panel,
  Status,
  SimpleTable,
  NavItem,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/hooks/useDemoSession";
import { DEMO_VENDORS } from "@/data/demoVendors";
import { VendorCalendarView } from "@/components/calendar/VendorCalendarView";
import { Inquiry, Quotation } from "@/types/booking";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Business Operations Hub — Wedora" },
      { name: "description", content: "Manage availability calendar, answer customer quotation requests, and track bookings." },
    ],
  }),
  component: VendorPortal,
});

const nav: NavItem[] = [
  { key: "overview", label: "Business Overview", icon: Store },
  { key: "calendar", label: "Availability Calendar", icon: CalendarCheck },
  { key: "inquiries", label: "Inquiries & Quotes", icon: Inbox },
  { key: "bookings", label: "Bookings & Payments", icon: DollarSign },
  { key: "profile", label: "Business Profile", icon: FileText },
];

function VendorPortal() {
  const [tab, setTab] = useState("overview");
  const [selectedVendorId, setSelectedVendorId] = useState("pun-cat-01"); // Default: Royal Feast Catering

  const {
    inquiries,
    quotations,
    bookings,
    payments,
    calendarOverrides,
    updateVendorAvailability,
    createQuotation,
  } = useDemoSession();

  // Active vendor data
  const vendor = useMemo(() => {
    return DEMO_VENDORS.find((v) => v.id === selectedVendorId) || DEMO_VENDORS[0];
  }, [selectedVendorId]);

  // Quotation form modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>("450000");
  const [quoteScope, setQuoteScope] = useState<string>("");
  const [quoteAdditions, setQuoteAdditions] = useState<string>("15000");
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Filter inquiries for this vendor
  const vendorInquiries = inquiries.filter((i) => i.vendorId === vendor.id);
  const vendorBookings = bookings.filter((b) => b.vendorId === vendor.id);
  const vendorPayments = payments.filter((p) => p.payeeName === vendor.businessName);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    createQuotation({
      inquiryId: selectedInquiry.id,
      vendorId: vendor.id,
      vendorBusinessName: vendor.businessName,
      quotedAmount: parseFloat(quoteAmount) || 0,
      serviceScope: quoteScope || `Full service execution package for ${selectedInquiry.eventName}`,
      includedServices: ["Setup & Logistics", "Uniformed Staff", "Supervisor On-site"],
      additionalCharges: parseFloat(quoteAdditions) || 0,
    });

    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedInquiry(null);
      setQuoteScope("");
    }, 1800);
  };

  return (
    <DashboardShell
      nav={nav}
      active={tab}
      onChange={setTab}
      role="Vendor Business Portal"
      user={vendor.businessName}
    >
      {/* Switch Demo Vendor Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gold-soft p-4 border border-gold/40 text-xs">
        <div>
          <span className="font-semibold uppercase tracking-wider text-navy text-[11px] block">
            Active Demonstration Vendor Account
          </span>
          <span className="text-plum font-bold text-sm mt-0.5 block">
            {vendor.businessName} · {vendor.category} ({vendor.primaryCity})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Switch Vendor Account:</span>
          <select
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="rounded-full border bg-card px-3.5 py-1.5 text-xs font-semibold text-navy outline-none focus:border-gold"
          >
            <option value="pun-cat-01">Royal Feast Catering & Hospitality (Pune Baner)</option>
            <option value="pun-cat-02">Heritage Rasoi Caterers (Pune Wakad)</option>
            <option value="pun-dec-01">Elegance Floral & Mandap Decor (Pune)</option>
            <option value="pun-ven-01">Emerald Meadows Wedding Lawn (Pune)</option>
            <option value="mum-cat-01">Maharaja Royal Banquet Caterers (Mumbai)</option>
            <option value="mum-org-01">Symphony Signature Weddings (Mumbai)</option>
            <option value="mum-e2e-01">Aura Royale End-to-End Management (Mumbai)</option>
          </select>
        </div>
      </div>

      {/* ================= 1. BUSINESS OVERVIEW ================= */}
      {tab === "overview" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Performance Metrics & Inquiries"
            subtitle="Verified platform event history and upcoming client commitments."
          />

          {/* Quick Metrics Bar: Wedora Performance & Trust (NO Star Ratings, NO AOV) */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Completed Orders"
              value={`${vendor.completedOrders || vendor.completedOrders90Days || 0}`}
              hint="Events completed through Wedora"
              icon={CheckCircle2}
            />
            <StatCard
              label="On-Time Delivery"
              value={`${vendor.onTimeDeliveryPercent || 96}%`}
              hint="Recorded delivery outcomes"
              icon={Clock}
            />
            <StatCard
              label="Referral Bookings"
              value={`${vendor.successfulReferralBookings || vendor.referralsTotal || 0}`}
              hint="Word-of-mouth recommendations"
              icon={ThumbsUp}
            />
            <StatCard
              label="Repeat Bookings"
              value={`${vendor.repeatCustomerBookings || vendor.repeatOrdersTotal || 0}`}
              hint="Returning customer bookings"
              icon={RotateCcw}
            />
          </div>

          {/* Verified Platform Activity Statement */}
          <div className="rounded-2xl border bg-card p-5 shadow-soft">
            <h3 className="font-display text-base text-plum font-semibold flex items-center gap-2">
              <UserCheck className="size-5 text-gold" /> Verified Platform Activity Statement
            </h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {vendor.isNewToPlatform || ((vendor.completedOrders || vendor.completedOrders90Days || 0) === 0)
                ? "New to Wedora — Building their performance history."
                : `Verified Active Vendor: ${vendor.businessName} has completed ${vendor.completedOrders || vendor.completedOrders90Days} verified client bookings through Wedora with a recorded on-time delivery rate of ${vendor.onTimeDeliveryPercent || 96}% and ${vendor.successfulReferralBookings || vendor.referralsTotal || 0} customer referral bookings.`}
            </p>
            <p className="mt-2 text-[11px] text-navy font-medium">
              * Note: Wedora uses verified event completion logs, service reliability, and customer feedback instead of traditional star ratings.
            </p>
          </div>

          {/* Upcoming Confirmed Events */}
          <Panel title="Upcoming Confirmed Client Events">
            {vendorBookings.length > 0 ? (
              <SimpleTable
                head={["Event Name", "Service Category", "Event Date", "Contract Value", "Paid", "Status"]}
                rows={vendorBookings.map((b) => [
                  <strong key={b.id} className="text-navy">{b.eventName}</strong>,
                  b.serviceCategory,
                  b.eventDate,
                  `₹${b.agreedAmount.toLocaleString("en-IN")}`,
                  <span key={b.id} className="text-success font-semibold">₹{(b.paidAmount || 0).toLocaleString("en-IN")}</span>,
                  <Status key={b.id} s={b.status} />,
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No bookings confirmed for this vendor account yet.
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 2. AVAILABILITY CALENDAR (PRD SECTION 9 & TEST H) ================= */}
      {tab === "calendar" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="Interactive Availability Calendar"
            subtitle="Change date statuses below. Customer and Planner AI searches immediately reflect these changes in real time."
          />
          <VendorCalendarView
            vendorId={vendor.id}
            vendorBusinessName={vendor.businessName}
            currentOverrides={calendarOverrides[vendor.id] || {}}
            onUpdateAvailability={(date, status) => {
              updateVendorAvailability(vendor.id, date, status);
            }}
          />
        </div>
      )}

      {/* ================= 3. INQUIRIES & QUOTATIONS ================= */}
      {tab === "inquiries" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Received Customer Inquiries"
            subtitle="Respond with formal quotes or adjust service scopes."
          />

          <Panel title="Inquiries Inbound Queue">
            {vendorInquiries.length > 0 ? (
              <SimpleTable
                head={["Event Name", "Requester", "Event Date", "Guests", "Requirements", "Status", "Action"]}
                rows={vendorInquiries.map((inq) => [
                  <strong key={inq.id} className="text-navy">{inq.eventName}</strong>,
                  inq.requesterName,
                  inq.eventDate,
                  `${inq.guestCount} guests`,
                  <span key={inq.id} className="max-w-xs truncate block text-xs">{inq.requirements}</span>,
                  <Status key={inq.id} s={inq.status} />,
                  inq.status === "PENDING" ? (
                    <Button
                      key={inq.id}
                      size="sm"
                      variant="hero"
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setQuoteScope(`Complete ${vendor.category} service package for ${inq.eventName} (${inq.guestCount} guests)`);
                      }}
                    >
                      Create Quotation
                    </Button>
                  ) : (
                    <span key={inq.id} className="text-xs text-success font-medium">Quoted</span>
                  ),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No customer inquiries received yet. Try submitting an inquiry from the AI Discovery tab!
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 4. BOOKINGS & PAYMENTS ================= */}
      {tab === "bookings" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Bookings & Simulated Payments"
            subtitle="View client advance deposits and milestone transactions."
          />

          <Panel title="Recent Transactions Ledger (Simulated)">
            {vendorPayments.length > 0 ? (
              <SimpleTable
                head={["Ref ID", "Event", "Payer", "Purpose", "Amount", "Status", "Timestamp"]}
                rows={vendorPayments.map((p) => [
                  <span key={p.id} className="font-mono text-[11px] text-plum">{p.transactionRef}</span>,
                  p.eventName,
                  p.payerName,
                  p.paymentPurpose,
                  `₹${p.amount.toLocaleString("en-IN")}`,
                  <Status key={p.id} s={p.status} />,
                  new Date(p.createdAt).toLocaleDateString("en-IN"),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No simulated transactions received yet for this vendor.
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 5. BUSINESS PROFILE ================= */}
      {tab === "profile" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="Vendor Business Profile"
            subtitle="Public details displayed on Wedora's discovery cards and profile view."
          />

          <div className="rounded-3xl border bg-card p-6 shadow-soft space-y-4 text-xs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground block font-medium">Business Name:</span>
                <span className="font-display text-lg text-plum font-semibold">{vendor.businessName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Primary Category:</span>
                <span className="font-semibold text-navy">{vendor.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Primary City:</span>
                <span className="font-semibold text-navy">{vendor.primaryCity}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Serviceable Areas:</span>
                <span className="font-medium text-navy">{vendor.serviceableAreas.join(", ")}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Starting Price:</span>
                <span className="font-medium text-plum">
                  {vendor.startingPrice ? `₹${vendor.startingPrice.toLocaleString("en-IN")} (${vendor.priceUnit || "per event"})` : "Quotation Required"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block font-medium">Guest Capacity:</span>
                <span className="font-medium text-navy">
                  {vendor.maximumGuestCapacity ? `Up to ${vendor.maximumGuestCapacity} guests` : "Custom / Open"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <span className="text-muted-foreground block font-medium mb-1">Business Description:</span>
              <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
            </div>

            {vendor.secondaryCategories && vendor.secondaryCategories.length > 0 && (
              <div className="pt-3 border-t">
                <span className="text-muted-foreground block font-medium mb-1.5">Coordinated Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.secondaryCategories.map((sc) => (
                    <span key={sc} className="rounded-full bg-plum-soft px-2.5 py-0.5 text-[11px] font-medium text-plum">
                      {sc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quotation Creation Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8">
            <h3 className="text-xl font-display text-plum font-semibold mb-1">
              Issue Formal Quotation
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Responding to inquiry for {selectedInquiry.eventName} ({selectedInquiry.guestCount} guests)
            </p>

            {quoteSuccess ? (
              <div className="my-6 rounded-2xl bg-success-soft p-5 text-center text-success animate-rise">
                <CheckCircle2 className="size-10 mx-auto mb-2 text-success" />
                <h4 className="font-display text-base font-semibold">Quotation Dispatched!</h4>
                <p className="text-xs mt-1 text-muted-foreground">
                  Client has received your proposal and can now accept and confirm the booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-navy mb-1">
                    Quoted Base Amount (₹):
                  </label>
                  <input
                    type="number"
                    required
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold font-semibold text-navy text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy mb-1">
                    Estimated Taxes & Setup Charges (₹):
                  </label>
                  <input
                    type="number"
                    value={quoteAdditions}
                    onChange={(e) => setQuoteAdditions(e.target.value)}
                    className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy mb-1">
                    Detailed Scope of Inclusions:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={quoteScope}
                    onChange={(e) => setQuoteScope(e.target.value)}
                    className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setSelectedInquiry(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero">
                    <Send className="size-3.5 mr-1" /> Submit Formal Quotation
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
