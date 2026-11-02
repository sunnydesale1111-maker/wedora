import { useState, useEffect, useCallback, useMemo } from 'react';
import { City, AvailabilityStatus, Vendor } from '../types/vendor';
import { WeddingEvent, TimelineTask } from '../types/event';
import { Inquiry, Quotation, Booking, SimulatedPayment } from '../types/booking';
import { ShortlistItem } from '../types/shortlist';
import {
  CustomerProfile,
  OrganizerClientProfile,
  DEFAULT_PRIMARY_PERMISSIONS,
  DEFAULT_FAMILY_PERMISSIONS,
  MAX_ADDITIONAL_FAMILY_PROFILES,
} from '../types/profile';
import { INITIAL_DEMO_EVENTS, INITIAL_TIMELINE_TASKS } from '../data/demoEvents';
import { INITIAL_INQUIRIES, INITIAL_QUOTATIONS, INITIAL_BOOKINGS, INITIAL_PAYMENTS } from '../data/demoBookings';
import { INITIAL_DEMO_SHORTLIST } from '../data/demoShortlist';
import {
  INITIAL_DEMO_CUSTOMER_PROFILES,
  INITIAL_DEMO_ORGANIZER_CLIENTS,
} from '../data/demoProfiles';
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
  CUSTOMER_PROFILES: 'wedora_customer_profiles',
  ACTIVE_PROFILE_ID: 'wedora_active_profile_id',
  ORGANIZER_CLIENTS: 'wedora_organizer_clients',
  ACTIVE_CLIENT_ID: 'wedora_active_client_id',
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

  // Part A: Customer Multiple Profiles State
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>(() =>
    loadStored(STORAGE_KEYS.CUSTOMER_PROFILES, INITIAL_DEMO_CUSTOMER_PROFILES)
  );
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() =>
    loadStored(STORAGE_KEYS.ACTIVE_PROFILE_ID, 'prof-rohan-primary')
  );

  // Part B: Organizer Multiple Client Profiles State
  const [organizerClients, setOrganizerClients] = useState<OrganizerClientProfile[]>(() =>
    loadStored(STORAGE_KEYS.ORGANIZER_CLIENTS, INITIAL_DEMO_ORGANIZER_CLIENTS)
  );
  const [activeClientId, setActiveClientIdState] = useState<string>(() =>
    loadStored(STORAGE_KEYS.ACTIVE_CLIENT_ID, 'client-01')
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
        setCustomerProfiles(loadStored(STORAGE_KEYS.CUSTOMER_PROFILES, INITIAL_DEMO_CUSTOMER_PROFILES));
        setOrganizerClients(loadStored(STORAGE_KEYS.ORGANIZER_CLIENTS, INITIAL_DEMO_ORGANIZER_CLIENTS));
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

      // Rohan Kulkarni check (supports aliases: rohil@kulkarni.com, customer@weddingorchestrator.com, rohan.p@gmail.com)
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
      // Strictly match userEmail or explicit ownerName. Never match Rohan's event!
      if (isEventRohil) return false;

      return (
        (Boolean(eventEmail) && eventEmail === userEmail) ||
        (Boolean(eventOwnerName) && eventOwnerName.includes(userName.split(' ')[0]))
      );
    },
    []
  );

  // Active customer profiles accessible to the currently logged in customer
  const activeCustomerProfiles = useMemo<CustomerProfile[]>(() => {
    if (session.role !== 'CUSTOMER') return [];

    const userEmail = (session.email || '').toLowerCase().trim();
    const isUserRohil =
      userEmail === 'rohil@kulkarni.com' ||
      userEmail === 'customer@weddingorchestrator.com' ||
      userEmail === 'rohan.p@gmail.com' ||
      session.name.toLowerCase().includes('rohil') ||
      session.name.toLowerCase().includes('rohan');

    if (isUserRohil) {
      // Rohan's primary and family profiles
      return customerProfiles.filter(
        (p) =>
          p.primaryUserId === 'rohil@kulkarni.com' ||
          p.email === 'rohil@kulkarni.com' ||
          p.email === userEmail
      );
    }

    // For Aniket Tribhavan or other new customers
    const userProfiles = customerProfiles.filter(
      (p) => p.primaryUserId === userEmail || p.email === userEmail
    );

    if (userProfiles.length === 0) {
      // Auto-generate primary profile for new registered customer
      const defaultPrimary: CustomerProfile = {
        id: `prof-${userEmail.replace(/[^a-zA-Z0-9]/g, '-')}-primary`,
        primaryUserId: userEmail,
        name: session.name || 'Primary Account',
        email: userEmail,
        relationship: 'Primary Account Holder',
        avatar: 'avatar-1',
        role: 'PRIMARY',
        permissions: DEFAULT_PRIMARY_PERMISSIONS,
        sharedEventIds: [],
        createdAt: new Date().toISOString(),
      };
      return [defaultPrimary];
    }

    return userProfiles;
  }, [session, customerProfiles]);

  // Active Customer Profile Resolution
  const activeCustomerProfile = useMemo<CustomerProfile | null>(() => {
    if (session.role !== 'CUSTOMER') return null;
    const profiles = activeCustomerProfiles;
    if (profiles.length === 0) return null;
    return profiles.find((p) => p.id === activeProfileId) || profiles[0];
  }, [session.role, activeCustomerProfiles, activeProfileId]);

  // Filtered customer events for the logged-in customer and active profile
  const customerEvents = useMemo(() => {
    if (session.role !== 'CUSTOMER') return events;
    const owned = events.filter((e) => isOwnerOfEvent(e, session));

    // If active profile is a FAMILY_MEMBER, strictly restrict to sharedEventIds!
    if (activeCustomerProfile && activeCustomerProfile.role === 'FAMILY_MEMBER') {
      const allowedIds = activeCustomerProfile.sharedEventIds || [];
      return owned.filter((e) => allowedIds.includes(e.id));
    }

    return owned;
  }, [events, session, isOwnerOfEvent, activeCustomerProfile]);

  // Active event resolution:
  const activeEvent = useMemo<WeddingEvent | null>(() => {
    if (session.role === 'CUSTOMER') {
      if (customerEvents.length === 0) return null;
      return customerEvents.find((e) => e.id === activeEventId) || customerEvents[0];
    }
    return events.find((e) => e.id === activeEventId) || events[0];
  }, [session.role, customerEvents, events, activeEventId]);

  // Role Permissions
  const isFamilyMember = activeCustomerProfile?.role === 'FAMILY_MEMBER';
  const canMakeBookings =
    session.role === 'PLANNER' ||
    (session.role === 'CUSTOMER' && activeCustomerProfile?.permissions.canMakeBookings !== false);
  const canManagePayments =
    session.role === 'PLANNER' ||
    (session.role === 'CUSTOMER' && activeCustomerProfile?.permissions.canManagePayments !== false);
  const canModifyEvents =
    session.role === 'PLANNER' ||
    (session.role === 'CUSTOMER' && activeCustomerProfile?.permissions.canManageEvents !== false);
  const canModifyBudgets =
    session.role === 'PLANNER' ||
    (session.role === 'CUSTOMER' && activeCustomerProfile?.permissions.canModifyBudgets !== false);
  const canUpdateTasks =
    session.role === 'PLANNER' ||
    (session.role === 'CUSTOMER' && activeCustomerProfile?.permissions.canUpdateTasks !== false);
  const canManageProfiles =
    session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'PRIMARY';

  // --- Customer Profile Management Methods ---
  const addFamilyProfile = useCallback(
    (payload: {
      name: string;
      email: string;
      relationship?: string;
      avatar?: string;
      canViewBudget?: boolean;
      sharedEventIds?: string[];
    }) => {
      if (session.role !== 'CUSTOMER' || activeCustomerProfile?.role !== 'PRIMARY') {
        throw new Error('Only the primary account holder can add family profiles.');
      }

      const userEmail = (session.email || '').toLowerCase().trim();
      const existingFamily = customerProfiles.filter(
        (p) =>
          (p.primaryUserId === userEmail ||
            (userEmail.includes('rohil') && p.primaryUserId.includes('kulkarni'))) &&
          p.role === 'FAMILY_MEMBER'
      );

      // Acceptance Criteria: Up to 5 additional family profiles; 6th is strictly blocked!
      if (existingFamily.length >= MAX_ADDITIONAL_FAMILY_PROFILES) {
        throw new Error(
          `A primary customer account can have up to ${MAX_ADDITIONAL_FAMILY_PROFILES} additional family profiles (maximum reached).`
        );
      }

      const newProfile: CustomerProfile = {
        id: `fam-${Date.now()}`,
        primaryUserId: userEmail,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        relationship: payload.relationship || 'Family Member',
        avatar: payload.avatar || `avatar-${(existingFamily.length % 5) + 2}`,
        role: 'FAMILY_MEMBER',
        permissions: {
          ...DEFAULT_FAMILY_PERMISSIONS,
          canViewBudgets: payload.canViewBudget ?? true,
        },
        sharedEventIds:
          payload.sharedEventIds && payload.sharedEventIds.length > 0
            ? payload.sharedEventIds
            : customerEvents.map((e) => e.id),
        createdAt: new Date().toISOString(),
      };

      setCustomerProfiles((prev) => {
        const next = [...prev, newProfile];
        saveStored(STORAGE_KEYS.CUSTOMER_PROFILES, next);
        return next;
      });

      return newProfile;
    },
    [session, activeCustomerProfile, customerProfiles, customerEvents]
  );

  const updateFamilyProfile = useCallback(
    (id: string, updates: Partial<CustomerProfile>) => {
      if (session.role !== 'CUSTOMER' || activeCustomerProfile?.role !== 'PRIMARY') {
        throw new Error('Only the primary account holder can edit family profiles.');
      }
      setCustomerProfiles((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        saveStored(STORAGE_KEYS.CUSTOMER_PROFILES, next);
        return next;
      });
    },
    [session, activeCustomerProfile]
  );

  const deleteFamilyProfile = useCallback(
    (id: string) => {
      if (session.role !== 'CUSTOMER' || activeCustomerProfile?.role !== 'PRIMARY') {
        throw new Error('Only the primary account holder can remove family profiles.');
      }
      const target = customerProfiles.find((p) => p.id === id);
      if (!target) return;
      if (target.role === 'PRIMARY') {
        throw new Error('Cannot remove the primary account holder profile.');
      }

      setCustomerProfiles((prev) => {
        const next = prev.filter((p) => p.id !== id);
        saveStored(STORAGE_KEYS.CUSTOMER_PROFILES, next);
        return next;
      });

      if (activeProfileId === id) {
        const primary = activeCustomerProfiles.find((p) => p.role === 'PRIMARY');
        if (primary) {
          setActiveProfileIdState(primary.id);
          saveStored(STORAGE_KEYS.ACTIVE_PROFILE_ID, primary.id);
        }
      }
    },
    [session, activeCustomerProfile, customerProfiles, activeProfileId, activeCustomerProfiles]
  );

  const switchCustomerProfile = useCallback((id: string) => {
    setActiveProfileIdState(id);
    saveStored(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
  }, []);

  // --- Organizer Client Profiles State & Methods ---
  const activeClient = useMemo<OrganizerClientProfile | null>(() => {
    if (session.role !== 'PLANNER') return null;
    return organizerClients.find((c) => c.id === activeClientId) || organizerClients[0] || null;
  }, [session.role, organizerClients, activeClientId]);

  const setActiveClientId = useCallback(
    (clientId: string) => {
      setActiveClientIdState(clientId);
      saveStored(STORAGE_KEYS.ACTIVE_CLIENT_ID, clientId);

      // Contextual switch: when client profile changes, automatically switch activeEventId
      const client = organizerClients.find((c) => c.id === clientId);
      if (client && client.eventIds.length > 0) {
        const matchingEvent = events.find((e) => client.eventIds.includes(e.id));
        if (matchingEvent) {
          setActiveEventId(matchingEvent.id);
        }
      }
    },
    [organizerClients, events, setActiveEventId]
  );

  const addOrganizerClient = useCallback(
    (clientData: {
      clientName: string;
      clientEmail: string;
      clientPhone?: string;
      company?: string;
      notes?: string;
      initialEvent?: Omit<WeddingEvent, 'id' | 'createdAt'>;
    }) => {
      const newClientId = `client-${Date.now()}`;
      let createdEventId: string | undefined;

      if (clientData.initialEvent) {
        const newEvent: WeddingEvent = {
          ...clientData.initialEvent,
          id: `evt-${Date.now()}`,
          clientName: clientData.clientName,
          clientEmail: clientData.clientEmail,
          clientPhone: clientData.clientPhone,
          ownerName: session.name,
          ownerRole: 'PLANNER',
          createdAt: new Date().toISOString(),
        };
        setEvents((prev) => {
          const next = [newEvent, ...prev];
          saveStored(STORAGE_KEYS.EVENTS, next);
          return next;
        });
        createdEventId = newEvent.id;
        setActiveEventId(newEvent.id);
      }

      const newClient: OrganizerClientProfile = {
        id: newClientId,
        organizerUserId: session.email,
        clientName: clientData.clientName.trim(),
        clientEmail: clientData.clientEmail.trim().toLowerCase(),
        clientPhone: clientData.clientPhone || '',
        company: clientData.company,
        notes: clientData.notes,
        status: 'ACTIVE',
        eventIds: createdEventId ? [createdEventId] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOrganizerClients((prev) => {
        const next = [newClient, ...prev];
        saveStored(STORAGE_KEYS.ORGANIZER_CLIENTS, next);
        return next;
      });

      setActiveClientIdState(newClientId);
      saveStored(STORAGE_KEYS.ACTIVE_CLIENT_ID, newClientId);
      return newClient;
    },
    [session, setActiveEventId]
  );

  const updateOrganizerClient = useCallback(
    (id: string, updates: Partial<OrganizerClientProfile>) => {
      setOrganizerClients((prev) => {
        const next = prev.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        );
        saveStored(STORAGE_KEYS.ORGANIZER_CLIENTS, next);
        return next;
      });
    },
    []
  );

  const archiveOrganizerClient = useCallback((id: string) => {
    setOrganizerClients((prev) => {
      const next = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: (c.status === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED') as 'ACTIVE' | 'ARCHIVED',
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      saveStored(STORAGE_KEYS.ORGANIZER_CLIENTS, next);
      return next;
    });
  }, []);

  const createClientEvent = useCallback(
    (clientId: string, eventData: Omit<WeddingEvent, 'id' | 'createdAt'>) => {
      const targetClient = organizerClients.find((c) => c.id === clientId);
      if (!targetClient) throw new Error('Client profile not found');

      const newEvent: WeddingEvent = {
        ...eventData,
        id: `evt-${Date.now()}`,
        clientName: targetClient.clientName,
        clientEmail: targetClient.clientEmail,
        clientPhone: targetClient.clientPhone,
        ownerName: session.name,
        ownerRole: 'PLANNER',
        createdAt: new Date().toISOString(),
      };

      setEvents((prev) => {
        const next = [newEvent, ...prev];
        saveStored(STORAGE_KEYS.EVENTS, next);
        return next;
      });

      setOrganizerClients((prev) => {
        const next = prev.map((c) =>
          c.id === clientId ? { ...c, eventIds: [...c.eventIds, newEvent.id] } : c
        );
        saveStored(STORAGE_KEYS.ORGANIZER_CLIENTS, next);
        return next;
      });

      setActiveEventId(newEvent.id);
      return newEvent;
    },
    [organizerClients, session, setActiveEventId]
  );

  const addEvent = useCallback(
    (eventData: Omit<WeddingEvent, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot create or modify events.');
      }

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
    [setActiveEventId, session, activeCustomerProfile]
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
          // Rohan Kulkarni (Default Preserved Demo Profile)
          newSession = {
            role: 'CUSTOMER',
            name: 'Rohan Kulkarni',
            email: 'rohil@kulkarni.com',
          };
        }
      }
      setSessionState(newSession);
      saveStored(STORAGE_KEYS.SESSION, newSession);

      // Reset active profile on login to primary
      if (role === 'CUSTOMER') {
        const primaryId =
          newSession.email === 'rohil@kulkarni.com'
            ? 'prof-rohan-primary'
            : `prof-${newSession.email.replace(/[^a-zA-Z0-9]/g, '-')}-primary`;
        setActiveProfileIdState(primaryId);
        saveStored(STORAGE_KEYS.ACTIVE_PROFILE_ID, primaryId);
      }
    },
    []
  );

  // Update vendor calendar availability
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
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot send vendor inquiries.');
      }

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
    [events, activeEvent, session, activeCustomerProfile]
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
      // Permission guard: family members cannot make bookings!
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot confirm bookings.');
      }

      const quote = quotations.find((q) => q.id === quotationId);
      if (!quote) throw new Error('Quotation not found');

      const matchingInq = inquiries.find((i) => i.id === quote.inquiryId);
      const targetEvent = matchingInq ? events.find((e) => e.id === matchingInq.eventId) : activeEvent;

      setQuotations((prev) => {
        const next = prev.map((q) => (q.id === quotationId ? { ...q, status: 'BOOKED' as const } : q));
        saveStored(STORAGE_KEYS.QUOTATIONS, next);
        return next;
      });

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

      updateVendorAvailability(quote.vendorId, newBooking.eventDate, 'Fully Booked');

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
    [quotations, inquiries, events, activeEvent, updateVendorAvailability, session.role, activeCustomerProfile]
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
      // Permission guard: family members cannot manage payments!
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot make payments.');
      }

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
    [events, activeEvent, session, activeCustomerProfile]
  );

  // Timeline Tasks
  const addTimelineTask = useCallback(
    (taskName: string, category?: string, deadline?: string) => {
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot modify timeline tasks.');
      }

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
    [activeEvent, session.role, activeCustomerProfile]
  );

  const toggleTimelineTask = useCallback(
    (taskId: string) => {
      if (session.role === 'CUSTOMER' && activeCustomerProfile?.role === 'FAMILY_MEMBER') {
        throw new Error('Family members have view-only access and cannot update tasks.');
      }

      setTimelineTasks((prev) => {
        const next = prev.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === 'COMPLETED' ? ('PENDING' as const) : ('COMPLETED' as const) }
            : t
        );
        saveStored(STORAGE_KEYS.TIMELINE, next);
        return next;
      });
    },
    [session.role, activeCustomerProfile]
  );

  // Shortlist Management
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

    // Part A: Customer Profiles & Permissions
    customerProfiles,
    activeCustomerProfiles,
    activeProfileId,
    activeCustomerProfile,
    isFamilyMember,
    canMakeBookings,
    canManagePayments,
    canModifyEvents,
    canModifyBudgets,
    canUpdateTasks,
    canManageProfiles,
    addFamilyProfile,
    updateFamilyProfile,
    deleteFamilyProfile,
    switchCustomerProfile,

    // Part B: Organizer Client Profiles
    organizerClients,
    activeClientId,
    activeClient,
    addOrganizerClient,
    updateOrganizerClient,
    archiveOrganizerClient,
    setActiveClientId,
    createClientEvent,
  };
}
