import { City } from './vendor';

export interface EventParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'PRIMARY' | 'CO_HOST' | 'FAMILY_MEMBER' | 'GUEST';
  relationship?: string; // e.g. "Primary Client", "Bride", "Groom", "Family Member"
  avatar?: string;
  isPrimary?: boolean; // Required primary participant (cannot be removed by organizer)
  status: 'ACCEPTED' | 'PENDING';
  invitedAt?: string;
  acceptedAt?: string;
  canEdit?: boolean; // false = view-only for invited
}

export interface WeddingEvent {
  id: string;
  eventName: string;
  eventType: string; // e.g. "Traditional Hindu Wedding & Reception", "Sangeet & Cocktail", "Destination Wedding"
  eventDate: string; // YYYY-MM-DD
  city: City;
  area: string;
  venueName?: string;
  venueAddress?: string;
  venueStatus?: 'FINALIZED' | 'NOT_FINALIZED';
  isVenueProvisional?: boolean;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  guestCount: number;
  originalBudget?: number;
  estimatedBudget: number;
  description?: string;
  requirements?: string[];
  ownerRole: 'PLANNER' | 'CUSTOMER';
  ownerName: string;
  createdAt: string;
  participants?: EventParticipant[];
}

export interface TimelineTask {
  id: string;
  eventId: string;
  taskName: string;
  category?: string;
  deadline: string;
  assignedVendorId?: string;
  assignedVendorName?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
