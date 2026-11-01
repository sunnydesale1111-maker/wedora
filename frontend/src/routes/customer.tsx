import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart,
  Sparkles,
  CreditCard,
  Calendar,
  AlertCircle,
  Briefcase,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Bookmark,
  Users,
  DollarSign,
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
import { CustomerEventOnboarding } from "@/components/customer/CustomerEventOnboarding";
import { CustomerVendorDirectory } from "@/components/customer/CustomerVendorDirectory";
import { EventOrganizerDirectory } from "@/components/customer/EventOrganizerDirectory";
import { CustomerShortlistAndCommunications } from "@/components/customer/CustomerShortlistAndCommunications";
import { CustomerBookingsAndChecklist } from "@/components/customer/CustomerBookingsAndChecklist";

export const Route = createFileRoute("/customer")({
  head: () => ({
    meta: [
      { title: "Individual Customer Wedding Hub — Wedora" },
      { name: "description", content: "Plan your wedding celebration or hire an event organizer on Wedora." },
    ],
  }),
  component: CustomerPortal,
});

// PRD Requirement 9: Timeline tab consolidated into Bookings & Payments Checklist
const nav: NavItem[] = [
  { key: "hub", label: "Planning Hub", icon: Heart },
  { key: "discovery", label: "Vendor Directory", icon: Store },
  { key: "organizers", label: "Event Planners", icon: Briefcase },
  { key: "shortlist", label: "My Shortlist", icon: Bookmark },
  { key: "bookings", label: "My Bookings & Payments", icon: CreditCard },
];

