import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Search,
  Sparkles,
  Store,
  Users,
  Heart,
  CheckCircle2,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Mandala } from "@/components/brand";
import { CitySelectorModal } from "@/components/layout/CitySelectorModal";
import { useDemoSession } from "@/hooks/useDemoSession";
import hero from "@/assets/hero-couple.jpg";
import venue from "@/assets/venue.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wedora — AI Wedding Timeline Orchestrator (Mumbai & Pune)" },
      {
        name: "description",
        content:
          "Discover 100 verified vendors across Mumbai and Pune. Check factual date availability, coordinate bookings, manage simulated payments, and organize every wedding milestone.",
      },
      {
        property: "og:title",
        content: "Wedora — AI Wedding Timeline Orchestrator (Mumbai & Pune)",
      },
      {
        property: "og:description",
        content:
          "The B2B2C operating platform for vendors, professional event planners, and couples.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Search,
    title: "AI Vendor Discovery",
    text: "Discover matching caterers, decorators, planners, and venues in Mumbai & Pune with real-time calendar verification.",
  },
  {
    icon: CalendarCheck,
    title: "Live Date Availability",
    text: "Vendors update their date availability directly. No more chasing confirmations or double-booked surprises.",
  },
  {
    icon: CreditCard,
    title: "Inquiries & Bookings",
    text: "Quotations, booking confirmations, and simulated milestone advances tracked in a transparent audit ledger.",
  },
  {
    icon: Sparkles,
    title: "Event Timeline",
    text: "From roka to reception, keep tasks, vendor deadlines, and event milestones organized in one place.",
  },
];

const steps = [
  { n: "01", title: "Tell us your event", text: "Date, city (Mumbai or Pune), guest count, and required services." },
  { n: "02", title: "Discover & compare", text: "Matched vendors with verified 90-day transactions and factual availability." },
  { n: "03", title: "Book & coordinate", text: "Accept quotations, record milestone advances, and track your timeline." },
];

const roles = [
  {
    icon: Store,
    title: "Vendors",
    text: "List services, manage your availability calendar, answer quotation inquiries, and track bookings.",
  },
  {
    icon: Users,
    title: "Professional Planners",
    text: "Manage multiple client weddings, switch event contexts, and coordinate all vendor contracts.",
  },
  {
    icon: Heart,
    title: "Individual Customers",
    text: "Choose between planning your celebration yourself or hiring a professional event organizer.",
  },
];

const availabilityPreview = [
  {
    name: "Royal Feast Catering & Hospitality",
    cat: "Catering · Pune (Baner)",
    status: "Available",
    tone: "bg-success-soft text-success",
  },
  {
    name: "Elegance Floral & Mandap Decor",
    cat: "Decoration · Pune (Wakad)",
    status: "Available",
    tone: "bg-success-soft text-success",
  },
  {
    name: "Symphony Signature Weddings",
    cat: "Event Organizers · Mumbai (Bandra)",
    status: "Available",
    tone: "bg-success-soft text-success",
  },
  {
    name: "The Grand Marine Pavilion",
    cat: "Accommodation · Mumbai (Lower Parel)",
    status: "Available",
    tone: "bg-success-soft text-success",
  },
];

