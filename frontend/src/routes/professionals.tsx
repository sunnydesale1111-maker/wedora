import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Store,
  Users,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Mandala } from "@/components/brand";

export const Route = createFileRoute("/professionals")({
  head: () => ({
    meta: [
      { title: "Join as a Professional — Wedora" },
      {
        name: "description",
        content:
          "Join Wedora as a Wedding Vendor or Professional Event Organizer in Mumbai & Pune.",
      },
    ],
  }),
  component: ProfessionalSelectionPage,
});

function ProfessionalSelectionPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden flex flex-col justify-between">
      {/* Background Decorative Mandala */}
      <Mandala className="absolute -top-32 -right-32 size-96 text-plum/10 pointer-events-none" />
      <Mandala className="absolute -bottom-32 -left-32 size-96 text-gold/10 pointer-events-none" />

      {/* Header Navigation */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 border-b border-border/40">
        <Logo />
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-plum transition"
        >
          <ArrowLeft className="size-4 text-gold" />
          <span>Back to Homepage</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto animate-rise">
          <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gold font-semibold bg-gold-soft/60 px-3.5 py-1 rounded-full border border-gold/40">
            <Sparkles className="size-3.5 text-gold" />
            <span>Professional Network · Mumbai & Pune</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-plum leading-tight">
            Join Wedora as a Professional
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Choose your professional category below to access your dedicated business portal, manage availability, and coordinate luxury celebrations.
          </p>
        </div>

        {/* Dual Selection Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Option 1: I'm a Vendor */}
          <div className="arch border bg-card p-8 sm:p-10 shadow-soft hover:shadow-float hover:border-gold transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-16 items-center justify-center arch bg-gradient-plum text-gold group-hover:scale-105 transition-transform duration-300 shadow-soft">
                  <Store className="size-8" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-3 py-1 rounded-full">
                  Services & Venues
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-display font-bold text-plum group-hover:text-gold transition-colors">
                I'm a Vendor
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                List catering, decor, photography, banquet halls, or entertainment services. Manage real-time date availability and answer quotation inquiries.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-border/60 text-xs text-navy">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Real-time availability calendar management</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Direct quotation requests from couples & planners</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Transparent milestone payments & contract ledger</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild variant="hero" size="xl" className="w-full">
                <Link to="/get-started" search={{ role: "VENDOR" }}>
                  <span>Continue as a Vendor</span>
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Option 2: I'm an Event Organizer */}
          <div className="arch border bg-card p-8 sm:p-10 shadow-soft hover:shadow-float hover:border-gold transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-16 items-center justify-center arch bg-gradient-plum text-gold group-hover:scale-105 transition-transform duration-300 shadow-soft">
                  <Users className="size-8" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-3 py-1 rounded-full">
                  Event Planners
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-display font-bold text-plum group-hover:text-gold transition-colors">
                I'm an Event Organizer
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Coordinate client weddings, discover verified vendors with guaranteed availability across Pune & Mumbai, and manage complete event timelines.
              </p>

              <div className="mt-6 space-y-2.5 pt-6 border-t border-border/60 text-xs text-navy">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Multi-client event dashboard & context switcher</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>Verified vendor directory with collaboration proof</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>AI Voice Assistant for quick vendor discovery</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60">
              <Button asChild variant="hero" size="xl" className="w-full">
                <Link to="/get-started" search={{ role: "PLANNER" }}>
                  <span>Continue as an Event Organizer</span>
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 Wedora. The Operating Platform for Wedding Professionals across Mumbai and Pune.</p>
      </footer>
    </div>
  );
}

