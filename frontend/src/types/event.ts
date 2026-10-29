import { City } from './vendor';

export interface WeddingEvent {
  id: string;
  eventName: string;
  eventType: string; // e.g. "Traditional Hindu Wedding & Reception", "Sangeet & Cocktail", "Destination Wedding"
  eventDate: string; // YYYY-MM-DD
  city: City;
  area: string;
  guestCount: number;
  estimatedBudget: number;
  description?: string;
  ownerRole: 'PLANNER' | 'CUSTOMER';
  ownerName: string;
  createdAt: string;
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
