import { useState } from 'react';
import { Booking } from '@/types/booking';
import { AlertCircle, CheckCircle2, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulatedPaymentModalProps {
  booking: Booking | null;
  onClose: () => void;
  onConfirmPayment: (bookingId: string, amount: number, purpose: string) => void;
}

export function SimulatedPaymentModal({
  booking,
  onClose,
  onConfirmPayment,
}: SimulatedPaymentModalProps) {
  if (!booking) return null;

  const outstandingBalance = Math.max(0, booking.agreedAmount - (booking.paidAmount || 0));
  const [payAmount, setPayAmount] = useState<string>(
    outstandingBalance > 0 ? String(Math.min(outstandingBalance, 50000)) : '0'
  );
  const [purpose, setPurpose] = useState('Vendor Milestone Advance (Simulated)');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(payAmount);
    if (isNaN(num) || num <= 0) return;

    onConfirmPayment(booking.id, num, purpose);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
            <DollarSign className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-display text-plum font-semibold">
              Simulated Payment
            </h3>
            <p className="text-xs text-muted-foreground">
              Pay {booking.vendorBusinessName}
            </p>
          </div>
        </div>

        {/* Mandatory PRD Section 15 Simulation Disclaimer */}
        <div className="my-3 rounded-2xl bg-gold-soft border border-gold/40 p-3.5 text-xs text-navy flex items-start gap-2.5">
          <AlertCircle className="size-5 text-gold shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Demonstration Simulation:</strong> No real money will be charged or deducted. This updates the demo booking ledger and vendor dashboard in real time.
          </div>
        </div>

        {isSuccess ? (
          <div className="my-6 rounded-2xl bg-success-soft p-5 text-center text-success animate-rise">
            <CheckCircle2 className="size-10 mx-auto mb-2 text-success" />
            <h4 className="font-display text-base font-semibold">Demo Payment Recorded!</h4>
            <p className="text-xs mt-1 text-muted-foreground">
              ₹{parseFloat(payAmount).toLocaleString('en-IN')} has been credited to {booking.vendorBusinessName} in demo state.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4 text-xs">
            {/* Booking Balance Breakdown */}
            <div className="rounded-2xl bg-secondary/80 p-3.5 space-y-1.5 border border-gold/20">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-navy">{booking.serviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Agreed Contract Amount:</span>
                <span className="font-semibold text-navy">
                  ₹{booking.agreedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Already Paid to Date:</span>
                <span className="font-semibold text-success">
                  ₹{(booking.paidAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t">
                <span className="font-semibold text-navy">Outstanding Balance:</span>
                <span className="font-bold text-plum">
                  ₹{outstandingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Input Amount */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Simulated Payment Amount (₹):
              </label>
              <input
                type="number"
                max={outstandingBalance}
                min={1}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold font-semibold text-navy text-sm"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block font-semibold text-navy mb-1.5">
                Payment Purpose:
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full rounded-xl border bg-background p-2.5 outline-none focus:border-gold text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="hero">
                Confirm Simulated Payment
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
