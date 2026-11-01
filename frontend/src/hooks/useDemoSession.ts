import { useState, useEffect, useCallback, useMemo } from 'react';
import { City, AvailabilityStatus, Vendor } from '../types/vendor';
import { WeddingEvent, TimelineTask } from '../types/event';
import { Inquiry, Quotation, Booking, SimulatedPayment } from '../types/booking';
import { ShortlistItem } from '../types/shortlist';
import { INITIAL_DEMO_EVENTS, INITIAL_TIMELINE_TASKS } from '../data/demoEvents';
import { INITIAL_INQUIRIES, INITIAL_QUOTATIONS, INITIAL_BOOKINGS, INITIAL_PAYMENTS } from '../data/demoBookings';
import { INITIAL_DEMO_SHORTLIST } from '../data/demoShortlist';
import { getSavedCity, saveCity } from '../utils/locationHelpers';
import { CalendarOverrides } from '../utils/vendorFilters';

export type UserRole = 'VENDOR' | 'PLANNER' | 'CUSTOMER';

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  vendorId?: string;
}

const STORAGE_KEYS = {
  SESSION: 'wedora_user_session',
  EVENTS: 'wedora_events',
  ACTIVE_EVENT_ID: 'wedora_active_event_id',
  INQUIRIES: 'wedora_inquiries',
  QUOTATIONS: 'wedora_quotations',
  BOOKINGS: 'wedora_bookings',
  PAYMENTS: 'wedora_payments',
  TIMELINE: 'wedora_timeline',
  CALENDAR_OVERRIDES: 'wedora_calendar_overrides',
  SHORTLIST: 'wedora_shortlist',
};

function loadStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveStored<T>(key: string, val: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent('wedora:session_sync', { detail: { key } }));
  }
}

