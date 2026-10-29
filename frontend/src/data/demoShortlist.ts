import { ShortlistItem } from '../types/shortlist';
import { DEMO_VENDORS } from './demoVendors';

const royalFeast = DEMO_VENDORS.find((v) => v.id === 'pun-cat-01')!;
const punyaBhumi = DEMO_VENDORS.find((v) => v.id === 'pun-org-01')!;

export const INITIAL_DEMO_SHORTLIST: ShortlistItem[] = [
  {
    id: 'shortlist-evt-01-pun-cat-01',
    eventId: 'evt-01',
    eventName: "Rohan & Priya's Wedding Celebration",
    vendorId: 'pun-cat-01',
    vendor: royalFeast,
    createdAt: '2026-10-15T11:00:00.000Z',
    customerBudget: 2500000,
  },
  {
    id: 'shortlist-evt-01-pun-org-01',
    eventId: 'evt-01',
    eventName: "Rohan & Priya's Wedding Celebration",
    vendorId: 'pun-org-01',
    vendor: punyaBhumi,
    createdAt: '2026-10-15T11:30:00.000Z',
    customerBudget: 2500000,
  },
];