function Landing() {
  const { city, changeCity } = useDemoSession();
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  return (
    <div className="overflow-x-hidden bg-background">
      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex items-center">
          <a href="#features" className="hover:text-plum transition">Features</a>
          <a href="#how" className="hover:text-plum transition">How it works</a>
          <a href="#roles" className="hover:text-plum transition">Who it's for</a>
          {/* City Selector in Landing Header */}
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft/70 px-3.5 py-1 text-xs font-semibold text-navy hover:bg-gold-soft transition"
          >
            <MapPin className="size-3.5 text-gold shrink-0" />
            <span>{city}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </nav>
        <Button asChild variant="hero">
          <Link to="/get-started">Get Started</Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-6 lg:grid-cols-[1.1fr_1fr]">
        <Mandala className="absolute -left-40 top-0 size-96 text-plum/10 pointer-events-none" />
        <div className="relative animate-rise">
          <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            <span className="h-px w-10 bg-gold" /> AI Wedding Planning Platform · Mumbai & Pune
          </div>
          <h1 className="text-5xl leading-[1.05] text-plum md:text-7xl font-display font-semibold">
            Your Entire Wedding.<br />
            <em className="text-navy font-normal">One Intelligent</em> Platform.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
            Discover 100 verified vendors in Mumbai and Pune. Check factual date availability, compare 90-day transaction proof, and coordinate every wedding milestone seamlessly.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/get-started">
                Get Started <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="soft" size="xl">
              <a href="#preview">Explore Vendor Discovery</a>
            </Button>
          </div>
          <div className="mt-10 flex gap-10 text-sm">
            {[
              ["100", "Fictional Vendors"],
              ["2 Cities", "Mumbai & Pune"],
              ["12 Categories", "Catering to Planners"],
            ].map(([a, b]) => (
              <div key={b}>
                <div className="font-display text-2xl font-bold text-plum">{a}</div>
                <div className="text-xs text-muted-foreground">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-rise [animation-delay:150ms]">
          <div className="absolute -inset-4 arch border border-gold/60 pointer-events-none" />
          <img
            src={hero}
            alt="Bride and groom celebrating their wedding"
            width={832}
            height={1152}
            className="relative aspect-[3/4] w-full arch object-cover shadow-float"
          />
          <div className="absolute -left-8 bottom-14 w-64 rounded-2xl bg-card p-4 shadow-float border border-gold/30">
            <div className="text-[11px] text-muted-foreground">Mandatory Test Event · 15 Dec 2026</div>
            <div className="mt-1 font-semibold text-navy text-sm">Pune (Baner/Wakad)</div>
            <div className="mt-2 text-xs text-success font-medium flex items-center gap-1.5">
              <CheckCircle2 className="size-4" /> 2 Caterers verified available
            </div>
          </div>
          <div className="absolute -right-6 top-14 flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-semibold text-navy shadow-soft border border-gold/30">
            <CheckCircle2 className="size-4 text-success" /> Decorator available
          </div>
        </div>
      </section>

      {/* AI Discovery preview */}
      <section id="preview" className="bg-gradient-plum py-24 text-primary-foreground relative">
        <div className="relative mx-auto max-w-7xl px-6">
          <Mandala className="absolute -right-24 -top-24 size-80 text-gold/20 pointer-events-none" />
          <p className="text-center text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            AI Vendor Discovery — Demo Mode
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl md:text-5xl font-display">
            Ask once. See who's truly available.
          </h2>
          <div className="relative mx-auto mt-14 max-w-5xl rounded-3xl bg-card p-6 text-card-foreground shadow-float border border-gold/40">
            <div className="flex items-center gap-3 rounded-full border bg-background px-5 py-3 text-sm">
              <Sparkles className="size-4 text-gold shrink-0" />
              <span className="text-muted-foreground text-xs sm:text-sm">
                "Find caterers in Pune for 500 guests on 15 Dec around Baner and Wakad"
              </span>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {availabilityPreview.map((v) => (
                <div key={v.name} className="flex items-center justify-between rounded-2xl border p-4 bg-secondary/40">
                  <div>
                    <div className="font-semibold text-navy text-sm">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.cat}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${v.tone}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t text-center">
              <Button asChild variant="hero">
                <Link to="/get-started">
                  Launch Interactive Discovery <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="gold-rule mx-auto mb-10 max-w-md" />
        <h2 className="text-center text-4xl text-plum font-display">Everything a wedding needs to run</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border bg-card p-7 shadow-soft transition hover:-translate-y-1">
              <div className="flex size-12 items-center justify-center rounded-full bg-gold-soft text-gold">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-display text-plum font-semibold">{f.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 lg:grid-cols-2">
        <img
          src={venue}
          alt="Decorated wedding venue at night"
          loading="lazy"
          width={1280}
          height={832}
          className="aspect-[4/3] w-full rounded-t-[12rem] rounded-b-3xl object-cover shadow-float"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">How it works</p>
          <h2 className="mt-3 text-4xl text-plum font-display">From first idea to final vidaai</h2>
          <div className="mt-10 space-y-8">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-6">
                <div className="font-display text-3xl font-bold text-gold">{s.n}</div>
                <div>
                  <h3 className="text-lg font-display text-navy font-semibold">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-secondary/70 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl text-plum font-display">Built for everyone at the mandap</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {roles.map((r) => (
              <div key={r.title} className="arch border bg-card px-8 pb-10 pt-16 text-center shadow-soft">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold">
                  <r.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-2xl font-display text-plum font-semibold">{r.title}</h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/get-started">
                Choose your role <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-plum py-14 text-sidebar-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row text-xs">
          <Logo light />
          <p className="text-muted-foreground text-center">
            © 2026 Wedora. AI Wedding Timeline Orchestrator — Coordinating the Entire Planning Journey across Mumbai and Pune.
          </p>
        </div>
      </footer>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCity={city}
        onSelectCity={(newCity) => changeCity(newCity)}
      />
    </div>
  );
}
