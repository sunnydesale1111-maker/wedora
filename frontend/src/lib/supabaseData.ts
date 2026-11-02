import { supabase, isSupabaseConfigured } from './supabase';
import type { WeddingEvent, TimelineTask, EventParticipant } from '../types/event';
import type { CustomerProfile, OrganizerClientProfile } from '../types/profile';
import type { Booking, AvailabilityStatus } from '../types/booking';

/**
 * WEDORA — SUPABASE DATA SERVICE
 * Handles persistent database operations with Row Level Security and conflict checks.
 */

// -------------------------------------------------------------
// 1. EVENTS
// -------------------------------------------------------------
export async function fetchEventsFromSupabase(userId?: string, role?: string): Promise<WeddingEvent[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase.from('events').select(`
      id,
      event_name,
      event_type,
      event_date,
      city,
      area,
      guest_count,
      estimated_budget,
      description,
      owner_user_id,
      organizer_client_id,
      is_demo
    `);

    // For customers, query their own events or demo events
    if (role === 'CUSTOMER' && userId) {
      query = query.or(`owner_user_id.eq.${userId},is_demo.eq.true`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((d: any) => ({
      id: d.id,
      title: d.event_name,
      eventName: d.event_name,
      eventType: d.event_type || 'Wedding',
      targetDate: d.event_date,
      eventDate: d.event_date,
      city: d.city,
      area: d.area,
      guestCount: d.guest_count,
      allocatedBudget: d.estimated_budget,
      estimatedBudget: d.estimated_budget,
      description: d.description || '',
      ownerId: d.owner_user_id,
      organizerClientId: d.organizer_client_id,
      isDemo: d.is_demo,
      services: ['Catering', 'Decoration', 'Lighting', 'Photography', 'Sound'],
    }));
  } catch {
    return [];
  }
}

export async function saveEventToSupabase(
  event: Partial<WeddingEvent> & {
    title?: string;
    eventName?: string;
    targetDate?: string;
    eventDate?: string;
    city: string;
    area: string;
  },
  ownerUserId: string
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not configured' };
  try {
    const payload = {
      id: event.id || undefined,
      owner_user_id: ownerUserId,
      event_name: event.eventName || event.title || 'Untitled Celebration',
      event_type: event.eventType || 'Wedding',
      event_date: event.eventDate || event.targetDate,
      city: event.city,
      area: event.area,
      guest_count: event.guestCount || 500,
      estimated_budget: event.estimatedBudget || (event as any).allocatedBudget || 2500000,
      description: event.description || '',
      organizer_client_id: (event as any).organizerClientId || null,
      is_demo: false,
    };

    const { data, error } = await supabase
      .from('events')
      .upsert(payload)
      .select('id')
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, eventId: data?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save event' };
  }
}

// -------------------------------------------------------------
// 2. TIMELINE TASKS
// -------------------------------------------------------------
export async function fetchTimelineTasksFromSupabase(eventId?: string): Promise<TimelineTask[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    let query = supabase.from('timeline_tasks').select('*');
    if (eventId) {
      query = query.eq('event_id', eventId);
    }
    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((t: any) => ({
      id: t.id,
      eventId: t.event_id,
      title: t.task_name,
      dueDate: t.deadline || '',
      status: t.status === 'COMPLETED' ? 'COMPLETED' : t.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'PENDING',
      assignedTo: t.assigned_user_id || undefined,
      category: 'General',
      isDemo: t.is_demo,
    }));
  } catch {
    return [];
  }
}

export async function saveTimelineTaskToSupabase(
  task: { id?: string; eventId: string; title: string; dueDate?: string; status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' }
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false };
  try {
    const { error } = await supabase.from('timeline_tasks').upsert({
      id: task.id || undefined,
      event_id: task.eventId,
      task_name: task.title,
      deadline: task.dueDate || null,
      status: task.status,
      is_demo: false,
    });
    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// -------------------------------------------------------------
// 3. CUSTOMER FAMILY PROFILES
// -------------------------------------------------------------
export async function fetchCustomerProfilesFromSupabase(userId: string): Promise<CustomerProfile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('customer_family_profiles')
      .select('*')
      .eq('primary_user_id', userId);

    if (error || !data) return [];

    return data.map((p: any) => ({
      id: p.id,
      primaryUserId: p.primary_user_id,
      name: p.name,
      email: p.email,
      relationship: p.relationship,
      avatar: p.avatar || 'avatar-1',
      role: p.role,
      permissions: p.permissions || {},
      sharedEventIds: [],
      createdAt: p.created_at,
    }));
  } catch {
    return [];
  }
}

