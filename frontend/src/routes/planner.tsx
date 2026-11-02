import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  Building2,
  Phone,
  ChevronDown,
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
import { PlannerVendorDirectory } from "@/components/planner/PlannerVendorDirectory";
import { MyShortlistView } from "@/components/shortlist/MyShortlistView";
import { useDemoSession } from "@/hooks/useDemoSession";
import { SimulatedPaymentModal } from "@/components/payments/SimulatedPaymentModal";
import { EventTimelineView } from "@/components/timeline/EventTimelineView";
import { Booking } from "@/types/booking";
import { WeddingEvent } from "@/types/event";
import { CreateEventAIModal } from "@/components/planner/CreateEventAIModal";
import { ManageClientProfilesModal } from "@/components/planner/ManageClientProfilesModal";
import { ClientEventDetailModal } from "@/components/planner/ClientEventDetailModal";
import { ALL_LOCALITIES } from "@/utils/localityRegistry";

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
  { key: "discovery", label: "Vendor Directory", icon: Store },
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
    addEvent,
    quotations,
    bookings,
    payments,
    timelineTasks,
    acceptQuotationAndBook,
    recordSimulatedPayment,
    addTimelineTask,
    toggleTimelineTask,
    customerProfiles,
    // Organizer Client Profiles
    organizerClients,
    activeClientId,
    activeClient,
    setActiveClientId,
    addOrganizerClient,
    updateOrganizerClient,
    archiveOrganizerClient,
    createClientEvent,
  } = useDemoSession();

  // Payment modal state
  const [payBooking, setPayBooking] = useState<Booking | null>(null);

  // AI Event Creation Modal State
  const [showAIEventModal, setShowAIEventModal] = useState(false);

  // Manage Organizer Client Profiles Modal
  const [showManageClientsModal, setShowManageClientsModal] = useState(false);

  // Client Event Detail Popup Modal State
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<WeddingEvent | null>(null);

  // New Event creation modal/state
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEventClientName, setNewEventClientName] = useState("");
  const [newEventClientPhone, setNewEventClientPhone] = useState("+91 98200 11223");
  const [newEventName, setNewEventName] = useState("");
  const [newEventType, setNewEventType] = useState("Traditional Hindu Wedding & Reception");
  const [newEventCity, setNewEventCity] = useState<"Mumbai" | "Pune">("Pune");
  const [newEventArea, setNewEventArea] = useState("Baner");
  const [newEventVenueName, setNewEventVenueName] = useState("");
  const [newEventVenueAddress, setNewEventVenueAddress] = useState("");
  const [newEventDate, setNewEventDate] = useState("2026-12-28");
  const [newEventGuests, setNewEventGuests] = useState(600);
  const [newEventBudget, setNewEventBudget] = useState(3000000);

  // Overall metrics
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
            subtitle="Coordinate multiple weddings and private celebrations. Click any celebration to view event overview, planning checklist, budget fluctuation, and contracts."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowManageClientsModal(true)}
                  className="border-border text-navy hover:bg-muted font-medium gap-1.5 shadow-2xs cursor-pointer text-xs"
                >
                  <Users className="size-3.5 text-navy/70" /> Manage Clients ({organizerClients.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAIEventModal(true)}
                  className="border-gold text-plum hover:bg-gold-soft font-semibold gap-1.5 shadow-2xs cursor-pointer text-xs"
                >
                  <Sparkles className="size-4 text-gold" /> Create Event with AI
                </Button>
                <Button
                  variant="hero"
                  onClick={() => setShowNewEventModal(true)}
                  className="gap-1.5 shadow-2xs cursor-pointer text-xs"
                >
                  <Plus className="size-4" /> Create New Client Event
                </Button>
              </div>
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
                  onClick={() => {
                    setActiveEventId(e.id);
                    setSelectedDetailEvent(e);
                  }}
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

                  <div className="mt-3 space-y-2 text-xs text-muted-foreground flex-1">
                    <div className="flex items-center gap-1.5 font-medium text-navy">
                      <Calendar className="size-3.5 text-gold shrink-0" />
                      <span>{e.eventDate}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Building2 className="size-3.5 text-gold shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {e.venueName ? `${e.venueName} • ${e.area}, ${e.city}` : `${e.area}, ${e.city}`}
                      </span>
                    </div>
                    {e.clientName && (
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-gold shrink-0" />
                        <span>Client: <strong className="text-navy">{e.clientName}</strong></span>
                      </div>
                    )}
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
                        setSelectedDetailEvent(e);
                      }}
                      className="font-semibold text-plum hover:text-gold flex items-center gap-1 transition cursor-pointer"
                    >
                      View Details & Milestones <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 2. VENDOR DIRECTORY ================= */}
      {tab === "discovery" && (
        <div className="space-y-4 animate-rise">
          <PageTitle
            title="Vendor Directory & Collaborator Hub"
            subtitle="Intelligent AI voice assistant for discovering trusted collaborators, checking calendar availability, swapping unavailable vendors, and forecasting event readiness."
            className="mb-2"
          />
          <PlannerVendorDirectory />
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

      {/* AI Event Creation Assistant Modal */}
      <CreateEventAIModal
        isOpen={showAIEventModal}
        onClose={() => setShowAIEventModal(false)}
        onEventCreated={(eventPayload) => {
          const created = addEvent(eventPayload);
          setActiveEventId(created.id);
          setTab("discovery");
        }}
      />

      {/* Manual New Event Registration Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-card p-6 sm:p-7 shadow-float border border-gold/40 relative animate-rise my-8 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-xl font-display text-plum font-semibold">
                  Register Client Wedding Event
                </h3>
                <p className="text-xs text-muted-foreground">
                  Date and venue details are mandatory as the single source of truth for vendor discovery.
                </p>
              </div>
              <button
                onClick={() => setShowNewEventModal(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newEventClientName.trim() || !newEventVenueName.trim() || !newEventDate.trim()) {
                  alert("Please fill in all mandatory fields: Client Name, Event Date, and Venue Name.");
                  return;
                }

                const created = addEvent({
                  eventName: newEventName.trim() || `${newEventClientName.trim()}'s Wedding Celebration`,
                  eventType: newEventType,
                  eventDate: newEventDate,
                  city: newEventCity,
                  area: newEventArea,
                  venueName: newEventVenueName.trim(),
                  venueAddress: newEventVenueAddress.trim() || `${newEventVenueName.trim()}, ${newEventArea}, ${newEventCity}`,
                  clientName: newEventClientName.trim(),
                  clientPhone: newEventClientPhone.trim(),
                  guestCount: newEventGuests,
                  estimatedBudget: newEventBudget,
                  ownerRole: "PLANNER",
                  ownerName: "Aditi Sharma (Lead Planner)",
                  description: `Wedding celebration for ${newEventClientName} at ${newEventVenueName}, ${newEventArea}, ${newEventCity}.`,
                });

                setActiveEventId(created.id);
                setShowNewEventModal(false);
                setTab("discovery");
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-navy mb-1">
                    Client / Couple Name <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventClientName}
                    onChange={(e) => {
                      setNewEventClientName(e.target.value);
                      if (!newEventName) {
                        setNewEventName(`${e.target.value}'s Wedding Celebration`);
                      }
                    }}
                    placeholder="e.g. Varun Kulkarni & Ananya Sen"
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Client Phone <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventClientPhone}
                    onChange={(e) => setNewEventClientPhone(e.target.value)}
                    placeholder="+91 98200 11223"
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">Event Title:</label>
                  <input
                    type="text"
                    required
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. Varun & Ananya Royal Wedding"
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">Event Type:</label>
                  <select
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  >
                    <option value="Traditional Hindu Wedding & Reception">Traditional Hindu Wedding & Reception</option>
                    <option value="Grand Sangeet & Royal Wedding">Grand Sangeet & Royal Wedding</option>
                    <option value="Hillside Destination Wedding">Hillside Destination Wedding</option>
                    <option value="Contemporary Reception & Cocktail">Contemporary Reception & Cocktail</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Destination City <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    value={newEventCity}
                    onChange={(e) => {
                      const c = e.target.value as "Mumbai" | "Pune";
                      setNewEventCity(c);
                      const defLoc = ALL_LOCALITIES.find((l) => l.city === c);
                      if (defLoc) setNewEventArea(defLoc.canonicalName);
                    }}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Locality / Area <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    value={newEventArea}
                    onChange={(e) => setNewEventArea(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  >
                    {ALL_LOCALITIES.filter((l) => l.city === newEventCity).map((l) => (
                      <option key={l.canonicalName} value={l.canonicalName}>
                        {l.canonicalName} ({l.devanagari})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Event Date <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Venue Name <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventVenueName}
                    onChange={(e) => setNewEventVenueName(e.target.value)}
                    placeholder="e.g. Emerald Meadows Banquets"
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-navy mb-1">
                    Complete Venue Address <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={newEventVenueAddress}
                    onChange={(e) => setNewEventVenueAddress(e.target.value)}
                    placeholder="e.g. Survey No. 45/2, Pancard Club Road, Baner, Pune 411045"
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Guest Count <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="number"
                    min={50}
                    required
                    value={newEventGuests}
                    onChange={(e) => setNewEventGuests(parseInt(e.target.value, 10) || 500)}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-navy mb-1">
                    Estimated Budget (₹) <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="number"
                    step={50000}
                    required
                    value={newEventBudget}
                    onChange={(e) => setNewEventBudget(parseInt(e.target.value, 10) || 2500000)}
                    className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button type="button" variant="ghost" onClick={() => setShowNewEventModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="font-semibold">
                  Register Client Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Organizer Client Profiles Modal */}
      <ManageClientProfilesModal
        isOpen={showManageClientsModal}
        onClose={() => setShowManageClientsModal(false)}
        clients={organizerClients}
        activeClientId={activeClientId}
        events={events}
        onSelectClient={(id) => setActiveClientId(id)}
        onAddClient={addOrganizerClient}
        onUpdateClient={updateOrganizerClient}
        onArchiveClient={archiveOrganizerClient}
        onCreateClientEvent={createClientEvent}
      />

      {/* Detailed Client Event Modal Popup */}
      <ClientEventDetailModal
        isOpen={Boolean(selectedDetailEvent)}
        onClose={() => setSelectedDetailEvent(null)}
        event={selectedDetailEvent}
        tasks={timelineTasks}
        bookings={bookings}
        quotations={quotations}
        sharedProfiles={customerProfiles}
        onToggleTask={(taskId) => toggleTimelineTask(taskId)}
        onAddTask={(taskName, category, deadline) => addTimelineTask(taskName, category, deadline)}
        onPayBooking={(booking) => {
          setSelectedDetailEvent(null);
          setPayBooking(booking);
        }}
        onNavigateToDiscovery={(eventId) => {
          setActiveEventId(eventId);
          setTab("discovery");
        }}
      />
    </DashboardShell>
  );
}
