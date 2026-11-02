import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mandala } from "@/components/brand";
import heroCoupleImg from "@/assets/hero-couple.jpg";

/**
 * WeddingHero
 *
 * The original wedding-specific hero section of the Wedora homepage.
 * Preserved intact to enable seamless instant rollback whenever
 * ENABLE_EVENT_HERO_CAROUSEL is set to false.
 */
export function WeddingHero() {
  return (
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

        {/* Fixed Platform Statistics */}
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
          src={heroCoupleImg}
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
  );
}

