import { CustomerProfile, OrganizerClientProfile, DEFAULT_PRIMARY_PERMISSIONS, DEFAULT_FAMILY_PERMISSIONS } from '../types/profile';

/**
 * Initial Demo Customer Profiles
 * Preserves Rohan Kulkarni's demo celebration and provides isolated profile management.
 */
export const INITIAL_DEMO_CUSTOMER_PROFILES: CustomerProfile[] = [
  {
    id: 'prof-rohan-primary',
    primaryUserId: 'rohil@kulkarni.com',
    name: 'Rohan Kulkarni',
    email: 'rohil@kulkarni.com',
    relationship: 'Primary Account Holder',
    avatar: 'avatar-1',
    role: 'PRIMARY',
    permissions: DEFAULT_PRIMARY_PERMISSIONS,
    sharedEventIds: ['evt-01'],
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'prof-rohan-family-1',
    primaryUserId: 'rohil@kulkarni.com',
    name: 'Sunita Kulkarni',
    email: 'sunita.kulkarni@gmail.com',
    relationship: 'Mother of the Groom',
    avatar: 'avatar-2',
    role: 'FAMILY_MEMBER',
    permissions: DEFAULT_FAMILY_PERMISSIONS,
    sharedEventIds: ['evt-01'],
    createdAt: '2026-10-02T11:00:00.000Z',
  },
];

/**
 * Initial Demo Organizer Client Profiles (Aditi Sharma - Lead Planner)
 * Part B: Client Profile A (Wedding), Client Profile B (Birthday/Destination), Client Profile C (Corporate)
 */
export const INITIAL_DEMO_ORGANIZER_CLIENTS: OrganizerClientProfile[] = [
  {
    id: 'client-01',
    organizerUserId: 'planner@weddingorchestrator.com',
    clientName: 'Aditya Merchant & Sanjana Shah',
    clientEmail: 'aditya.merchant@enterprise.in',
    clientPhone: '+91 98201 12345',
    company: 'Merchant Enterprises',
    status: 'ACTIVE',
    notes: 'Royal oceanfront wedding ceremony and grand sangeet gala in Bandra, Mumbai.',
    eventIds: ['evt-02'],
    createdAt: '2026-10-05T12:00:00.000Z',
    updatedAt: '2026-10-05T12:00:00.000Z',
  },
  {
    id: 'client-02',
    organizerUserId: 'planner@weddingorchestrator.com',
    clientName: 'Karan Joshi & Meera Patil',
    clientEmail: 'karan.joshi@techcorp.com',
    clientPhone: '+91 98902 34567',
    company: 'Joshi Family',
    status: 'ACTIVE',
    notes: 'Hillside destination open lawn wedding celebration in Kothrud, Pune.',
    eventIds: ['evt-03'],
    createdAt: '2026-10-10T15:30:00.000Z',
    updatedAt: '2026-10-10T15:30:00.000Z',
  },
  {
    id: 'client-03',
    organizerUserId: 'planner@weddingorchestrator.com',
    clientName: 'Pooja Malhotra (Milestone Birthday)',
    clientEmail: 'pooja.m@lifestyle.in',
    clientPhone: '+91 98202 33445',
    company: 'Malhotra Family',
    status: 'ACTIVE',
    notes: 'Grand 30th Birthday Celebration & Musical Evening at Juhu Beach Lawns.',
    eventIds: ['evt-04-birthday'],
    createdAt: '2026-10-15T10:00:00.000Z',
    updatedAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'client-04',
    organizerUserId: 'planner@weddingorchestrator.com',
    clientName: 'TechCorp India Executive Summit',
    clientEmail: 'events@techcorp.in',
    clientPhone: '+91 98200 88990',
    company: 'TechCorp India Ltd',
    status: 'ACTIVE',
    notes: 'Annual Leadership Summit, stage presentation, and executive dinner in BKC Mumbai.',
    eventIds: ['evt-05-corporate'],
    createdAt: '2026-10-18T14:00:00.000Z',
    updatedAt: '2026-10-18T14:00:00.000Z',
  },
];

