export type InquiryStatus = 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'DECLINED';
export type QuotationStatus = 'SENT' | 'ACCEPTED' | 'REJECTED' | 'BOOKED';
export type BookingStatus = 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Inquiry {
  id: string;
  eventId: string;
  eventName: string;
  vendorId: string;
  vendorBusinessName: string;
  serviceCategory: string;
  requesterName: string;
  requesterEmail: string;
  requesterRole: 'PLANNER' | 'CUSTOMER';
  eventDate: string;
  city: string;
  guestCount: number;
  requirements: string;
  status: InquiryStatus;
  createdAt: string;
  quotation?: Quotation;
}

export interface Quotation {
  id: string;
  inquiryId: string;
  vendorId: string;
  vendorBusinessName: string;
  quotedAmount: number;
  serviceScope: string;
  includedServices: string[];
  additionalCharges?: number;
  validDays: number;
  paymentTerms: string;
  status: QuotationStatus;
  createdAt: string;
}

export interface Booking {
  id: string;
  quotationId: string;
  eventId: string;
  eventName: string;
  vendorId: string;
  vendorBusinessName: string;
  serviceCategory: string;
  eventDate: string;
  agreedAmount: number;
  paidAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export interface SimulatedPayment {
  id: string;
  transactionRef: string;
  bookingId?: string;
  eventId: string;
  eventName: string;
  payerName: string;
  payeeName: string;
  amount: number;
  paymentPurpose: string;
  status: 'PAID' | 'FAILED' | 'PENDING';
  isSimulated: true;
  createdAt: string;
}