export async function saveCustomerProfileToSupabase(
  profile: CustomerProfile,
  primaryUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false };
  try {
    const { error } = await supabase.from('customer_family_profiles').upsert({
      id: profile.id,
      primary_user_id: primaryUserId,
      name: profile.name,
      email: profile.email,
      relationship: profile.relationship,
      avatar: profile.avatar,
      role: profile.role,
      permissions: profile.permissions,
      is_demo: false,
    });
    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteCustomerProfileFromSupabase(profileId: string): Promise<{ success: boolean }> {
  if (!isSupabaseConfigured()) return { success: false };
  try {
    const { error } = await supabase.from('customer_family_profiles').delete().eq('id', profileId);
    return { success: !error };
  } catch {
    return { success: false };
  }
}

// -------------------------------------------------------------
// 4. ORGANIZER CLIENT PROFILES
// -------------------------------------------------------------
export async function fetchOrganizerClientsFromSupabase(organizerUserId: string): Promise<OrganizerClientProfile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('organizer_client_profiles')
      .select('*')
      .eq('organizer_user_id', organizerUserId);

    if (error || !data) return [];

    return data.map((c: any) => ({
      id: c.id,
      organizerUserId: c.organizer_user_id,
      clientName: c.client_name,
      clientEmail: c.client_email,
      clientPhone: c.client_phone,
      company: c.company || '',
      status: c.status,
      notes: c.notes || '',
      createdAt: c.created_at,
    }));
  } catch {
    return [];
  }
}

export async function saveOrganizerClientToSupabase(
  client: OrganizerClientProfile,
  organizerUserId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false };
  try {
    const { error } = await supabase.from('organizer_client_profiles').upsert({
      id: client.id,
      organizer_user_id: organizerUserId,
      client_name: client.clientName,
      client_email: client.clientEmail,
      client_phone: client.clientPhone,
      company: client.company || null,
      status: client.status,
      notes: client.notes || null,
      is_demo: false,
    });
    return { success: !error, error: error?.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// -------------------------------------------------------------
// 5. SLOT CONFLICT CHECK & BOOKINGS
// -------------------------------------------------------------
export async function checkSlotAvailability(
  vendorId: string,
  eventDate: string,
  slot: string = 'FULL_DAY'
): Promise<{ isAvailable: boolean; reason?: string; error?: string }> {
  if (!isSupabaseConfigured()) return { isAvailable: true };
  try {
    // Check vendor_availability table
    const { data: avail, error: availErr } = await supabase
      .from('vendor_availability')
      .select('status, slot')
      .eq('vendor_id', vendorId)
      .eq('availability_date', eventDate);

    if (availErr) {
      return {
        isAvailable: false,
        error: availErr.message,
        reason: "I couldn't verify that slot right now. Please try again.",
      };
    }

    if (avail && avail.length > 0) {
      const match = avail.find((a: any) => a.slot === slot || a.slot === 'FULL_DAY' || slot === 'FULL_DAY');
      if (match && (match.status === 'BOOKED' || match.status === 'UNAVAILABLE' || match.status === 'FULLY_BOOKED')) {
        return { isAvailable: false, reason: `Slot ${slot} on ${eventDate} is already reserved or booked.` };
      }
    }

    // Check confirmed bookings table
    const { data: existingBookings, error: bookErr } = await supabase
      .from('bookings')
      .select('id, status, slot')
      .eq('vendor_id', vendorId)
      .eq('event_date', eventDate)
      .in('status', ['CONFIRMED', 'PENDING_CONFIRMATION', 'IN_PROGRESS']);

    if (bookErr) {
      return {
        isAvailable: false,
        error: bookErr.message,
        reason: "I couldn't verify that slot right now. Please try again.",
      };
    }

    if (existingBookings && existingBookings.length > 0) {
      const conflict = existingBookings.find(
        (b: any) => b.slot === slot || b.slot === 'FULL_DAY' || slot === 'FULL_DAY'
      );
      if (conflict) {
        return { isAvailable: false, reason: `Vendor is already booked on ${eventDate} for slot: ${slot}.` };
      }
    }

    return { isAvailable: true };
  } catch (err: any) {
    return {
      isAvailable: false,
      error: err?.message || 'Database error',
      reason: "I couldn't verify that slot right now. Please try again.",
    };
  }
}

export async function createBookingWithConflictCheck({
  eventId,
  quotationId,
  vendorId,
  vendorServiceId,
  customerId,
  slot = 'FULL_DAY',
  agreedAmount,
  eventDate,
}: {
  eventId: string;
  quotationId?: string;
  vendorId: string;
  vendorServiceId?: string;
  customerId: string;
  slot?: string;
  agreedAmount: number;
  eventDate: string;
}): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  // 1. Conflict Check
  const check = await checkSlotAvailability(vendorId, eventDate, slot);
  if (!check.isAvailable) {
    return { success: false, error: check.reason || 'Conflict: Slot already booked.' };
  }

  try {
    // 2. Insert Booking
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        quotation_id: quotationId || null,
        vendor_id: vendorId,
        vendor_service_id: vendorServiceId || null,
        customer_id: customerId,
        slot,
        status: 'CONFIRMED',
        agreed_amount: agreedAmount,
        event_date: eventDate,
        is_demo: false,
      })
      .select('id')
      .single();

    if (bookingErr) {
      return { success: false, error: bookingErr.message };
    }

    // 3. Mark Slot as BOOKED in vendor_availability
    await supabase.from('vendor_availability').upsert({
      vendor_id: vendorId,
      availability_date: eventDate,
      slot,
      status: 'BOOKED',
    });

    return { success: true, bookingId: booking?.id };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to complete booking' };
  }
}

