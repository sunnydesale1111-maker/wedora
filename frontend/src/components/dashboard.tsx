import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, MapPin, ChevronDown, type LucideIcon } from "lucide-react";
import { Mandala } from "@/components/brand";
import { cn } from "@/lib/utils";
import { CitySelectorModal } from "@/components/layout/CitySelectorModal";
import { useDemoSession } from "@/hooks/useDemoSession";

export type NavItem = { key: string; label: string; icon: LucideIcon };

export function DashboardShell({
  nav,
  active,
  onChange,
  role,
  user,
  userControl,
  children,
}: {
  nav: NavItem[];
  active: string;
  onChange: (k: string) => void;
  role: string;
  user: string;
  userControl?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const { city, changeCity, logout, session } = useDemoSession();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden bg-gradient-plum text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Mandala className="absolute -bottom-24 -left-24 size-72 text-gold/15" />
        <Link to="/" className="flex items-center gap-2 px-6 py-6">
          <Mandala className="size-8 text-gold" />
          <span className="font-display text-2xl text-primary-foreground">Wedora</span>
        </Link>
        <div className="px-6 pb-3 text-[11px] uppercase tracking-[0.25em] text-gold">
          {role}
        </div>
        <nav className="relative flex-1 space-y-1 px-3">
          {nav.map((n) => (
            <button
              key={n.key}
              onClick={() => {
                onChange(n.key);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active === n.key
                  ? "bg-sidebar-primary font-medium text-sidebar-primary-foreground shadow-sm"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <n.icon className="size-4" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="relative m-3 space-y-1">
          {session.id && !session.isDemo ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                window.location.href = "/get-started";
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-rose-200 hover:bg-rose-950/40 hover:text-rose-100 transition cursor-pointer"
            >
              <LogOut className="size-4 text-rose-400" /> Sign Out
            </button>
          ) : (
            <Link
              to="/get-started"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent transition"
            >
              <LogOut className="size-4 text-gold" /> Switch role / Demo login
            </Link>
          )}
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-background/90 px-6 py-3.5 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg border hover:bg-secondary"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs text-muted-foreground">
              <Search className="size-3.5" /> Search events, 100 demo vendors, bookings…
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* PRD Section 4: Display current city in header with quick changer */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1.5 text-xs font-medium text-navy hover:bg-gold-soft transition"
              title="Click to change city"
            >
              <MapPin className="size-3.5 text-gold shrink-0" />
              <span suppressHydrationWarning>{city}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            <button
              aria-label="Notifications"
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground relative"
            >
              <Bell className="size-4" />
              <span className="size-2 rounded-full bg-gold absolute top-1 right-1"></span>
            </button>

            {userControl ? (
              userControl
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l">
                <div className="flex size-8 items-center justify-center rounded-full bg-gold-soft font-display text-plum font-semibold text-sm">
                  {user ? user[0] : "U"}
                </div>
                <span className="hidden text-xs font-medium text-navy md:block">
                  {user}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">{children}</main>
      </div>

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

export function PageTitle({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-display text-plum font-semibold">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-gold-soft text-gold">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 font-display text-2xl sm:text-3xl text-navy font-semibold">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-success font-medium">{hint}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5 sm:p-6 shadow-soft", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-display text-plum font-semibold">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const tones: Record<string, string> = {
  Available: "bg-success-soft text-success",
  Confirmed: "bg-success-soft text-success",
  Paid: "bg-success-soft text-success",
  Completed: "bg-success-soft text-success",
  Sent: "bg-success-soft text-success",
  Tentative: "bg-warning-soft text-warning",
  Pending: "bg-warning-soft text-warning",
  New: "bg-plum-soft text-plum",
  Quoted: "bg-gold-soft text-navy",
  Due: "bg-warning-soft text-warning",
  "Fully Booked": "bg-danger-soft text-destructive",
  Overdue: "bg-danger-soft text-destructive",
  Declined: "bg-danger-soft text-destructive",
  Unavailable: "bg-muted text-muted-foreground",
  "Not Updated": "bg-secondary text-muted-foreground",
  Unverified: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
  "Unverified Availability": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
};

export function Status({ s }: { s: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        tones[s] ?? "bg-muted text-muted-foreground"
      )}
    >
      {s}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-gradient-gold"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function SimpleTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="border-b text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-3 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-secondary/60 transition">
              {r.map((c, j) => (
                <td key={j} className="whitespace-nowrap px-3 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