export function useDemoSession() {
  const [session, setSessionState] = useState<UserSession>(() =>
    loadStored<UserSession>(STORAGE_KEYS.SESSION, {
      role: 'PLANNER',
      name: 'Aditi Sharma (Lead Planner)',
      email: 'planner@weddingorchestrator.com',
    })
  );

  const [city, setCityState] = useState<City>(() => getSavedCity());
  const [events, setEvents] = useState<WeddingEvent[]>(() => loadStored(STORAGE_KEYS.EVENTS, INITIAL_DEMO_EVENTS));
  const [activeEventId, setActiveEventIdState] = useState<string>(() => loadStored(STORAGE_KEYS.ACTIVE_EVENT_ID, 'evt-01'));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => loadStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadStored(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
  const [payments, setPayments] = useState<SimulatedPayment[]>(() => loadStored(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
  const [timelineTasks, setTimelineTasks] = useState<TimelineTask[]>(() => loadStored(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE_TASKS));
  const [calendarOverrides, setCalendarOverrides] = useState<CalendarOverrides>(() => loadStored(STORAGE_KEYS.CALENDAR_OVERRIDES, {}));
  const [shortlist, setShortlist] = useState<ShortlistItem[]>(() =>
    loadStored(STORAGE_KEYS.SHORTLIST, INITIAL_DEMO_SHORTLIST)
  );

  // Sync across tabs/windows
  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.key) {
        setEvents(loadStored(STORAGE_KEYS.EVENTS, INITIAL_DEMO_EVENTS));
        setInquiries(loadStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES));
        setQuotations(loadStored(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS));
        setBookings(loadStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
        setPayments(loadStored(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS));
        setTimelineTasks(loadStored(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE_TASKS));
        setCalendarOverrides(loadStored(STORAGE_KEYS.CALENDAR_OVERRIDES, {}));
        setShortlist(loadStored(STORAGE_KEYS.SHORTLIST, INITIAL_DEMO_SHORTLIST));
      }
    };
    const handleCitySync = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) setCityState(custom.detail);
    };

    window.addEventListener('wedora:session_sync', handleSync);
    window.addEventListener('wedora:city_changed', handleCitySync);
    return () => {
      window.removeEventListener('wedora:session_sync', handleSync);
      window.removeEventListener('wedora:city_changed', handleCitySync);
    };
  }, []);

  const changeCity = useCallback((newCity: City) => {
    setCityState(newCity);
    saveCity(newCity);
  }, []);

  const setActiveEventId = useCallback((id: string) => {
    setActiveEventIdState(id);
    saveStored(STORAGE_KEYS.ACTIVE_EVENT_ID, id);
  }, []);

  // Helper to check if an event belongs to the current user
  const isOwnerOfEvent = useCallback(
    (event: WeddingEvent, user: UserSession): boolean => {
      if (user.role === 'PLANNER' || user.role === 'VENDOR') return true;

      const userEmail = (user.email || '').toLowerCase().trim();
      const eventEmail = (event.clientEmail || '').toLowerCase().trim();
      const userName = (user.name || '').toLowerCase().trim();
      const eventOwnerName = (event.ownerName || '').toLowerCase().trim();

      // Rohil Kulkarni check (supports aliases: rohil@kulkarni.com, customer@weddingorchestrator.com, rohan.p@gmail.com)
      const isUserRohil =
        userEmail === 'rohil@kulkarni.com' ||
        userEmail === 'customer@weddingorchestrator.com' ||
        userEmail === 'rohan.p@gmail.com' ||
        userName.includes('rohil') ||
        userName.includes('rohan');

      const isEventRohil =
        eventEmail === 'rohil@kulkarni.com' ||
        eventEmail === 'customer@weddingorchestrator.com' ||
        eventEmail === 'rohan.p@gmail.com' ||
        eventOwnerName.includes('rohil') ||
        eventOwnerName.includes('rohan') ||
        event.id === 'evt-01';

      if (isUserRohil) {
        return isEventRohil;
      }

      // For Aniket Tribhavan and any new registered customer:
      // Strictly match userEmail or explicit ownerName. Never match Rohil's event!
      if (isEventRohil) return false;

      return (
        (Boolean(eventEmail) && eventEmail === userEmail) ||
        (Boolean(eventOwnerName) && eventOwnerName.includes(userName.split(' ')[0]))
      );
    },
    []
  );

  // Filtered customer events for the logged-in customer
  const customerEvents = useMemo(() => {
    if (session.role !== 'CUSTOMER') return events;
    return events.filter((e) => isOwnerOfEvent(e, session));
  }, [events, session, isOwnerOfEvent]);

  // Active event resolution:
  // If user is CUSTOMER:
  //   - If they have events, active event is their matched event.
  //   - If they have NO events (Aniket or New Customer), activeEvent is null.
  // If user is PLANNER:
  //   - Defaults to events.find(e => e.id === activeEventId) || events[0].
  const activeEvent = useMemo<WeddingEvent | null>(() => {
    if (session.role === 'CUSTOMER') {
      if (customerEvents.length === 0) return null;
      return customerEvents.find((e) => e.id === activeEventId) || customerEvents[0];
    }
    return events.find((e) => e.id === activeEventId) || events[0];
  }, [session.role, customerEvents, events, activeEventId]);

  const addEvent = useCallback(
    (eventData: Omit<WeddingEvent, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
      const newEvent: WeddingEvent = {
        ...eventData,
        id: eventData.id || `evt-${Date.now()}`,
        clientEmail: eventData.clientEmail || (session.role === 'CUSTOMER' ? session.email : undefined),
        ownerName: eventData.ownerName || session.name,
        ownerRole: eventData.ownerRole || session.role,
        createdAt: eventData.createdAt || new Date().toISOString(),
      };
      setEvents((prev) => {
        const next = [newEvent, ...prev];
        saveStored(STORAGE_KEYS.EVENTS, next);
        return next;
      });
      setActiveEventId(newEvent.id);
      return newEvent;
    },
    [setActiveEventId, session]
  );

  // Role Login helpers
  const loginAsRole = useCallback(
    (
      role: UserRole,
      customOption?: string | { name: string; email: string; vendorId?: string }
    ) => {
      let newSession: UserSession;
      if (role === 'VENDOR') {
        const vid = typeof customOption === 'string' ? customOption : customOption?.vendorId || 'pun-cat-01';
        newSession = {
          role: 'VENDOR',
          name: vid === 'pun-cat-01' ? 'Royal Feast Catering' : 'Heritage Rasoi Caterers',
          email: vid === 'pun-cat-01' ? 'vendor1@royalfeast.com' : 'vendor2@heritagerasoi.com',
          vendorId: vid,
        };
      } else if (role === 'PLANNER') {
        newSession = {
          role: 'PLANNER',
          name: 'Aditi Sharma (Lead Planner)',
          email: 'planner@weddingorchestrator.com',
        };
      } else {
        // CUSTOMER Role
        if (typeof customOption === 'object' && customOption.name && customOption.email) {
          newSession = {
            role: 'CUSTOMER',
            name: customOption.name,
            email: customOption.email,
          };
        } else if (customOption === 'aniket' || customOption === 'aniket@tribhavan.com') {
          newSession = {
            role: 'CUSTOMER',
            name: 'Aniket Tribhavan',
            email: 'aniket@tribhavan.com',
          };
        } else {
          // Rohil Kulkarni (Default Preserved Demo Profile)
          newSession = {
            role: 'CUSTOMER',
            name: 'Rohil Kulkarni (Groom)',
            email: 'rohil@kulkarni.com',
          };
        }
      }
      setSessionState(newSession);
      saveStored(STORAGE_KEYS.SESSION, newSession);
    },
    []
  );

  // Update vendor calendar availability (PRD Section 9 & Test H)
  const updateVendorAvailability = useCallback(
    (vendorId: string, date: string, status: AvailabilityStatus) => {
      setCalendarOverrides((prev) => {
        const next = {
          ...prev,
          [vendorId]: {
            ...(prev[vendorId] || {}),
            [date]: status,
          },
        };
        saveStored(STORAGE_KEYS.CALENDAR_OVERRIDES, next);
        return next;
      });
    },
    []
  );

  // Inquiries & Quotes Workflows
  const createInquiry = useCallback(
    (payload: {
      eventId: string;
      vendorId: string;
      vendorBusinessName: string;
      serviceCategory: string;
      requirements: string;
      guestCount?: number;
    }) => {
      const targetEvent = events.find((e) => e.id === payload.eventId) || activeEvent;
      const newInq: Inquiry = {
        id: `inq-${Date.now()}`,
        eventId: payload.eventId,
        eventName: targetEvent.eventName,
        vendorId: payload.vendorId,
        vendorBusinessName: payload.vendorBusinessName,
        serviceCategory: payload.serviceCategory,
        requesterName: session.name,
        requesterEmail: session.email,
        requesterRole: session.role,
        eventDate: targetEvent.eventDate,
        city: targetEvent.city,
        guestCount: payload.guestCount || targetEvent.guestCount,
        requirements: payload.requirements,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      setInquiries((prev) => {
        const next = [newInq, ...prev];
        saveStored(STORAGE_KEYS.INQUIRIES, next);
        return next;
      });
      return newInq;
    },
    [events, activeEvent, session]
  );

  const createQuotation = useCallback(
    (payload: {
      inquiryId: string;
      vendorId: string;
      vendorBusinessName: string;
      quotedAmount: number;
      serviceScope: string;
      includedServices: string[];
      additionalCharges?: number;
    }) => {
      const newQuote: Quotation = {
        id: `quot-${Date.now()}`,
        inquiryId: payload.inquiryId,
        vendorId: payload.vendorId,
        vendorBusinessName: payload.vendorBusinessName,
        quotedAmount: payload.quotedAmount,
        serviceScope: payload.serviceScope,
        includedServices: payload.includedServices,
        additionalCharges: payload.additionalCharges || 0,
        validDays: 14,
        paymentTerms: '50% booking advance, 50% post service handover.',
        status: 'SENT',
        createdAt: new Date().toISOString(),
      };

      setQuotations((prev) => {
        const next = [newQuote, ...prev];
        saveStored(STORAGE_KEYS.QUOTATIONS, next);
        return next;
      });

      // Update inquiry status
      setInquiries((prev) => {
        const next = prev.map((inq) =>
          inq.id === payload.inquiryId ? { ...inq, status: 'QUOTED' as const } : inq
        );
        saveStored(STORAGE_KEYS.INQUIRIES, next);
        return next;
      });

      return newQuote;
    },
    []
  );

  const acceptQuotationAndBook = useCallback(
    (quotationId: string) => {
      const quote = quotations.find((q) => q.id === quotationId);
      if (!quote) throw new Error('Quotation not found');

      const matchingInq = inquiries.find((i) => i.id === quote.inquiryId);
      const targetEvent = matchingInq ? events.find((e) => e.id === matchingInq.eventId) : activeEvent;

      // Update quote status
      setQuotations((prev) => {
        const next = prev.map((q) => (q.id === quotationId ? { ...q, status: 'BOOKED' as const } : q));
        saveStored(STORAGE_KEYS.QUOTATIONS, next);
        return next;
      });

      // Create confirmed booking
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        quotationId,
        eventId: targetEvent?.id || 'evt-01',
        eventName: targetEvent?.eventName || 'Wedding Celebration',
        vendorId: quote.vendorId,
        vendorBusinessName: quote.vendorBusinessName,
        serviceCategory: matchingInq?.serviceCategory || 'Vendor Service',
        eventDate: targetEvent?.eventDate || '2026-12-15',
        agreedAmount: quote.quotedAmount + (quote.additionalCharges || 0),
        paidAmount: 0,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      setBookings((prev) => {
        const next = [newBooking, ...prev];
        saveStored(STORAGE_KEYS.BOOKINGS, next);
        return next;
      });

      // Reserve vendor calendar date
      updateVendorAvailability(quote.vendorId, newBooking.eventDate, 'Fully Booked');

      // Add linked timeline task
      const newTask: TimelineTask = {
        id: `task-${Date.now()}`,
        eventId: newBooking.eventId,
        taskName: `Coordinate with ${quote.vendorBusinessName} (${newBooking.serviceCategory})`,
        deadline: newBooking.eventDate,
        status: 'IN_PROGRESS',
        assignedVendorId: quote.vendorId,
        assignedVendorName: quote.vendorBusinessName,
      };

      setTimelineTasks((prev) => {
        const next = [newTask, ...prev];
        saveStored(STORAGE_KEYS.TIMELINE, next);
        return next;
      });

      return newBooking;
    },
    [quotations, inquiries, events, activeEvent, updateVendorAvailability]
  );

  // Simulated Payment
  const recordSimulatedPayment = useCallback(
    (payload: {
      bookingId?: string;
      eventId: string;
      amount: number;
      payeeName: string;
      purpose?: string;
    }) => {
      const targetEvent = events.find((e) => e.id === payload.eventId) || activeEvent;
      const newPmt: SimulatedPayment = {
        id: `pmt-${Date.now()}`,
        transactionRef: `SIM-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        bookingId: payload.bookingId,
        eventId: payload.eventId,
        eventName: targetEvent.eventName,
        payerName: session.name,
        payeeName: payload.payeeName,
        amount: payload.amount,
        paymentPurpose: payload.purpose || 'Vendor Milestone Payment (Simulated)',
        status: 'PAID',
        isSimulated: true,
        createdAt: new Date().toISOString(),
      };

      setPayments((prev) => {
        const next = [newPmt, ...prev];
        saveStored(STORAGE_KEYS.PAYMENTS, next);
        return next;
      });

      // Update paid amount on booking if provided
      if (payload.bookingId) {
        setBookings((prev) => {
          const next = prev.map((b) =>
            b.id === payload.bookingId ? { ...b, paidAmount: (b.paidAmount || 0) + payload.amount } : b
          );
          saveStored(STORAGE_KEYS.BOOKINGS, next);
          return next;
        });
      }

      return newPmt;
    },
    [events, activeEvent, session]
  );

  // Timeline Tasks
  const addTimelineTask = useCallback(
    (taskName: string, category?: string, deadline?: string) => {
      const newTask: TimelineTask = {
        id: `task-${Date.now()}`,
        eventId: activeEvent.id,
        taskName,
        category,
        deadline: deadline || activeEvent.eventDate,
        status: 'PENDING',
      };
      setTimelineTasks((prev) => {
        const next = [newTask, ...prev];
        saveStored(STORAGE_KEYS.TIMELINE, next);
        return next;
      });
      return newTask;
    },
    [activeEvent]
  );

  const toggleTimelineTask = useCallback((taskId: string) => {
    setTimelineTasks((prev) => {
      const next = prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? ('PENDING' as const) : ('COMPLETED' as const) }
          : t
      );
      saveStored(STORAGE_KEYS.TIMELINE, next);
      return next;
    });
  }, []);

  // Shortlist Management (Version 3.0 Sections 7, 8, 9, 10)
  const addToShortlist = useCallback(
    (vendor: Vendor, eventId?: string, customerBudget?: number) => {
      const targetEvent = events.find((e) => e.id === (eventId || activeEventId)) || activeEvent;
      setShortlist((prev) => {
        const exists = prev.some(
          (item) => item.vendorId === vendor.id && item.eventId === targetEvent.id
        );
        if (exists) return prev;
        const newItem: ShortlistItem = {
          id: `shortlist-${targetEvent.id}-${vendor.id}`,
          eventId: targetEvent.id,
          eventName: targetEvent.eventName,
          vendorId: vendor.id,
          vendor,
          createdAt: new Date().toISOString(),
          customerBudget: customerBudget || targetEvent.estimatedBudget,
        };
        const next = [newItem, ...prev];
        saveStored(STORAGE_KEYS.SHORTLIST, next);
        return next;
      });
    },
    [events, activeEventId, activeEvent]
  );

  const removeFromShortlist = useCallback(
    (vendorId: string, eventId?: string) => {
      const targetEventId = eventId || activeEventId;
      setShortlist((prev) => {
        const next = prev.filter(
          (item) =>
            !(item.vendorId === vendorId && (!targetEventId || item.eventId === targetEventId))
        );
        saveStored(STORAGE_KEYS.SHORTLIST, next);
        return next;
      });
    },
    [activeEventId]
  );

  const isShortlisted = useCallback(
    (vendorId: string, eventId?: string): boolean => {
      const targetEventId = eventId || activeEventId;
      return shortlist.some(
        (item) => item.vendorId === vendorId && item.eventId === targetEventId
      );
    },
    [shortlist, activeEventId]
  );

  const toggleShortlist = useCallback(
    (vendor: Vendor, eventId?: string, customerBudget?: number) => {
      const targetEventId = eventId || activeEventId;
      const alreadySaved = shortlist.some(
        (item) => item.vendorId === vendor.id && item.eventId === targetEventId
      );
      if (alreadySaved) {
        removeFromShortlist(vendor.id, targetEventId);
      } else {
        addToShortlist(vendor, targetEventId, customerBudget);
      }
    },
    [shortlist, activeEventId, removeFromShortlist, addToShortlist]
  );

  return {
    session,
    city,
    changeCity,
    events,
    customerEvents,
    activeEvent,
    activeEventId,
    setActiveEventId,
    addEvent,
    inquiries,
    quotations,
    bookings,
    payments,
    timelineTasks,
    calendarOverrides,
    shortlist,
    addToShortlist,
    removeFromShortlist,
    isShortlisted,
    toggleShortlist,
    loginAsRole,
    updateVendorAvailability,
    createInquiry,
    createQuotation,
    acceptQuotationAndBook,
    recordSimulatedPayment,
    addTimelineTask,
    toggleTimelineTask,
  };
}
