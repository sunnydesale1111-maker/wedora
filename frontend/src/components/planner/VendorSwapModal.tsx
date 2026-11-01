import React from 'react';
import { ArrowRightLeft, Check, X, AlertTriangle, Calendar, Star, DollarSign, ShieldCheck } from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { Button } from '@/components/ui/button';

interface VendorSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalVendor?: Vendor | null;
  replacementVendor: Vendor | null;
  eventName: string;
  eventDate: string;
  onConfirmSwap: (originalVendor: Vendor, replacementVendor: Vendor) => void;
}

export const VendorSwapModal: React.FC<VendorSwapModalProps> = ({
  isOpen,
  onClose,
  originalVendor,
  replacementVendor,
  eventName,
  eventDate,
  onConfirmSwap,
}) => {
  if (!isOpen || !replacementVendor) return null;

  const originalPrice = originalVendor?.startingPrice || 0;
  const replacementPrice = replacementVendor.startingPrice || 0;
  const priceDiff = replacementPrice - originalPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-3xl border border-gold/30 shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <ArrowRightLeft className="size-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-plum">Confirm Vendor Swap</h2>
              <p className="text-xs text-muted-foreground">
                Replace an existing vendor for <strong className="text-navy">{eventName}</strong> ({eventDate})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Swap Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current Vendor Card */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                Vendor to Replace
              </span>
              <span className="text-xs text-muted-foreground">{originalVendor?.category || 'Service'}</span>
            </div>
            <h4 className="font-display font-semibold text-base text-navy">
              {originalVendor ? originalVendor.businessName : 'Currently Unassigned / Unavailable'}
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-rose-500" />
                <span>Date: {eventDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-rose-500" />
                <span>
                  Estimated Base: ₹{originalPrice.toLocaleString('en-IN')}{' '}
                  {originalVendor?.priceUnit ? `(${originalVendor.priceUnit})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Replacement Vendor Card */}
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Selected Replacement
              </span>
              <span className="text-xs text-emerald-800 font-medium">Available</span>
            </div>
            <h4 className="font-display font-semibold text-base text-navy">
              {replacementVendor.businessName}
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-navy">
                  {replacementVendor.onTimeDeliveryPercent}% On-Time Delivery
                </span>
                <span>({replacementVendor.completedOrders} orders)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="size-3.5 text-emerald-600" />
                <span className="font-semibold text-navy">
                  ₹{replacementPrice.toLocaleString('en-IN')}{' '}
                  {replacementVendor.priceUnit ? `(${replacementVendor.priceUnit})` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact & Price Variance Banner */}
        <div className="rounded-2xl bg-muted/60 p-3.5 text-xs text-navy space-y-1.5 border border-border">
          <div className="flex items-center justify-between font-semibold">
            <span>Price Variance Impact:</span>
            <span
              className={
                priceDiff > 0
                  ? 'text-amber-600'
                  : priceDiff < 0
                  ? 'text-emerald-600'
                  : 'text-muted-foreground'
              }
            >
              {priceDiff > 0
                ? `+₹${priceDiff.toLocaleString('en-IN')} (Additional investment)`
                : priceDiff < 0
                ? `-₹${Math.abs(priceDiff).toLocaleString('en-IN')} (Cost saving)`
                : 'Exact price parity'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <ShieldCheck className="size-4 text-gold shrink-0" />
            <span>
              Explicit confirmation required. Replacing this vendor will update your event bundle and recalculate the Event Performance Forecast immediately.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-full px-5 text-xs font-semibold">
            Cancel
          </Button>
          <Button
            variant="hero"
            onClick={() => {
              if (originalVendor) {
                onConfirmSwap(originalVendor, replacementVendor);
              }
              onClose();
            }}
            className="rounded-full px-6 text-xs font-semibold flex items-center gap-1.5"
          >
            <Check className="size-4" /> Confirm Vendor Swap
          </Button>
        </div>
      </div>
    </div>
  );
};