function CustomerPortal() {
  const [tab, setTab] = useState("hub");

  const {
    session,
    activeEvent,
    bookings,
    addEvent,
    loginAsRole,
  } = useDemoSession();

  const handleStartSelfPlan = () => {
    setTab("discovery");
  };

  const handleStartHireOrganizer = () => {
    setTab("organizers");
  };

  const isProvisional =
    activeEvent &&
    (activeEvent.venueStatus === "NOT_FINALIZED" ||
      Boolean(activeEvent.isVenueProvisional) ||
      activeEvent.venueName?.toLowerCase().includes("not finalized"));

  return (
    <DashboardShell
      nav={nav}
      active={tab}
      onChange={setTab}
      role="Individual Customer Portal"
      user={session.name || "Customer User"}
    >
      <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
        {/* If Customer has NO registered event -> Launch Event Onboarding Journey */}
        {!activeEvent ? (
          <CustomerEventOnboarding
            customerName={session.name}
            customerEmail={session.email}
            onEventRegistered={(newEvent) => {
              addEvent(newEvent);
              setTab("hub");
            }}
          />
        ) : (
          <>
            {/* ================= 1. PLANNING HUB ================= */}
            {tab === "hub" && (
              <div className="space-y-8 animate-rise">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <PageTitle
                    title="My Wedding Celebration"
                    subtitle={`${activeEvent.eventName} · ${activeEvent.eventDate} in ${activeEvent.city} (${activeEvent.area || activeEvent.city})`}
                  />

                  {isProvisional && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                      <AlertCircle className="size-3.5 text-amber-600" />
                      Venue Not Finalized: Provisional Mode
                    </span>
                  )}
                </div>

                {/* Quick Metrics */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard
                    label="Wedding Date"
                    value={activeEvent.eventDate}
                    hint={`${activeEvent.city} (${activeEvent.area || activeEvent.city})`}
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

                {/* Mandatory Prominent Choice: Plan My Event Myself vs Hire an Organizer */}
                <section className="rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 shadow-float relative overflow-hidden">
                  <div className="max-w-2xl">
                    <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                      Event Coordination Strategy
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display text-plum font-semibold mt-1">
                      Choose Your Wedding Planning Approach
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                      Wedora lets you choose between coordinating vendors yourself with AI assistance, or handing turnkey execution to a verified professional wedding organizer. Both choices remain accessible throughout your journey.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 mt-6">
                    {/* Option A: Plan My Event Myself */}
                    <div className="flex flex-col rounded-2xl border bg-secondary/50 p-6 transition hover:border-gold hover:shadow-soft">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gold-soft text-gold mb-4">
                        <Store className="size-5" />
                      </div>
                      <h3 className="text-xl font-display text-plum font-semibold">
                        Option A: Plan My Event Myself
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 flex-1 leading-relaxed">
                        Discover and coordinate catering, decoration, lighting, photography, and venues directly using our multilingual AI Voice Assistant.
                      </p>
                      <div className="mt-6 pt-3 border-t">
                        <Button
                          variant="soft"
                          className="w-full text-xs font-semibold"
                          onClick={handleStartSelfPlan}
                        >
                          Open Vendor Discovery Directory <ArrowRight className="size-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Option B: Hire an Organizer */}
                    <div className="flex flex-col rounded-2xl border border-gold/40 bg-gold-soft/30 p-6 transition hover:border-gold hover:shadow-soft ring-1 ring-gold/30">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-plum text-gold mb-4">
                        <Briefcase className="size-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-display text-plum font-semibold">
                          Option B: Hire an Organizer
                        </h3>
                        <span className="text-[10px] bg-gold-soft text-navy px-2 py-0.5 rounded-full font-bold border border-gold/40">
                          Turnkey Accountability
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex-1 leading-relaxed">
                        Browse verified wedding planners and full-service event agencies in your city. Simple browsing experience without voice prompts or filter clutter.
                      </p>
                      <div className="mt-6 pt-3 border-t">
                        <Button
                          variant="hero"
                          className="w-full text-xs font-semibold"
                          onClick={handleStartHireOrganizer}
                        >
                          Browse Event Organizers <ArrowRight className="size-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Confirmed Wedding Contracts Overview */}
                <Panel title="Confirmed Wedding Contracts">
                  {bookings.filter((b) => b.eventId === activeEvent.id).length > 0 ? (
                    <SimpleTable
                      head={[
                        "Vendor Name",
                        "Service Category",
                        "Event Date",
                        "Contract Amount",
                        "Paid to Date",
                        "Status",
                      ]}
                      rows={bookings
                        .filter((b) => b.eventId === activeEvent.id)
                        .map((b) => [
                          <strong key={b.id} className="text-navy">
                            {b.vendorBusinessName}
                          </strong>,
                          b.serviceCategory,
                          b.eventDate,
                          `₹${b.agreedAmount.toLocaleString("en-IN")}`,
                          <span key={b.id} className="text-emerald-700 font-medium">
                            ₹{(b.paidAmount || 0).toLocaleString("en-IN")}
                          </span>,
                          <Status key={b.id} s={b.status} />,
                        ])}
                    />
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        No vendors or organizers contracted yet for this event.
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={handleStartSelfPlan}
                          className="text-xs"
                        >
                          Find Vendors
                        </Button>
                        <Button
                          size="sm"
                          variant="gold"
                          onClick={handleStartHireOrganizer}
                          className="text-xs"
                        >
                          Find Organizers
                        </Button>
                      </div>
                    </div>
                  )}
                </Panel>
              </div>
            )}

            {/* ================= 2. VENDOR DIRECTORY (AI VOICE ASSISTANT) ================= */}
            {tab === "discovery" && (
              <div className="space-y-4 animate-rise">
                <CustomerVendorDirectory
                  activeEvent={activeEvent}
                  onNavigateToOrganizers={() => setTab("organizers")}
                />
              </div>
            )}

            {/* ================= 3. EVENT ORGANIZERS (SIMPLE BROWSING, NO AI, NO FILTERS) ================= */}
            {tab === "organizers" && (
              <div className="space-y-4 animate-rise">
                <EventOrganizerDirectory
                  activeEvent={activeEvent}
                  onNavigateToVendorDirectory={() => setTab("discovery")}
                />
              </div>
            )}

            {/* ================= 4. SHORTLIST & COMMUNICATIONS ================= */}
            {tab === "shortlist" && (
              <CustomerShortlistAndCommunications activeEvent={activeEvent} />
            )}

            {/* ================= 5. BOOKINGS, PAYMENTS & CHECKLIST ================= */}
            {tab === "bookings" && (
              <CustomerBookingsAndChecklist
                activeEvent={activeEvent}
                onNavigateToDiscovery={() => setTab("discovery")}
              />
            )}
          </>
        )}
      </div>
    </DashboardShell>
  );
}
