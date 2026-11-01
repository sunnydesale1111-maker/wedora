import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, Filter, Search } from 'lucide-react';
import { Vendor } from '@/types/vendor';
import { WeddingEvent } from '@/types/event';
import { getDaySlotStatus, recordSlotBooking, VendorSlotType } from '@/types/vendorSlot';
import { Button } from '@/components/ui/button';

interface PlannerVendorCalendarProps {
  vendors: Vendor[];
  activeEvent: WeddingEvent;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSlotBooked?: (vendorId: string, date: string, slot: VendorSlotType) => void;
}

export const PlannerVendorCalendar: React.FC<PlannerVendorCalendarProps> = ({
  vendors,
  activeEvent,
  selectedDate,
  onDateChange,
  onSlotBooked,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    vendor: Vendor;
    slot: VendorSlotType;
    date: string;
  } | null>(null);

  const categories = ['ALL', ...Array.from(new Set(vendors.map((v) => v.category)))];

  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory !== 'ALL' && v.category !== selectedCategory) return false;
    if (searchQuery && !v.businessName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleBookSlot = (vendor: Vendor, slot: VendorSlotType) => {
    recordSlotBooking(vendor.id, {
      vendorId: vendor.id,
      date: selectedDate,
      slot,
      eventName: activeEvent.eventName,
      clientName: 'Aditi Sharma (Planner)',
      notes: `Reserved for ${activeEvent.eventName} via Planner Calendar`,
    });

    if (onSlotBooked) {
      onSlotBooked(vendor.id, selectedDate, slot);
    }

    setBookingConfirmation(null);
    alert(`Successfully reserved ${slot === 'FIRST_HALF' ? 'First Half' : 'Second Half'} on ${selectedDate} with ${vendor.businessName}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Calendar Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-navy">
            <CalendarIcon className="size-4 text-gold" />
            <span>Select Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="size-3.5 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Service Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="size-3.5 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Slots Legend */}
      <div className="flex flex-wrap items-center gap-5 px-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-500" />
          <span>Available (Open for booking)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-rose-500" />
          <span>Booked (Capacity reserved / Conflict)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-500" />
          <span>Provisional Hold</span>
        </div>
        <div className="text-[11px] text-gold font-medium ml-auto">
          First Half: 09:00 – 15:00 | Second Half: 16:00 – 23:00
        </div>
      </div>

      {/* Vendors Slot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const slotStatus = getDaySlotStatus(
            vendor.id,
            selectedDate,
            vendor.availabilityDates[selectedDate]
          );

          return (
            <div
              key={vendor.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-soft hover:border-gold/50 transition space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-display font-bold text-navy text-sm leading-snug">
                    {vendor.businessName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{vendor.category}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {vendor.primaryCity}
                </span>
              </div>

              {/* Slot Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* First Half */}
                <div
                  className={`p-2.5 rounded-2xl border transition ${
                    slotStatus.firstHalfBooked
                      ? 'border-rose-200 bg-rose-50/50 text-rose-800'
                      : 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                  }`}
                >
                  <div className="font-semibold text-[11px] flex items-center justify-between">
                    <span>First Half</span>
                    {slotStatus.firstHalfBooked ? (
                      <XCircle className="size-3.5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-[10px] mt-1 font-medium">
                    {slotStatus.firstHalfBooked ? (
                      <span className="text-rose-700">
                        {slotStatus.firstHalfDetails?.eventName || 'Booked Slot'}
                      </span>
                    ) : (
                      <span className="text-emerald-700">Available</span>
                    )}
                  </div>
                  {!slotStatus.firstHalfBooked && (
                    <button
                      onClick={() =>
                        setBookingConfirmation({
                          vendor,
                          slot: 'FIRST_HALF',
                          date: selectedDate,
                        })
                      }
                      className="mt-2 text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 underline block"
                    >
                      Reserve 1st Half
                    </button>
                  )}
                </div>

                {/* Second Half */}
                <div
                  className={`p-2.5 rounded-2xl border transition ${
                    slotStatus.secondHalfBooked
                      ? 'border-rose-200 bg-rose-50/50 text-rose-800'
                      : 'border-emerald-200 bg-emerald-50/50 text-emerald-800'
                  }`}
                >
                  <div className="font-semibold text-[11px] flex items-center justify-between">
                    <span>Second Half</span>
                    {slotStatus.secondHalfBooked ? (
                      <XCircle className="size-3.5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                    )}
                  </div>
                  <div className="text-[10px] mt-1 font-medium">
                    {slotStatus.secondHalfBooked ? (
                      <span className="text-rose-700">
                        {slotStatus.secondHalfDetails?.eventName || 'Booked Slot'}
                      </span>
                    ) : (
                      <span className="text-emerald-700">Available</span>
                    )}
                  </div>
                  {!slotStatus.secondHalfBooked && (
                    <button
                      onClick={() =>
                        setBookingConfirmation({
                          vendor,
                          slot: 'SECOND_HALF',
                          date: selectedDate,
                        })
                      }
                      className="mt-2 text-[10px] font-semibold text-emerald-800 hover:text-emerald-950 underline block"
                    >
                      Reserve 2nd Half
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Confirmation Dialog */}
      {bookingConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-3xl border border-gold/40 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-display font-bold text-plum">
              Confirm Slot Reservation
            </h3>
            <p className="text-xs text-muted-foreground">
              Reserve{' '}
              <strong className="text-navy">
                {bookingConfirmation.slot === 'FIRST_HALF' ? 'First Half (09:00 - 15:00)' : 'Second Half (16:00 - 23:00)'}
              </strong>{' '}
              on <strong className="text-navy">{bookingConfirmation.date}</strong> for{' '}
              <strong className="text-plum">{bookingConfirmation.vendor.businessName}</strong> under event{' '}
              <strong className="text-navy">{activeEvent.eventName}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookingConfirmation(null)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={() => handleBookSlot(bookingConfirmation.vendor, bookingConfirmation.slot)}
                className="rounded-full"
              >
                Confirm Reservation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

