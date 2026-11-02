import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Search,
  Sparkles,
  Heart,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Star,
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
          "Discover 100+ verified vendors across Mumbai and Pune. Check factual date availability, coordinate bookings, manage simulated payments, and organize every wedding milestone.",
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

const customerStories = [
  {
    customerName: "Rohan Kulkarni & Priya Deshmukh",
    eventType: "Grand Wedding & Reception",
    location: "Baner, Pune",
    rating: 5,
    highlight: "₹25L Budget · 500 Guests",
    quote:
      "Finding caterers and decorators who were actually available on 15 Dec in Baner used to take weeks of phone calls. Wedora verified availability in seconds and the milestone payments kept everything transparent.",
  },
  {
    customerName: "Aditya Merchant & Sanjana Shah",
    eventType: "Sangeet Gala & Seafront Ceremony",
    location: "Bandra, Mumbai",
    rating: 5,
    highlight: "₹48L Budget · 750 Guests",
    quote:
      "Wedora's organizer directory connected us with top-tier planners in Bandra. Managing sound, lighting, and guest accommodation in one unified timeline made our 750-guest celebration completely stress-free.",
  },
  {
    customerName: "Tanvi & Mihir Joshi",
    eventType: "Traditional Vivah & Mandap",
    location: "Kothrud, Pune",
    rating: 5,
    highlight: "₹18L Budget · 350 Guests",
    quote:
      "The AI assistant understood our exact Marathi rituals and recommended Peshwa-themed decorators and candid cinematographers in Kothrud with verified past event proof. Spotless coordination!",
  },
];

const visualJourney = [
  {
    step: "01",
    title: "Create Your Event",
    icon: CalendarCheck,
    text: "Set your date, guest count, city (Mumbai or Pune), and customized budget milestones.",
  },
  {
    step: "02",
    title: "Discover Vendors",
    icon: Search,
    text: "Explore verified caterers, decorators, venues, and photographers with live calendar availability.",
  },
  {
    step: "03",
    title: "Shortlist & Book",
    icon: CreditCard,
    text: "Compare provisional quotations, communicate directly, and confirm contracts with milestone advances.",
  },
  {
    step: "04",
    title: "Celebrate",
    icon: Heart,
    text: "Follow your live event day timeline, coordinate vendors seamlessly, and celebrate without surprises.",
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
        <div className="flex items-center gap-4">
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex items-center">
            <a href="#features" className="hover:text-plum transition">Features</a>
            <a href="#how" className="hover:text-plum transition">How it works</a>
            <a href="#journey" className="hover:text-plum transition">Planning Journey</a>
            <a href="#stories" className="hover:text-plum transition">Customer Stories</a>
          </nav>
          {/* City Selector in Landing Header */}
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft/70 px-3.5 py-1 text-xs font-semibold text-navy hover:bg-gold-soft transition"
            aria-label="Select City"
          >
            <MapPin className="size-3.5 text-gold shrink-0" />
            <span>{city}</span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>
        </div>
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
            Discover verified vendors across Mumbai and Pune. Check factual date availability, compare performance proof, and coordinate every wedding milestone seamlessly.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild variant="hero" size="xl">
              <Link to="/get-started" search={{ role: "CUSTOMER" }}>
                <span>Plan an Event</span>
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>

            <Button asChild variant="soft" size="xl" className="border border-gold/40 hover:bg-gold-soft text-plum font-semibold">
              <Link to="/professionals">
                <span>Join as a Professional</span>
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex gap-10 text-sm">
            {[
              ["200+", "Verified Profiles"],
              ["2 Cities", "Mumbai & Pune"],
              ["13 Categories", "Catering to Venues"],
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

      {/* Customer Stories & Reviews */}
      <section id="stories" className="bg-gradient-plum py-24 text-primary-foreground relative">
        <div className="relative mx-auto max-w-7xl px-6">
          <Mandala className="absolute -right-24 -top-24 size-80 text-gold/20 pointer-events-none" />
          <p className="text-center text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            Customer Stories & Reviews
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-4xl md:text-5xl font-display font-semibold">
            Real Couples. Flawless Celebrations.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-primary-foreground/80">
            See how couples in Mumbai and Pune planned with live calendar verification, honest reviews, and simulated milestone advances.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {customerStories.map((s, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-card p-6 text-card-foreground shadow-float border border-gold/40 flex flex-col justify-between hover:-translate-y-1 transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                      Verified Customer Story (Demo Experience)
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(s.rating)].map((_, i) => (
                        <Star key={i} className="size-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                    "{s.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="font-display font-bold text-plum text-base">
                    {s.customerName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="size-3 text-gold shrink-0" />
                    <span>{s.eventType} · {s.location}</span>
                  </div>
                  <div className="mt-2 text-[11px] font-semibold text-navy bg-gold-soft/60 px-2 py-0.5 rounded inline-block">
                    {s.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/get-started" search={{ role: "CUSTOMER" }}>
                <span>Plan an Event</span>
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="gold-rule mx-auto mb-10 max-w-md" />
        <h2 className="text-center text-4xl text-plum font-display font-semibold">Everything a wedding needs to run</h2>
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
          <h2 className="mt-3 text-4xl text-plum font-display font-semibold">From first idea to final vidaai</h2>
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

      {/* Planning Journey (Replaces Mandap section) */}
      <section id="journey" className="bg-secondary/70 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-gold font-semibold">
            Visual Planning Journey
          </p>
          <h2 className="mt-3 text-center text-4xl text-plum font-display font-semibold">
            From Your First Idea to Your Perfect Event
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            A clear four-stage visual workflow designed to eliminate planning stress, duplicate bookings, and hidden fees.
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visualJourney.map((j) => (
              <div
                key={j.step}
                className="arch border bg-card px-6 pb-8 pt-12 text-center shadow-soft hover:shadow-float hover:border-gold/50 transition duration-200 relative group"
              >
                <div className="absolute top-4 right-5 text-xs font-mono font-bold text-gold/60">
                  {j.step}
                </div>
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold group-hover:scale-110 transition duration-200">
                  <j.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-display text-plum font-semibold">{j.title}</h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{j.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/get-started" search={{ role: "CUSTOMER" }}>
                <span>Plan an Event</span>
                <ArrowRight className="size-4 ml-1" />
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
