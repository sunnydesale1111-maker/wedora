import { useState } from 'react';
import { Vendor } from '@/types/vendor';
import { WeddingEvent } from '@/types/event';
import { X, CheckCircle2, Send, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RequestQuotationModalProps {
  vendor: Vendor | null;
  event: WeddingEvent;
  onClose: () => void;
  onSubmit: (payload: {
    eventId: string;
    vendorId: string;
    vendorBusinessName: string;
    serviceCategory: string;
    requirements: string;
    guestCount?: number;
  }) => void;
}

export function RequestQuotationModal({
  vendor,
  event,
  onClose,
  onSubmit,
}: RequestQuotationModalProps) {
  const [requirements, setRequirements] = useState('');
  const [guestCount, setGuestCount] = useState<number>(event.guestCount || 500);
  const [success, setSuccess] = useState(false);

  if (!vendor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventId: event.id,
      vendorId: vendor.id,
      vendorBusinessName: vendor.businessName,
      serviceCategory: vendor.category,
      requirements: requirements || `Formal quotation request for ${vendor.category} for ${event.eventName}`,
      guestCount,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-11 items-center justify-center arch bg-gradient-plum text-gold font-display text-xl shrink-0">
            {vendor.businessName[0]}
          </div>
          <div>
            <h3 className="text-xl font-display text-plum">Request Quotation</h3>
            <p className="text-xs text-muted-foreground">
              Direct inquiry to <strong className="text-navy">{vendor.businessName}</strong>
            </p>
          </div>
        </div>

        {success ? (
          <div className="my-8 rounded-2xl bg-success-soft p-6 text-center text-success animate-rise">
            <CheckCircle2 className="size-10 mx-auto mb-2 text-success" />
            <h4 className="font-display text-lg font-semibold">Inquiry Dispatched!</h4>
            <p className="text-xs mt-1 text-muted-foreground">
              {vendor.businessName} has received your inquiry. A customized quotation will appear in your Quotations inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Event Summary Card */}
            <div className="rounded-2xl bg-secondary/80 p-3.5 space-y-1.5 border border-gold/20">
              <div className="font-medium text-navy text-sm">{event.eventName}</div>
              <div className="flex flex-wrap gap-3 text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-gold" />
                  {event.eventDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-gold" />
                  {event.city} ({event.area})
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5 text-gold" />
                  {event.guestCount} Guests
                </span>
              </div>
            </div>

            {/* Guest Count Override */}
            <div>
              <label className="block font-medium text-navy mb-1">
                Expected Guest Count for this Service:
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold font-medium"
              />
            </div>

            {/* Detailed Requirements */}
            <div>
              <label className="block font-medium text-navy mb-1">
                Specific Requirements / Preferences:
              </label>
              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="E.g., Preferred cuisines, specific live stations, theme preferences, setup timings, decor palette..."
                className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="hero">
                <Send className="size-3.5 mr-1.5" /> Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
