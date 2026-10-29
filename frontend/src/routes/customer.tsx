import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Sparkles,
  CreditCard,
  Calendar,
  CheckSquare,
  AlertCircle,
  Briefcase,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Bookmark,
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
import { AIDiscovery } from "@/components/ai-discovery";
import { MyShortlistView } from "@/components/shortlist/MyShortlistView";
import { useDemoSession } from "@/hooks/useDemoSession";
import { SimulatedPaymentModal } from "@/components/payments/SimulatedPaymentModal";
import { EventTimelineView } from "@/components/timeline/EventTimelineView";
import { Booking } from "@/types/booking";

export const Route = createFileRoute("/customer")({
  head: () => ({
    meta: [
      { title: "Individual Customer Wedding Hub — Wedora" },
      { name: "description", content: "Plan your wedding celebration or hire an event organizer on Wedora." },
    ],
  }),
  component: CustomerPortal,
});

const nav: NavItem[] = [
  { key: "hub", label: "Planning Hub", icon: Heart },
  { key: "discovery", label: "Find Vendors with AI", icon: Sparkles },
  { key: "organizers", label: "Find Event Organizers", icon: Briefcase },
  { key: "shortlist", label: "My Shortlist", icon: Bookmark },
  { key: "bookings", label: "My Bookings & Payments", icon: CreditCard },
  { key: "timeline", label: "Wedding Timeline", icon: CheckSquare },
];

