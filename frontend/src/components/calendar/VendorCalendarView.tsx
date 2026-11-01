import { useState } from 'react';
import { AvailabilityStatus } from '@/types/vendor';
import { CalendarCheck, CheckCircle2, Clock, CalendarDays, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Status } from '@/components/dashboard';
import { getDaySlotStatus } from '@/types/vendorSlot';

interface VendorCalendarViewProps {
  vendorId: string;
  vendorBusinessName: string;
  currentOverrides: Record<string, AvailabilityStatus>;
  onUpdateAvailability: (date: string, status: AvailabilityStatus) => void;
}

const SAMPLE_DATES = [
  { date: '2026-12-14', label: '14 Dec 2026 (Pre-Wedding / Sangeet)' },
  { date: '2026-12-15', label: '15 Dec 2026 (Mandatory Wedding Test Date)' },
  { date: '2026-12-16', label: '16 Dec 2026 (Reception Dinner)' },
  { date: '2026-12-18', label: '18 Dec 2026 (Weekend Auspicious Muhurat)' },
  { date: '2026-12-19', label: '19 Dec 2026 (Saturday Celebration)' },
  { date: '2026-12-20', label: '20 Dec 2026 (Sunday Reception)' },
  { date: '2026-12-25', label: '25 Dec 2026 (Christmas Holiday Wedding)' },
];

export function VendorCalendarView({
  vendorId,
  vendorBusinessName,
  currentOverrides,
  onUpdateAvailability,
}: VendorCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState('2026-12-15');
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>('Available');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSave = () => {
    onUpdateAvailability(selectedDate, selectedStatus);
    setFeedbackMsg(`Updated ${selectedDate} to "${selectedStatus}". Vendor Discovery search results now immediately reflect this change.`);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Control Form */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck className="size-5 text-gold" />
          <h3 className="font-display text-lg text-plum font-semibold">
            Manage Date Availability Status
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Changes made here immediately update Wedora's client-side search engine. Customers and planners will see your live calendar status in the AI Vendor Discovery tab.
        </p>

        <div className="grid gap-4 sm:grid-cols-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              Select Target Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy mb-1.5">
              Availability Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AvailabilityStatus)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-xs outline-none focus:border-gold font-medium"
            >
              <option value="Available">Available (Accepting Inquiries)</option>
              <option value="Tentative">Tentative (Inquiry Under Review)</option>
              <option value="Fully Booked">Fully Booked (No Further Bookings)</option>
              <option value="Unavailable">Unavailable (Blackout Date)</option>
              <option value="Not Updated">Not Updated</option>
            </select>
          </div>

          <div>
            <Button variant="hero" className="w-full" onClick={handleSave}>
              Save Calendar Status
            </Button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-4 rounded-xl bg-success-soft p-3 text-xs text-success flex items-center gap-2 animate-rise">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Date Status Matrix */}
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <h4 className="font-display text-base text-plum font-semibold mb-3 flex items-center gap-2">
          <CalendarDays className="size-4 text-gold" />
          December 2026 Key Dates Schedule
        </h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {SAMPLE_DATES.map((item) => {
            const effective = currentOverrides[item.date] || (item.date === '2026-12-15' ? 'Available' : 'Available');
            const slotStatus = getDaySlotStatus(vendorId, item.date, effective);

            return (
              <div
                key={item.date}
                className="flex flex-col justify-between p-3.5 rounded-xl border bg-secondary/40 hover:border-gold/50 transition cursor-pointer space-y-2.5"
                onClick={() => {
                  setSelectedDate(item.date);
                  setSelectedStatus(effective);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-navy">{item.date}</div>
                    <div className="text-[11px] text-muted-foreground">{item.label}</div>
                  </div>
                  <Status s={effective} />
                </div>

                {/* Slot Status Breakdown */}
                <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-1.5 text-[10px]">
                  <div
                    className={`p-1.5 rounded-lg border text-center font-medium ${
                      slotStatus.firstHalfBooked
                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    1st Half: {slotStatus.firstHalfBooked ? 'Booked' : 'Open'}
                  </div>
                  <div
                    className={`p-1.5 rounded-lg border text-center font-medium ${
                      slotStatus.secondHalfBooked
                        ? 'bg-destructive/10 text-destructive border-destructive/20'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    2nd Half: {slotStatus.secondHalfBooked ? 'Booked' : 'Open'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
