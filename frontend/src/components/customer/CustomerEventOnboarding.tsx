import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeddingEvent } from '@/types/event';
import { ALL_LOCALITIES } from '@/utils/localityRegistry';

interface CustomerEventOnboardingProps {
  customerName: string;
  customerEmail: string;
  onEventRegistered: (event: Omit<WeddingEvent, 'id' | 'createdAt'>) => void;
}

export const CustomerEventOnboarding: React.FC<CustomerEventOnboardingProps> = ({
  customerName,
  customerEmail,
  onEventRegistered,
}) => {
  // Step 1: Form, Step 2: Confirmation Summary
  const [step, setStep] = useState<'FORM' | 'CONFIRM'>('FORM');

  // Form fields - all blank by default, never prepopulated
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Traditional Hindu Wedding & Reception');
  const [eventDate, setEventDate] = useState('');
  const [city, setCity] = useState<'Pune' | 'Mumbai'>('Pune');
  const [area, setArea] = useState('Baner');
  const [isVenueNotFinalized, setIsVenueNotFinalized] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [guestCount, setGuestCount] = useState<number | ''>('');
  const [estimatedBudget, setEstimatedBudget] = useState<number | ''>('');

  const handleNextToConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate.trim() || !guestCount || !estimatedBudget) {
      alert('Please fill in all mandatory event details.');
      return;
    }
    if (!isVenueNotFinalized && !venueName.trim()) {
      alert('Please specify the venue name or check "Venue Not Finalized".');
      return;
    }
    setStep('CONFIRM');
  };

  const handleFinalConfirm = () => {
    const finalVenueName = isVenueNotFinalized
      ? 'Venue Not Finalized'
      : venueName.trim();
    const finalVenueAddress = isVenueNotFinalized
      ? `Provisional in ${area}, ${city}`
      : venueAddress.trim() || `${venueName.trim()}, ${area}, ${city}`;

    const newEvent: Omit<WeddingEvent, 'id' | 'createdAt'> = {
      eventName: eventName.trim(),
      eventType,
      eventDate,
      city,
      area,
      venueName: finalVenueName,
      venueAddress: finalVenueAddress,
      venueStatus: isVenueNotFinalized ? 'NOT_FINALIZED' : 'FINALIZED',
      isVenueProvisional: isVenueNotFinalized,
      clientName: customerName,
      clientEmail: customerEmail,
      guestCount: Number(guestCount),
      estimatedBudget: Number(estimatedBudget),
      ownerRole: 'CUSTOMER',
      ownerName: customerName,
      description: `Personal wedding celebration for ${customerName} in ${area}, ${city}.`,
    };

    onEventRegistered(newEvent);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-rise space-y-6">
      {/* Onboarding Welcome Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-soft border border-gold/40 text-xs font-semibold text-navy">
          <Heart className="size-3.5 text-gold fill-gold" />
          Welcome, {customerName}!
        </div>
        <h1 className="text-2xl sm:text-4xl font-display text-plum font-bold">
          Register Your Wedding Celebration
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Start your personalized wedding journey. Provide your celebration parameters to unlock tailored vendor discovery and planning choices.
        </p>
      </div>

      {step === 'FORM' && (
        <form
          onSubmit={handleNextToConfirmation}
          className="rounded-3xl border border-gold/30 bg-card p-6 sm:p-8 shadow-float space-y-5 text-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-display font-semibold text-base text-plum flex items-center gap-2">
              <Sparkles className="size-4 text-gold" /> Event Parameters
            </h3>
            <span className="text-[11px] text-muted-foreground">
              All fields are required to personalize your hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Name */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-navy mb-1.5">
                Celebration Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Aniket & Sneha's Dream Wedding"
                className="w-full rounded-xl border bg-background px-3.5 py-2.5 outline-none focus:border-gold shadow-2xs text-xs sm:text-sm"
              />
            </div>

            {/* Event Type / Function */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Event Function / Ceremony <span className="text-rose-500">*</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-gold shadow-2xs cursor-pointer"
              >
                <option value="Traditional Hindu Wedding & Reception">Traditional Hindu Wedding & Reception</option>
                <option value="Grand Sangeet & Royal Wedding">Grand Sangeet & Royal Wedding</option>
                <option value="Hillside Destination Wedding">Hillside Destination Wedding</option>
                <option value="Intimate Wedding Ceremony">Intimate Wedding Ceremony</option>
                <option value="Sangeet & Cocktail Gala">Sangeet & Cocktail Gala</option>
              </select>
            </div>

            {/* Event Date */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Celebration Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 outline-none focus:border-gold shadow-2xs"
                />
              </div>
            </div>

            {/* Destination City */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Destination City <span className="text-rose-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => {
                  const newCity = e.target.value as 'Pune' | 'Mumbai';
                  setCity(newCity);
                  const defLoc = ALL_LOCALITIES.find((l) => l.city === newCity);
                  if (defLoc) setArea(defLoc.canonicalName);
                }}
                className="w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-gold shadow-2xs cursor-pointer"
              >
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            {/* Locality / Area */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Target Locality <span className="text-rose-500">*</span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2.5 outline-none focus:border-gold shadow-2xs cursor-pointer"
              >
                {ALL_LOCALITIES.filter((l) => l.city === city).map((l) => (
                  <option key={l.canonicalName} value={l.canonicalName}>
                    {l.canonicalName} ({l.devanagari})
                  </option>
                ))}
              </select>
            </div>

            {/* Venue Option: Venue Not Finalized Toggle */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-navy">
                <input
                  type="checkbox"
                  checked={isVenueNotFinalized}
                  onChange={(e) => {
                    setIsVenueNotFinalized(e.target.checked);
                    if (e.target.checked) {
                      setVenueName('');
                      setVenueAddress('');
                    }
                  }}
                  className="size-4 rounded text-gold focus:ring-gold"
                />
                <span>Venue Not Finalized Yet</span>
              </label>
              {isVenueNotFinalized ? (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <AlertCircle className="size-3.5 inline mr-1 text-amber-600" />
                  No problem! You can select a banquet hall or lawn later. Vendor recommendations in {area}, {city} will be marked as provisional until you lock a venue.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-semibold text-navy mb-1">
                      Venue / Lawn Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={!isVenueNotFinalized}
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Royal Orchid Lawn & Banquets"
                      className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-navy mb-1">
                      Complete Venue Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={!isVenueNotFinalized}
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="e.g. Survey 42, Main Road, Baner, Pune"
                      className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:border-gold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Guest Count */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Estimated Guest Count <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="number"
                  required
                  min={50}
                  max={5000}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  placeholder="e.g. 500"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 outline-none focus:border-gold shadow-2xs"
                />
              </div>
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Estimated Total Budget (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="number"
                  required
                  min={100000}
                  step={50000}
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                  placeholder="e.g. 2500000"
                  className="w-full rounded-xl border bg-background pl-9 pr-3 py-2.5 outline-none focus:border-gold shadow-2xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" variant="hero" className="font-semibold gap-1.5 px-6">
              Review Event Summary <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      )}

      {step === 'CONFIRM' && (
        <div className="rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 shadow-float space-y-6 animate-rise">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-plum">
                Confirm Celebration Details
              </h3>
              <p className="text-xs text-muted-foreground">
                Please review your event summary before entering your personal Planning Hub.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gold-soft/30 border border-gold/30 p-5 space-y-3.5 text-xs text-navy">
            <div className="flex items-center justify-between pb-2 border-b border-gold/20">
              <span className="text-muted-foreground font-medium">Event Title:</span>
              <strong className="text-plum text-sm">{eventName}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Ceremony Type:</span>
              <span className="font-semibold">{eventType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Date:</span>
              <span className="font-semibold">{eventDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Location:</span>
              <span className="font-semibold">{area}, {city}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Venue Status:</span>
              {isVenueNotFinalized ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  Venue Not Finalized (Provisional)
                </span>
              ) : (
                <span className="font-semibold">{venueName}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">Guest Count:</span>
              <span className="font-semibold">{guestCount} Guests</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gold/20">
              <span className="text-muted-foreground font-medium">Estimated Budget:</span>
              <strong className="text-emerald-700 text-sm">
                ₹{Number(estimatedBudget).toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep('FORM')}
              className="text-muted-foreground hover:text-navy"
            >
              ← Edit Details
            </Button>
            <Button
              type="button"
              variant="hero"
              onClick={handleFinalConfirm}
              className="font-semibold gap-1.5 px-6 shadow-soft"
            >
              Confirm & Enter Planning Hub <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