function CustomerPortal() {
  const [tab, setTab] = useState("hub");
  const [discoveryInitialCat, setDiscoveryInitialCat] = useState<string>("Catering and Food Services");

  const {
    activeEvent,
    bookings,
    inquiries,
    quotations,
    payments,
    timelineTasks,
    recordSimulatedPayment,
    addTimelineTask,
    toggleTimelineTask,
    acceptQuotationAndBook,
  } = useDemoSession();

  // Payment modal state
  const [payBooking, setPayBooking] = useState<Booking | null>(null);

  const handleStartSelfPlan = () => {
    setDiscoveryInitialCat("Catering and Food Services");
    setTab("discovery");
  };

  const handleStartHireOrganizer = () => {
    setDiscoveryInitialCat("Event Organizers / Wedding Planners");
    setTab("discovery");
  };

  return (
    <DashboardShell
      nav={nav}
      active={tab}
      onChange={setTab}
      role="Individual Customer Portal"
      user="Rohan Kulkarni (Groom)"
    >
      {/* ================= 1. PLANNING HUB ================= */}
      {tab === "hub" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="My Wedding Celebration"
            subtitle={`${activeEvent.eventName} · ${activeEvent.eventDate} in ${activeEvent.city}`}
          />

          {/* Quick Metrics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Wedding Date"
              value={activeEvent.eventDate}
              hint={`${activeEvent.city} (${activeEvent.area})`}
              icon={Calendar}
            />
            <StatCard
              label="Expected Guests"
              value={`${activeEvent.guestCount}`}
              hint="Guest seating capacity"
              icon={Heart}
            />
            <StatCard
              label="Estimated Budget"
              value={`₹${activeEvent.estimatedBudget.toLocaleString("en-IN")}`}
              hint="Planned expenses"
              icon={CreditCard}
            />
          </div>

          {/* PRD Section 7 & 13: Mandatory Prominent Choice Between Self-Plan vs Event Organizer */}
          <section className="rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 shadow-float relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Event Coordination Strategy
              </span>
              <h2 className="text-2xl sm:text-3xl font-display text-plum font-semibold mt-1">
                Looking for an Event Organizer?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Let a professional manage your entire wedding or event, from vendor coordination to event-day execution. Or explore and book vendors individually.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {/* Card 1: Plan My Event Myself */}
              <div className="flex flex-col rounded-2xl border bg-secondary/50 p-6 transition hover:border-gold hover:shadow-soft">
                <div className="flex size-12 items-center justify-center rounded-full bg-gold-soft text-gold mb-4">
                  <Store className="size-5" />
                </div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Plan My Event Myself
                </h3>
                <p className="text-xs text-muted-foreground mt-2 flex-1 leading-relaxed">
                  Discover and coordinate catering, decoration, lighting, venues, photography, and other vendors directly through our conversational AI.
                </p>
                <div className="mt-6 pt-3 border-t">
                  <Button
                    variant="soft"
                    className="w-full text-xs font-semibold"
                    onClick={handleStartSelfPlan}
                  >
                    Find Individual Vendors <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>

              {/* Card 2: Hire an Event Organizer (PRD Section 7 & Test I) */}
              <div className="flex flex-col rounded-2xl border border-gold/40 bg-gold-soft/30 p-6 transition hover:border-gold hover:shadow-soft ring-1 ring-gold/30">
                <div className="flex size-12 items-center justify-center rounded-full bg-gradient-plum text-gold mb-4">
                  <Briefcase className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display text-plum font-semibold">
                    Hire an Event Organizer
                  </h3>
                  <span className="text-[10px] bg-gold-soft text-navy px-2 py-0.5 rounded-full font-bold border border-gold/40">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex-1 leading-relaxed">
                  Find professional wedding planners and end-to-end event management providers who can organize the entire event with turnkey accountability.
                </p>
                <div className="mt-6 pt-3 border-t">
                  <Button
                    variant="hero"
                    className="w-full text-xs font-semibold"
                    onClick={handleStartHireOrganizer}
                  >
                    Find Event Organizers <ArrowRight className="size-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Overview of Booked Services */}
          <Panel title="Confirmed Wedding Contracts">
            {bookings.length > 0 ? (
              <SimpleTable
                head={["Vendor Name", "Service Category", "Event Date", "Contract Amount", "Paid to Date", "Status"]}
                rows={bookings.map((b) => [
                  <strong key={b.id} className="text-navy">{b.vendorBusinessName}</strong>,
                  b.serviceCategory,
                  b.eventDate,
                  `₹${b.agreedAmount.toLocaleString("en-IN")}`,
                  <span key={b.id} className="text-success font-medium">₹{(b.paidAmount || 0).toLocaleString("en-IN")}</span>,
                  <Status key={b.id} s={b.status} />,
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No vendors booked yet. Ask the AI Coordinator to discover vendors!
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 2. FIND VENDORS WITH AI ================= */}
      {tab === "discovery" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="AI Vendor Discovery Assistant"
            subtitle="Search across 100 fictional vendors in Mumbai and Pune with multi-turn session memory and verified availability."
          />
          <AIDiscovery
            eventId={activeEvent.id}
            initialCategory={discoveryInitialCat}
          />
        </div>
      )}

      {/* ================= 3. FIND EVENT ORGANIZERS (DIRECT TAB) ================= */}
      {tab === "organizers" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="Professional Wedding Planners & Turnkey Management"
            subtitle="Find verified event organizers and end-to-end providers in your city."
          />
          <AIDiscovery
            eventId={activeEvent.id}
            initialCategory="Event Organizers / Wedding Planners"
          />
        </div>
      )}

      {/* ================= MY SHORTLIST ================= */}
      {tab === "shortlist" && <MyShortlistView />}

      {/* ================= 4. BOOKINGS & SIMULATED PAYMENTS ================= */}
      {tab === "bookings" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="My Bookings & Simulated Ledger"
            subtitle="Track milestone advances, formal quotations, and record simulated payments."
          />

          {/* Quotations received from inquiries */}
          <Panel title="Formal Quotations Received">
            {quotations.length > 0 ? (
              <SimpleTable
                head={["Vendor", "Service Scope", "Quoted Amount", "Status", "Action"]}
                rows={quotations.map((q) => [
                  <strong key={q.id} className="text-navy">{q.vendorBusinessName}</strong>,
                  <span key={q.id} className="max-w-xs truncate block text-xs">{q.serviceScope}</span>,
                  `₹${q.quotedAmount.toLocaleString("en-IN")}`,
                  <Status key={q.id} s={q.status} />,
                  q.status === "SENT" ? (
                    <Button
                      key={q.id}
                      size="sm"
                      variant="hero"
                      onClick={() => {
                        acceptQuotationAndBook(q.id);
                        alert(`Accepted quotation from ${q.vendorBusinessName}! Booking confirmed.`);
                      }}
                    >
                      Accept & Confirm Booking
                    </Button>
                  ) : (
                    <span key={q.id} className="text-xs text-muted-foreground font-semibold">Booked</span>
                  ),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No quotations received yet. Request a quotation from the AI Discovery tab!
              </p>
            )}
          </Panel>

          {/* Confirmed Bookings & Pay Buttons */}
          <Panel title="Confirmed Vendor Services & Balances">
            {bookings.length > 0 ? (
              <SimpleTable
                head={["Vendor", "Service", "Event Date", "Agreed Total", "Paid to Date", "Action"]}
                rows={bookings.map((b) => {
                  const paid = b.paidAmount || 0;
                  const balance = Math.max(0, b.agreedAmount - paid);
                  return [
                    <strong key={b.id} className="text-navy">{b.vendorBusinessName}</strong>,
                    b.serviceCategory,
                    b.eventDate,
                    `₹${b.agreedAmount.toLocaleString("en-IN")}`,
                    <span key={b.id} className="text-success font-semibold">
                      ₹{paid.toLocaleString("en-IN")} {balance > 0 ? `(Bal: ₹${balance.toLocaleString("en-IN")})` : "(Fully Paid)"}
                    </span>,
                    balance > 0 ? (
                      <Button
                        key={b.id}
                        size="sm"
                        variant="gold"
                        onClick={() => setPayBooking(b)}
                      >
                        Make Demo Payment
                      </Button>
                    ) : (
                      <span key={b.id} className="text-xs text-success font-medium">Complete</span>
                    ),
                  ];
                })}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No confirmed bookings to show.
              </p>
            )}
          </Panel>

          {/* Transaction Ledger */}
          <Panel title="Simulated Transaction Ledger">
            {payments.length > 0 ? (
              <SimpleTable
                head={["Reference", "Payee", "Amount", "Purpose", "Simulated Flag", "Date"]}
                rows={payments.map((p) => [
                  <span key={p.id} className="font-mono text-[11px] text-plum">{p.transactionRef}</span>,
                  p.payeeName,
                  `₹${p.amount.toLocaleString("en-IN")}`,
                  p.paymentPurpose,
                  <span key={p.id} className="text-[10px] text-gold font-bold uppercase tracking-wider bg-gold-soft px-2 py-0.5 rounded-full">
                    Demo Simulation
                  </span>,
                  new Date(p.createdAt).toLocaleDateString("en-IN"),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No simulated transactions recorded yet.
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 5. WEDDING TIMELINE ================= */}
      {tab === "timeline" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="Wedding Schedule & Checklist"
            subtitle="Editable milestones, vendor deadlines, and task completion tracking."
          />
          <EventTimelineView
            tasks={timelineTasks.filter((t) => t.eventId === activeEvent.id || !t.eventId)}
            onAddTask={(taskName, category, deadline) => addTimelineTask(taskName, category, deadline)}
            onToggleTask={(taskId) => toggleTimelineTask(taskId)}
          />
        </div>
      )}

      {/* Simulated Payment Modal */}
      {payBooking && (
        <SimulatedPaymentModal
          booking={payBooking}
          onClose={() => setPayBooking(null)}
          onConfirmPayment={(bookingId, amount, purpose) => {
            recordSimulatedPayment({
              bookingId,
              eventId: payBooking.eventId,
              payeeName: payBooking.vendorBusinessName,
              amount,
              purpose,
            });
          }}
        />
      )}
    </DashboardShell>
  );
}
