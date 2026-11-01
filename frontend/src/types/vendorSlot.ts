export type VendorSlotType = 'FIRST_HALF' | 'SECOND_HALF' | 'FULL_DAY';

export interface SlotBookingRecord {
  id: string;
  vendorId: string;
  date: string; // YYYY-MM-DD
  slot: VendorSlotType;
  eventName: string;
  clientName: string;
  notes?: string;
  bookedAt: string;
}

export interface DaySlotStatus {
  date: string;
  firstHalfBooked: boolean;
  secondHalfBooked: boolean;
  firstHalfDetails?: SlotBookingRecord;
  secondHalfDetails?: SlotBookingRecord;
  overallStatus: 'Available' | 'First Half Booked' | 'Second Half Booked' | 'Fully Booked';
}

const STORAGE_PREFIX = 'wedora_vendor_slots_';

export function getVendorSlotStorageKey(vendorId: string): string {
  return `${STORAGE_PREFIX}${vendorId}`;
}

export function loadVendorSlotBookings(vendorId: string): Record<string, SlotBookingRecord[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getVendorSlotStorageKey(vendorId));
    return raw ? JSON.parse(raw) : getDefaultSeedSlotBookings(vendorId);
  } catch {
    return getDefaultSeedSlotBookings(vendorId);
  }
}

export function saveVendorSlotBookings(
  vendorId: string,
  bookings: Record<string, SlotBookingRecord[]>
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getVendorSlotStorageKey(vendorId), JSON.stringify(bookings));
    window.dispatchEvent(
      new CustomEvent('wedora:slot_bookings_updated', {
        detail: { vendorId, bookings },
      })
    );
  } catch (err) {
    console.error('Failed to save slot bookings:', err);
  }
}

export function getDaySlotStatus(
  vendorId: string,
  date: string,
  calendarStatusOverride?: string
): DaySlotStatus {
  const allBookings = loadVendorSlotBookings(vendorId);
  const dayRecords = allBookings[date] || [];

  let firstHalfBooked = false;
  let secondHalfBooked = false;
  let firstHalfDetails: SlotBookingRecord | undefined;
  let secondHalfDetails: SlotBookingRecord | undefined;

  // Check if calendar override is already Fully Booked
  if (calendarStatusOverride === 'Fully Booked') {
    firstHalfBooked = true;
    secondHalfBooked = true;
  }

  for (const record of dayRecords) {
    if (record.slot === 'FIRST_HALF') {
      firstHalfBooked = true;
      firstHalfDetails = record;
    } else if (record.slot === 'SECOND_HALF') {
      secondHalfBooked = true;
      secondHalfDetails = record;
    } else if (record.slot === 'FULL_DAY') {
      firstHalfBooked = true;
      secondHalfBooked = true;
      firstHalfDetails = record;
      secondHalfDetails = record;
    }
  }

  let overallStatus: DaySlotStatus['overallStatus'] = 'Available';
  if (firstHalfBooked && secondHalfBooked) {
    overallStatus = 'Fully Booked';
  } else if (firstHalfBooked) {
    overallStatus = 'First Half Booked';
  } else if (secondHalfBooked) {
    overallStatus = 'Second Half Booked';
  }

  return {
    date,
    firstHalfBooked,
    secondHalfBooked,
    firstHalfDetails,
    secondHalfDetails,
    overallStatus,
  };
}

export function checkSlotConflict(
  vendorId: string,
  date: string,
  slot: VendorSlotType,
  calendarStatusOverride?: string
): { hasConflict: boolean; reason?: string } {
  const status = getDaySlotStatus(vendorId, date, calendarStatusOverride);

  if (slot === 'FULL_DAY') {
    if (status.firstHalfBooked && status.secondHalfBooked) {
      return {
        hasConflict: true,
        reason: `Full day is already completely booked on ${date}.`,
      };
    }
    if (status.firstHalfBooked) {
      return {
        hasConflict: true,
        reason: `First half of ${date} is already booked (${status.firstHalfDetails?.eventName || 'Client Event'}). Second half is available.`,
      };
    }
    if (status.secondHalfBooked) {
      return {
        hasConflict: true,
        reason: `Second half of ${date} is already booked (${status.secondHalfDetails?.eventName || 'Client Event'}). First half is available.`,
      };
    }
  } else if (slot === 'FIRST_HALF') {
    if (status.firstHalfBooked) {
      return {
        hasConflict: true,
        reason: `First half on ${date} is already booked (${status.firstHalfDetails?.eventName || 'Client Event'}). Second half is currently open.`,
      };
    }
  } else if (slot === 'SECOND_HALF') {
    if (status.secondHalfBooked) {
      return {
        hasConflict: true,
        reason: `Second half on ${date} is already booked (${status.secondHalfDetails?.eventName || 'Client Event'}). First half is currently open.`,
      };
    }
  }

  return { hasConflict: false };
}

export function recordSlotBooking(
  vendorId: string,
  record: Omit<SlotBookingRecord, 'id' | 'bookedAt'>
): SlotBookingRecord {
  const allBookings = loadVendorSlotBookings(vendorId);
  const dayRecords = allBookings[record.date] || [];

  const newRecord: SlotBookingRecord = {
    ...record,
    id: `slot-bk-${Date.now()}`,
    bookedAt: new Date().toISOString(),
  };

  const updatedDay = [...dayRecords, newRecord];
  allBookings[record.date] = updatedDay;
  saveVendorSlotBookings(vendorId, allBookings);

  return newRecord;
}

function getDefaultSeedSlotBookings(vendorId: string): Record<string, SlotBookingRecord[]> {
  // Seed with realistic vendor commitments for key demo dates
  return {
    '2026-12-14': [
      {
        id: 'seed-slot-01',
        vendorId,
        date: '2026-12-14',
        slot: 'SECOND_HALF',
        eventName: 'Kulkarni Sangeet Evening',
        clientName: 'Rohan Kulkarni',
        bookedAt: '2026-10-15T10:00:00Z',
      },
    ],
    '2026-12-19': [
      {
        id: 'seed-slot-02',
        vendorId,
        date: '2026-12-19',
        slot: 'FIRST_HALF',
        eventName: 'Deshmukh Haldi Ceremony',
        clientName: 'Priya Deshmukh',
        bookedAt: '2026-10-18T14:30:00Z',
      },
    ],
  };
}

