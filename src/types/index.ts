
export type UserRole = 'customer' | 'organizer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  referralCode: string;
  points: number;
  pointsExpiry?: Date;
  createdAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  location: string;
  category: string;
  startDate: Date;
  endDate: Date;
  price: number;
  totalSeats: number;
  availableSeats: number;
  isFree: boolean;
  image?: string;
  createdAt: Date;
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  price: number;
  availableSeats: number;
}

export type TransactionStatus = 'waiting_for_payment' | 'waiting_for_confirmation' | 'done' | 'rejected' | 'expired' | 'canceled';

export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  ticketTypeId?: string;
  quantity: number;
  totalPrice: number;
  pointsUsed: number;
  voucherId?: string;
  couponId?: string;
  status: TransactionStatus;
  paymentProof?: string;
  paymentDeadline: Date;
  createdAt: Date;
}

export interface Voucher {
  id: string;
  code: string;
  organizerId: string;
  eventId?: string;
  discountAmount: number;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  userId: string;
  discountAmount: number;
  discountPercentage: number;
  expiryDate: Date;
  isUsed: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  eventId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface OrganizerStats {
  totalEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  averageRating: number;
}

export interface EventStats {
  totalAttendees: number;
  revenue: number;
  availableSeats: number;
  soldSeats: number;
}
