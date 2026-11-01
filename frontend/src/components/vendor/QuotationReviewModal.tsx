import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  DollarSign,
  FileText,
  Send,
  X,
  ShieldCheck,
  Users,
  CalendarDays,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProvisionalQuotationData {
  id?: string;
  inquiryId?: string;
  vendorId: string;
  vendorBusinessName: string;
  clientName: string;
  eventName: string;
  date: string;
  guestCount: number;
  pricePerPlate?: number;
  serviceCategory: string;
  quotedAmount: number;
  additionalCharges: number;
  serviceScope: string;
  includedServices: string[];
}

interface QuotationReviewModalProps {
  provisionalQuote: ProvisionalQuotationData;
  onClose: () => void;
  onApproveAndSend: (finalQuote: {
    inquiryId: string;
    vendorId: string;
    vendorBusinessName: string;
    quotedAmount: number;
    additionalCharges: number;
    serviceScope: string;
    includedServices: string[];
  }) => void;
}

export function QuotationReviewModal({
  provisionalQuote,
  onClose,
  onApproveAndSend,
}: QuotationReviewModalProps) {
  const [guestCount, setGuestCount] = useState<number>(provisionalQuote.guestCount || 500);
  const [pricePerPlate, setPricePerPlate] = useState<number | undefined>(
    provisionalQuote.pricePerPlate
  );
  const [baseAmount, setBaseAmount] = useState<number>(
    provisionalQuote.pricePerPlate
      ? (provisionalQuote.guestCount || 500) * provisionalQuote.pricePerPlate
      : provisionalQuote.quotedAmount || 600000
  );
  const [additionalCharges, setAdditionalCharges] = useState<number>(
    provisionalQuote.additionalCharges || 0
  );
  const [scopeText, setScopeText] = useState<string>(
    provisionalQuote.serviceScope ||
      `Comprehensive turnkey ${provisionalQuote.serviceCategory} execution for ${provisionalQuote.eventName} catering to ${provisionalQuote.guestCount} guests.`
  );
  const [includedServices, setIncludedServices] = useState<string[]>(
    provisionalQuote.includedServices && provisionalQuote.includedServices.length > 0
      ? provisionalQuote.includedServices
      : [
          'Professional On-site Service Crew',
          'Setup, Delivery & Dismantling Logistics',
          'Dedicated Wedding Day Manager',
          'Hygiene & Safety Certified Staff',
        ]
  );
  const [isApproved, setIsApproved] = useState(false);

  // Recalculate baseAmount if pricePerPlate or guestCount changes
  const handlePricePerPlateChange = (newRate: number) => {
    setPricePerPlate(newRate);
    if (newRate > 0 && guestCount > 0) {
      setBaseAmount(guestCount * newRate);
    }
  };

  const handleGuestCountChange = (newGuests: number) => {
    setGuestCount(newGuests);
    if (pricePerPlate && pricePerPlate > 0 && newGuests > 0) {
      setBaseAmount(newGuests * pricePerPlate);
    }
  };

  const totalAmount = (Number(baseAmount) || 0) + (Number(additionalCharges) || 0);

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApproved(true);

    setTimeout(() => {
      onApproveAndSend({
        inquiryId: provisionalQuote.inquiryId || `inq-ai-${Date.now()}`,
        vendorId: provisionalQuote.vendorId,
        vendorBusinessName: provisionalQuote.vendorBusinessName,
        quotedAmount: Number(baseAmount) || 0,
        additionalCharges: Number(additionalCharges) || 0,
        serviceScope: scopeText,
        includedServices,
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-card p-6 sm:p-7 shadow-float border border-gold/40 relative animate-rise my-8 text-xs text-navy">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition"
          aria-label="Close review modal"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 pb-4 border-b">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-plum text-gold shrink-0">
            <Calculator className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-display text-plum font-semibold">
                Quotation Review & Approval
              </h3>
              <span className="rounded-full bg-gold-soft text-navy px-2.5 py-0.5 text-[10px] font-bold border border-gold/40 uppercase tracking-wider">
                Automated Calculation
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verify calculated pricing, scope of work, and terms. Quotations are only dispatched with your explicit approval.
            </p>
          </div>
        </div>

        {isApproved ? (
          <div className="my-8 rounded-2xl bg-success-soft p-8 text-center text-success animate-rise">
            <CheckCircle2 className="size-12 mx-auto mb-3 text-success animate-bounce" />
            <h4 className="font-display text-lg font-semibold">Quotation Approved & Dispatched!</h4>
            <p className="text-xs mt-1 text-muted-foreground">
              Your quotation of ₹{totalAmount.toLocaleString('en-IN')} has been formally submitted to {provisionalQuote.clientName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmApproval} className="space-y-4 mt-4">
            {/* Context Summary */}
            <div className="rounded-2xl bg-secondary/50 p-4 border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px] font-medium">Customer:</span>
                <span className="font-semibold text-plum">{provisionalQuote.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-medium">Event:</span>
                <span className="font-semibold text-navy">{provisionalQuote.eventName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-medium">Target Date:</span>
                <span className="font-semibold text-navy">{provisionalQuote.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px] font-medium">Service Category:</span>
                <span className="font-semibold text-navy">{provisionalQuote.serviceCategory}</span>
              </div>
            </div>

            {/* Formula Calculation Banner */}
            <div className="p-3.5 rounded-2xl bg-gold-soft/50 border border-gold/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-plum flex items-center gap-1.5">
                  <Calculator className="size-3.5 text-gold" /> Automatic Quotation Calculation:
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Total = Guests × Price Per Plate
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-card/80 p-2.5 rounded-xl border">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Guests:</span>
                  <input
                    type="number"
                    min={1}
                    value={guestCount}
                    onChange={(e) => handleGuestCountChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-background rounded-lg border px-2 py-1 text-xs font-bold text-navy outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Price / Plate (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={pricePerPlate || ''}
                    placeholder="Rate per plate"
                    onChange={(e) => handlePricePerPlateChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background rounded-lg border px-2 py-1 text-xs font-bold text-navy outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Base Amount (₹):</span>
                  <input
                    type="number"
                    min={1}
                    value={baseAmount}
                    onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-background rounded-lg border px-2 py-1 text-xs font-bold text-plum outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Additional Charges (Unspecified is 0) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-navy mb-1">
                  Additional Charges / Taxes (₹):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-gold">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={additionalCharges}
                    onChange={(e) => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    placeholder="0 if none"
                    className="w-full rounded-xl border bg-background pl-8 pr-3 py-2 outline-none focus:border-gold font-medium text-navy text-sm"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  * Only applies if explicitly requested; not invented.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-navy mb-1">
                  Final Payable Quotation Amount:
                </label>
                <div className="h-10 rounded-xl bg-gold-soft/60 border border-gold/40 flex items-center justify-between px-3">
                  <span className="text-[11px] text-muted-foreground font-medium">Grand Total:</span>
                  <span className="text-base font-display text-plum font-bold">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Scope of Work */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Detailed Scope of Work & Terms:
              </label>
              <textarea
                rows={3}
                required
                value={scopeText}
                onChange={(e) => setScopeText(e.target.value)}
                className="w-full rounded-xl border bg-background p-3 text-xs outline-none focus:border-gold leading-relaxed"
              />
            </div>

            {/* Standard Inclusions Checklist */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Standard Inclusions:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {includedServices.map((inc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-xl border bg-secondary/30 text-[11px]"
                  >
                    <CheckCircle2 className="size-3.5 text-success shrink-0" />
                    <span className="truncate">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicit Confirmation Notice */}
            <div className="rounded-xl bg-secondary/50 p-3 border text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-gold shrink-0" />
              <span>
                <strong>Explicit Approval Required:</strong> Clicking below confirms your verified approval. The customer will receive this quotation immediately in their portal.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-end gap-2 border-t">
              <Button type="button" variant="ghost" onClick={onClose} className="text-xs">
                Keep as Draft & Close
              </Button>
              <Button type="submit" variant="hero" className="text-xs font-semibold px-5">
                <Send className="size-3.5 mr-1.5" /> Approve & Dispatch Quotation
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default QuotationReviewModal;
