import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarHeart,
  Heart,
  Store,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, Mandala } from "@/components/brand";
import { useDemoSession, UserRole } from "@/hooks/useDemoSession";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Choose Your Role & Sign In — Wedora" },
      {
        name: "description",
        content:
          "Onboard as a Wedding Vendor, Professional Event Planner, or Individual Customer on Wedora.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    role: (search.role as UserRole) || undefined,
  }),
  component: GetStarted,
});

type OnboardingStep = "root" | "planning" | "auth_form";

function GetStarted() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { loginAsRole } = useDemoSession();

  const initialRole: UserRole = search.role || "PLANNER";
  const [step, setStep] = useState<OnboardingStep>(search.role ? "auth_form" : "root");
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form fields
  const [fullName, setFullName] = useState(() => {
    if (initialRole === "CUSTOMER") return "Rohil Kulkarni (Groom)";
    if (initialRole === "VENDOR") return "Royal Feast Catering & Hospitality";
    return "Aditi Sharma (Lead Planner)";
  });
  const [email, setEmail] = useState(() => {
    if (initialRole === "CUSTOMER") return "rohil@kulkarni.com";
    if (initialRole === "VENDOR") return "vendor1@royalfeast.com";
    return "planner@weddingorchestrator.com";
  });
  const [password, setPassword] = useState("Demo@12345");
  const [confirmPassword, setConfirmPassword] = useState("Demo@12345");

  const handleSelectPlanningRole = (role: "PLANNER" | "CUSTOMER") => {
    setSelectedRole(role);
    if (role === "PLANNER") {
      setEmail("planner@weddingorchestrator.com");
      setFullName("Aditi Sharma (Lead Planner)");
    } else {
      setEmail("rohil@kulkarni.com");
      setFullName("Rohil Kulkarni (Groom)");
    }
    setPassword("Demo@12345");
    setConfirmPassword("Demo@12345");
    setStep("auth_form");
  };

  const handleSelectVendor = () => {
    setSelectedRole("VENDOR");
    setEmail("vendor1@royalfeast.com");
    setFullName("Royal Feast Catering & Hospitality");
    setPassword("Demo@12345");
    setConfirmPassword("Demo@12345");
    setStep("auth_form");
  };

  const handleContinueWithDemo = (role: UserRole, customOption?: any) => {
    loginAsRole(role, customOption);
    if (role === "VENDOR") {
      navigate({ to: "/vendor" });
    } else if (role === "PLANNER") {
      navigate({ to: "/planner" });
    } else {
      navigate({ to: "/customer" });
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "CUSTOMER") {
      if (email.toLowerCase().includes("aniket")) {
        loginAsRole("CUSTOMER", "aniket");
      } else if (email.toLowerCase().includes("rohil") || email.toLowerCase().includes("rohan") || email.toLowerCase().includes("customer@weddingorchestrator")) {
        loginAsRole("CUSTOMER", "rohil");
      } else {
        loginAsRole("CUSTOMER", {
          name: fullName.trim() || email.split("@")[0],
          email: email.trim(),
        });
      }
      navigate({ to: "/customer" });
      return;
    }

    loginAsRole(selectedRole);
    if (selectedRole === "VENDOR") {
      navigate({ to: "/vendor" });
    } else if (selectedRole === "PLANNER") {
      navigate({ to: "/planner" });
    } else {
      navigate({ to: "/customer" });
    }
  };

  const getRoleTitle = () => {
    if (selectedRole === "VENDOR") return "Vendor Portal Access";
    if (selectedRole === "PLANNER") return "Professional Event Planner Access";
    return "Individual Customer Access";
  };

  const getRoleSubtitle = () => {
    if (selectedRole === "VENDOR")
      return "List services, manage real-time date availability, and send quotations.";
    if (selectedRole === "PLANNER")
      return "Coordinate multi-client weddings, manage budgets, and discover vendors.";
    return "Plan your own personal wedding celebration or hire an event organizer.";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Mandala className="absolute -right-40 -top-40 size-[32rem] text-plum/10 pointer-events-none" />
      <Mandala className="absolute -left-40 -bottom-40 size-[30rem] text-gold/10 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Logo />
        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-plum flex items-center gap-1"
        >
          <ArrowLeft className="size-3.5" /> Back to Home
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-8 text-center">
        {step === "root" && (
          <div className="animate-rise space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                Wedora Onboarding
              </p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-display text-plum font-semibold">
                How would you like to use the platform?
              </h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Select your persona to access specialized dashboards, tools, and vendor catalogs.
              </p>
            </div>
            <div className="gold-rule mx-auto max-w-xs" />

            <div className="grid gap-6 md:grid-cols-2 text-left">
              {/* Option 1: Vendor */}
              <div
                onClick={handleSelectVendor}
                className="group flex flex-col arch border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-gold cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold mb-5">
                  <Store className="size-6" />
                </div>
                <h2 className="text-2xl font-display text-plum font-semibold">
                  I am a Vendor
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  List services, manage real-time availability calendar, answer customer inquiries, and track bookings across Mumbai and Pune.
                </p>
                <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold text-plum group-hover:text-gold transition">
                  <span>Continue as Vendor</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>

              {/* Option 2: Planning an Event */}
              <div
                onClick={() => setStep("planning")}
                className="group flex flex-col arch border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-gold cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold mb-5">
                  <CalendarHeart className="size-6" />
                </div>
                <h2 className="text-2xl font-display text-plum font-semibold">
                  I am Planning an Event
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Discover verified vendors with AI, check factual date availability, request quotations, and orchestrate wedding timelines.
                </p>
                <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold text-plum group-hover:text-gold transition">
                  <span>Choose Planner / Customer</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "planning" && (
          <div className="animate-rise space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold">
                Event Planning Role
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-display text-plum font-semibold">
                Who is coordinating the event?
              </h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Are you an agency managing multiple clients, or planning a personal wedding celebration?
              </p>
            </div>
            <div className="gold-rule mx-auto max-w-xs" />

            <div className="grid gap-6 md:grid-cols-2 text-left">
              {/* Option A: Professional Event Planner */}
              <div
                onClick={() => handleSelectPlanningRole("PLANNER")}
                className="group flex flex-col arch border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-gold cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold mb-5">
                  <Briefcase className="size-6" />
                </div>
                <h2 className="text-2xl font-display text-plum font-semibold">
                  Professional Event Planner
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Agency workspace to manage multiple client weddings, switch event contexts, orchestrate vendor contracts, and track simulated ledger advances.
                </p>
                <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold text-plum group-hover:text-gold transition">
                  <span>Enter as Planner</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>

              {/* Option B: Individual Customer */}
              <div
                onClick={() => handleSelectPlanningRole("CUSTOMER")}
                className="group flex flex-col arch border bg-card p-8 shadow-soft transition hover:-translate-y-1 hover:border-gold cursor-pointer"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-gradient-plum text-gold mb-5">
                  <Heart className="size-6" />
                </div>
                <h2 className="text-2xl font-display text-plum font-semibold">
                  Individual Customer
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Personal wedding planning hub. Choose between self-coordination or hiring a professional wedding organizer to manage everything end-to-end.
                </p>
                <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-semibold text-plum group-hover:text-gold transition">
                  <span>Enter as Customer</span>
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("root")}
                className="text-muted-foreground hover:text-navy"
              >
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
            </div>
          </div>
        )}

        {step === "auth_form" && (
          <div className="animate-rise max-w-md mx-auto text-left rounded-3xl border bg-card p-6 sm:p-8 shadow-float">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-wider text-gold font-semibold">
                {selectedRole} Access
              </span>
              <h2 className="text-2xl font-display text-plum font-semibold mt-1">
                {getRoleTitle()}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {getRoleSubtitle()}
              </p>
            </div>

            {/* Quick Demo Login Hero Section (Independent Customer Profiles) */}
            <div className="mb-6 rounded-2xl bg-gold-soft border border-gold/40 p-4 text-center space-y-2.5">
              <div className="text-xs text-navy font-semibold flex items-center justify-center gap-1.5">
                <Sparkles className="size-4 text-gold" />
                {selectedRole === "CUSTOMER" ? "Choose Customer Profile" : "Instant Demo Access"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                {selectedRole === "CUSTOMER"
                  ? "Test Rohil's preserved wedding event or experience Aniket's fresh onboarding journey."
                  : "One-click instant access pre-loaded with demonstration data and permissions."}
              </p>

              {selectedRole === "CUSTOMER" ? (
                <div className="space-y-2 pt-1">
                  <Button
                    variant="hero"
                    className="w-full text-xs font-semibold py-2.5"
                    onClick={() => handleContinueWithDemo("CUSTOMER", "rohil")}
                  >
                    Profile A: Rohil Kulkarni (Preserved Event)
                  </Button>
                  <Button
                    variant="soft"
                    className="w-full text-xs font-semibold py-2.5 border border-gold/50 hover:bg-gold-soft"
                    onClick={() => handleContinueWithDemo("CUSTOMER", "aniket")}
                  >
                    Profile B: Aniket Tribhavan (Fresh Blank Profile)
                  </Button>
                </div>
              ) : (
                <Button
                  variant="hero"
                  className="w-full text-xs font-medium py-2.5"
                  onClick={() => handleContinueWithDemo(selectedRole)}
                >
                  Continue with Demo Account ({selectedRole})
                </Button>
              )}
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground text-[10px]">
                  Or Sign in / Register with Credentials
                </span>
              </div>
            </div>

            {/* Login / Register Toggle Tabs */}
            <div className="flex rounded-xl bg-secondary p-1 mb-5 text-xs">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  authMode === "login"
                    ? "bg-card text-plum font-semibold shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 py-1.5 rounded-lg font-medium transition ${
                  authMode === "register"
                    ? "bg-card text-plum font-semibold shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Credential Form */}
            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
              {authMode === "register" && (
                <div>
                  <label className="block text-navy font-medium mb-1">Full Name:</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>
              )}

              <div>
                <label className="block text-navy font-medium mb-1">Email Address:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-navy font-medium">Password:</label>
                  {authMode === "login" && (
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Demo password reset simulated. Use demo login or any mock password.");
                      }}
                      className="text-[11px] text-plum hover:underline"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
                />
              </div>

              {authMode === "register" && (
                <div>
                  <label className="block text-navy font-medium mb-1">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold"
                  />
                </div>
              )}

              <Button type="submit" variant="hero" className="w-full text-xs py-2.5 mt-2">
                {authMode === "login" ? "Sign In to Dashboard" : "Create Account & Enter"}
              </Button>
            </form>

            <div className="mt-5 pt-3 border-t text-center">
              <button
                type="button"
                onClick={() => setStep("root")}
                className="text-xs text-muted-foreground hover:text-navy inline-flex items-center gap-1"
              >
                <ArrowLeft className="size-3.5" /> Change Persona
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