// -------------------------------------------------------------
// 6. REALTIME SUBSCRIPTION FOR CROSS-DEVICE SYNC
// -------------------------------------------------------------
export function subscribeToWedoraRealtime(
  onUpdate: (table: string, eventType: string, newRecord: any, oldRecord: any) => void
) {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('wedora_cross_device_sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      (payload) => {
        onUpdate(payload.table, payload.eventType, payload.new, payload.old);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// -------------------------------------------------------------
// 7. VENDOR SWAP AUDIT & PERSISTENCE
// -------------------------------------------------------------
export async function saveVendorSwapToSupabase({
  eventId,
  originalVendorId,
  originalVendorName,
  replacementVendorId,
  replacementVendorName,
  category,
  eventDate,
  slot = 'FULL_DAY',
}: {
  eventId: string;
  originalVendorId: string;
  originalVendorName: string;
  replacementVendorId: string;
  replacementVendorName: string;
  category: string;
  eventDate: string;
  slot?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    // 1. Backend Conflict Check before confirmation to prevent race conditions
    const conflict = await checkSlotAvailability(replacementVendorId, eventDate, slot);
    if (!conflict.isAvailable) {
      return {
        success: false,
        error: conflict.reason || `Conflict: Selected replacement vendor is already booked on ${eventDate}.`,
      };
    }

    // 2. Insert Timeline Task Record in Supabase for auditability and cross-device sync
    const { error: taskErr } = await supabase.from('timeline_tasks').insert({
      event_id: eventId,
      task_name: `Vendor Swap: Swapped ${originalVendorName} with ${replacementVendorName} (${category})`,
      deadline: eventDate,
      status: 'COMPLETED',
      is_demo: false,
    });

    if (taskErr) {
      console.warn('Failed to insert timeline task for swap:', taskErr.message);
    }

    // 3. Mark replacement vendor slot as BOOKED in Supabase vendor_availability
    await supabase.from('vendor_availability').upsert({
      vendor_id: replacementVendorId,
      availability_date: eventDate,
      slot: slot,
      status: 'BOOKED',
      event_name: `Swap for event ${eventId}`,
      client_name: 'Lead Planner Aditi Sharma',
      is_demo: false,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to persist vendor swap in Supabase' };
  }
}


