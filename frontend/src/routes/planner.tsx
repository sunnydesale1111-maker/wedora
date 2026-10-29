import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Calendar,
  CheckSquare,
  CreditCard,
  DollarSign,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Users,
  Store,
  Layers,
  MapPin,
  ArrowRight,
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

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Professional Event Planner Hub — Wedora" },
      { name: "description", content: "Multi-client wedding coordination, AI vendor discovery, and milestone tracking." },
    ],
  }),
  component: PlannerPortal,
});

const nav: NavItem[] = [
  { key: "events", label: "Managed Client Events", icon: Calendar },
  { key: "discovery", label: "AI Vendor Discovery", icon: Sparkles },
  { key: "shortlist", label: "My Shortlist", icon: Bookmark },
  { key: "quotations", label: "Quotes & Bookings", icon: Briefcase },
  { key: "payments", label: "Simulated Payments", icon: CreditCard },
  { key: "timeline", label: "Event Timelines", icon: CheckSquare },
];

function PlannerPortal() {
  const [tab, setTab] = useState("events");
  const {
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    quotations,
    bookings,
    payments,
    timelineTasks,
    acceptQuotationAndBook,
    recordSimulatedPayment,
    addTimelineTask,
    toggleTimelineTask,
  } = useDemoSession();

  // Payment modal state
  const [payBooking, setPayBooking] = useState<Booking | null>(null);

  // New Event creation modal/state
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventCity, setNewEventCity] = useState<"Mumbai" | "Pune">("Pune");
  const [newEventDate, setNewEventDate] = useState("2026-12-28");
  const [newEventGuests, setNewEventGuests] = useState(600);

  const totalAgreed = bookings.reduce((sum, b) => sum + b.agreedAmount, 0);
  const totalPaid = bookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const outstandingTotal = Math.max(0, totalAgreed - totalPaid);

  return (
    <DashboardShell
      nav={nav}
      active={tab}
      onChange={setTab}
      role="Professional Event Planner"
      user="Aditi Sharma (Lead Planner)"
    >
      {/* ================= 1. MANAGED CLIENT EVENTS ================= */}
      {tab === "events" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Managed Client Events"
            subtitle="Coordinate multiple weddings and private celebrations. Select an event to contextualize AI Discovery."
            action={
              <Button
                variant="hero"
                onClick={() => setShowNewEventModal(true)}
              >
                <Plus className="size-4 mr-1.5" /> Create New Client Event
              </Button>
            }
          />

          {/* Quick Metrics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Events"
              value={`${events.length}`}
              hint="Current wedding seasons"
              icon={Calendar}
            />
            <StatCard
              label="Confirmed Bookings"
              value={`${bookings.length}`}
              hint="Secured vendor contracts"
              icon={Briefcase}
            />
            <StatCard
              label="Managed Budget"
              value={`₹${totalAgreed.toLocaleString("en-IN")}`}
              hint="Aggregated contract value"
              icon={DollarSign}
            />
            <StatCard
              label="Outstanding Balances"
              value={`₹${outstandingTotal.toLocaleString("en-IN")}`}
              hint="Pending milestones"
              icon={CreditCard}
            />
          </div>

          {/* Event Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const isSelected = activeEventId === e.id;
              const eventBookings = bookings.filter((b) => b.eventId === e.id);
              return (
                <div
                  key={e.id}
                  onClick={() => setActiveEventId(e.id)}
                  className={`flex flex-col rounded-3xl border p-6 transition shadow-soft cursor-pointer ${
                    isSelected
                      ? "border-gold bg-gold-soft/30 ring-2 ring-gold/50"
                      : "bg-card hover:-translate-y-1 hover:border-gold/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold">
                      {e.eventType}
                    </span>
                    {isSelected ? (
                      <span className="text-[10px] font-bold bg-plum text-primary-foreground px-2.5 py-0.5 rounded-full">
                        Active Context
                      </span>
                    ) : (
                      <Status s="Confirmed" />
                    )}
                  </div>

                  <h3 className="mt-3 text-xl font-display text-plum font-semibold">
                    {e.eventName}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground flex-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-gold shrink-0" />
                      <span>{e.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-gold shrink-0" />
                      <span>{e.city} ({e.area})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5 text-gold shrink-0" />
                      <span>{e.guestCount} Guests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="size-3.5 text-gold shrink-0" />
                      <span>Budget: ₹{e.estimatedBudget.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs">
                    <span className="font-medium text-navy">
                      {eventBookings.length} Vendors Booked
                    </span>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setActiveEventId(e.id);
                        setTab("discovery");
                      }}
                      className="font-semibold text-plum hover:text-gold flex items-center gap-1 transition"
                    >
                      AI Discovery <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 2. AI VENDOR DISCOVERY (USES ACTIVE EVENT) ================= */}
      {tab === "discovery" && (
        <div className="space-y-6 animate-rise">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gold-soft p-3.5 rounded-2xl border border-gold/40 text-xs text-navy">
            <div>
              Active Planning Event Context: <strong className="text-plum">{activeEvent.eventName}</strong> ({activeEvent.city}, {activeEvent.eventDate})
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Switch Event:</span>
              <select
                value={activeEventId}
                onChange={(e) => setActiveEventId(e.target.value)}
                className="rounded-full border bg-card px-3 py-1 text-xs font-semibold text-navy outline-none focus:border-gold"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} ({ev.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <PageTitle
            title="AI Vendor Discovery Engine"
            subtitle="Describe requirements in natural language. The AI translates queries into structured parameters across the 100-vendor catalog."
          />
          <AIDiscovery eventId={activeEventId} />
        </div>
      )}

      {/* ================= MY SHORTLIST ================= */}
      {tab === "shortlist" && <MyShortlistView />}

      {/* ================= 3. QUOTATIONS & BOOKINGS ================= */}
      {tab === "quotations" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Quotations & Booking Confirmation"
            subtitle="Review proposals, lock calendar dates, and verify capacity reservations."
          />

          <Panel title="Vendor Proposals & Quotations">
            {quotations.length > 0 ? (
              <SimpleTable
                head={["Vendor Name", "Scope of Work", "Quoted Base", "Status", "Action"]}
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
                        alert(`Booking confirmed with ${q.vendorBusinessName}! Capacity reserved.`);
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
                No quotations currently pending. Request quotes via AI Vendor Discovery!
              </p>
            )}
          </Panel>

          <Panel title="Active Confirmed Contracts">
            {bookings.length > 0 ? (
              <SimpleTable
                head={["Event", "Vendor", "Service Category", "Event Date", "Agreed Total", "Paid to Date", "Action"]}
                rows={bookings.map((b) => {
                  const paid = b.paidAmount || 0;
                  const balance = Math.max(0, b.agreedAmount - paid);
                  return [
                    b.eventName,
                    <strong key={b.id} className="text-navy">{b.vendorBusinessName}</strong>,
                    b.serviceCategory,
                    b.eventDate,
                    `₹${b.agreedAmount.toLocaleString("en-IN")}`,
                    <span key={b.id} className="text-success font-semibold">
                      ₹{paid.toLocaleString("en-IN")} {balance > 0 ? `(Bal: ₹${balance.toLocaleString("en-IN")})` : "(Settled)"}
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
                      <span key={b.id} className="text-xs text-success font-medium">Settled</span>
                    ),
                  ];
                })}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No confirmed bookings.
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 4. SIMULATED PAYMENTS ================= */}
      {tab === "payments" && (
        <div className="space-y-8 animate-rise">
          <PageTitle
            title="Simulated Payments Ledger"
            subtitle="Manage demo deposits, milestone disbursements, and vendor accounts. All transactions are simulated."
          />

          <Panel title="Simulated Transaction Audit Ledger">
            {payments.length > 0 ? (
              <SimpleTable
                head={["Ref ID", "Event", "Payer", "Payee", "Amount", "Status", "Simulated Flag", "Timestamp"]}
                rows={payments.map((p) => [
                  <span key={p.id} className="font-mono text-[11px] text-plum">{p.transactionRef}</span>,
                  p.eventName,
                  p.payerName,
                  p.payeeName,
                  `₹${p.amount.toLocaleString("en-IN")}`,
                  <Status key={p.id} s={p.status} />,
                  <span key={p.id} className="text-[10px] text-gold font-bold uppercase tracking-wider bg-gold-soft px-2 py-0.5 rounded-full">
                    Demo Simulation
                  </span>,
                  new Date(p.createdAt).toLocaleDateString("en-IN"),
                ])}
              />
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6">
                No payment transactions recorded yet.
              </p>
            )}
          </Panel>
        </div>
      )}

      {/* ================= 5. EVENT TIMELINE ================= */}
      {tab === "timeline" && (
        <div className="space-y-6 animate-rise">
          <PageTitle
            title="Planning Timeline & Milestones"
            subtitle={`Milestone schedule for ${activeEvent.eventName} (${activeEvent.eventDate})`}
          />
          <EventTimelineView
            tasks={timelineTasks.filter((t) => t.eventId === activeEventId || !t.eventId)}
            onAddTask={(taskName, category, deadline) => addTimelineTask(taskName, category, deadline)}
            onToggleTask={(taskId) => toggleTimelineTask(taskId)}
          />
        </div>
      )}

      {/* Payment Modal */}
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

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8">
            <h3 className="text-xl font-display text-plum font-semibold mb-2">
              Create Client Wedding Event
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Add a new client event to your planning agency dashboard.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Demo event "${newEventName || "New Wedding"}" created successfully!`);
                setShowNewEventModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-navy mb-1">Event Name:</label>
                <input
                  type="text"
                  required
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  placeholder="e.g. Varun & Ananya's Royal Wedding"
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Destination City:</label>
                <select
                  value={newEventCity}
                  onChange={(e) => setNewEventCity(e.target.value as any)}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                >
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Event Date:</label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-navy mb-1">Guest Count:</label>
                <input
                  type="number"
                  value={newEventGuests}
                  onChange={(e) => setNewEventGuests(parseInt(e.target.value, 10) || 500)}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="ghost" onClick={() => setShowNewEventModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero">
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
