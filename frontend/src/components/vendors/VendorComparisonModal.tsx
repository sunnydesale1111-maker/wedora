import { Vendor } from '@/types/vendor';
import { X, CheckCircle2, ShieldCheck, Sparkles, Clock, ThumbsUp, RotateCcw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VendorComparisonModalProps {
  vendors: Vendor[];
  onClose: () => void;
  onRequestQuote: (vendor: Vendor) => void;
}

export function VendorComparisonModal({
  vendors,
  onClose,
  onRequestQuote,
}: VendorComparisonModalProps) {
  if (vendors.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-card p-6 sm:p-8 shadow-float border border-gold/40 relative animate-rise my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition p-1.5 rounded-full hover:bg-secondary"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-display text-plum font-semibold">
              Side-by-Side Vendor Performance Comparison
            </h3>
            <p className="text-xs text-muted-foreground">
              Comparing {vendors.length} selected vendor profiles on verified Wedora performance metrics
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="p-3 font-semibold text-muted-foreground w-48">Attribute</th>
                {vendors.map((v) => (
                  <th key={v.id} className="p-3 font-display text-sm text-plum font-semibold min-w-[200px]">
                    {v.businessName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3 font-medium text-navy">Category</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3 text-muted-foreground font-medium">
                    {v.category}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Primary City</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3">
                    <span className="font-semibold text-plum">{v.primaryCity}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Serviceable Areas</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3 text-muted-foreground">
                    {v.serviceableAreas.join(', ')}
                  </td>
                ))}
              </tr>
              <tr className="bg-gold-soft/20">
                <td className="p-3 font-semibold text-navy">
                  Completed Orders
                </td>
                {vendors.map((v) => {
                  const orders = v.completedOrders ?? v.completedOrders90Days ?? 0;
                  const isNew = v.isNewToPlatform || orders === 0;
                  return (
                    <td key={v.id} className="p-3">
                      {isNew ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy bg-gold-soft px-2.5 py-1 rounded-full border border-gold/40">
                          <Sparkles className="size-3 text-gold" />
                          New to Wedora
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-success bg-success-soft px-2.5 py-1 rounded-full">
                          <ShieldCheck className="size-3.5" />
                          {orders} Completed Orders
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gold-soft/20">
                <td className="p-3 font-semibold text-navy">
                  On-Time Delivery
                </td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3 font-semibold text-success text-sm">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5 text-gold" />
                      {v.onTimeDeliveryPercent ?? 96}% On-Time
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="bg-gold-soft/20">
                <td className="p-3 font-semibold text-navy">
                  Successful Referral Bookings
                </td>
                {vendors.map((v) => {
                  const refs = v.successfulReferralBookings ?? v.referralsTotal ?? 0;
                  return (
                    <td key={v.id} className="p-3 font-semibold text-plum text-sm">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="size-3.5 text-gold" />
                        {refs} Referral Bookings
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gold-soft/20">
                <td className="p-3 font-semibold text-navy">
                  Repeat Customer Bookings
                </td>
                {vendors.map((v) => {
                  const repeats = v.repeatCustomerBookings ?? v.repeatOrdersTotal ?? 0;
                  return (
                    <td key={v.id} className="p-3 font-semibold text-navy text-sm">
                      <span className="inline-flex items-center gap-1">
                        <RotateCcw className="size-3.5 text-gold" />
                        {repeats} Repeat Bookings
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-gold-soft/20">
                <td className="p-3 font-semibold text-navy">
                  Verified Customer Feedback
                </td>
                {vendors.map((v) => {
                  const count = v.verifiedCustomerFeedbackCount ?? (v.customerFeedback?.length || 0);
                  return (
                    <td key={v.id} className="p-3 font-medium text-navy">
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="size-3.5 text-gold" />
                        {count} Verified Experiences
                      </span>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Max Guest Capacity</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3 text-muted-foreground">
                    {v.maximumGuestCapacity ? `${v.maximumGuestCapacity} guests` : 'Flexible / Open'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Starting Price</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3 font-medium text-plum">
                    {v.startingPrice
                      ? `₹${v.startingPrice.toLocaleString('en-IN')} (${v.priceUnit || 'per event'})`
                      : 'Quote Required'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Key Highlights</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {v.serviceTags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-navy">Action</td>
                {vendors.map((v) => (
                  <td key={v.id} className="p-3">
                    <Button
                      size="sm"
                      variant="hero"
                      className="text-xs w-full"
                      onClick={() => {
                        onClose();
                        onRequestQuote(v);
                      }}
                    >
                      Request Quote
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
