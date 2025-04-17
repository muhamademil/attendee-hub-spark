
import React, { createContext, useContext, useState } from 'react';
import { Event, TicketType, Transaction, Voucher, Review, TransactionStatus } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface EventContextType {
  events: Event[];
  createEvent: (eventData: Omit<Event, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'availableSeats'>) => Promise<Event>;
  getEventById: (id: string) => Event | undefined;
  getEventsByOrganizer: (organizerId: string) => Event[];
  searchEvents: (query: string, category?: string, location?: string) => Event[];
  createVoucher: (voucherData: Omit<Voucher, 'id'>) => Promise<Voucher>;
  getVouchersForEvent: (eventId: string) => Voucher[];
  createTransaction: (
    eventId: string, 
    quantity: number, 
    pointsUsed?: number, 
    voucherId?: string, 
    couponId?: string
  ) => Promise<Transaction>;
  uploadPaymentProof: (transactionId: string, proofUrl: string) => Promise<void>;
  updateTransactionStatus: (transactionId: string, status: TransactionStatus) => Promise<void>;
  getUserTransactions: (userId: string) => Transaction[];
  getOrganizerTransactions: (organizerId: string) => Transaction[];
  addReview: (eventId: string, rating: number, comment: string) => Promise<Review>;
  getEventReviews: (eventId: string) => Review[];
}

// Mock data
const today = new Date();
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2025',
    description: 'Join us for the biggest tech conference in Asia, featuring speakers from leading tech companies.',
    organizerId: '2',
    organizerName: 'Event Organizer',
    location: 'Jakarta Convention Center',
    category: 'Technology',
    startDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 32 * 24 * 60 * 60 * 1000),
    price: 500000,
    totalSeats: 1000,
    availableSeats: 850,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop',
    createdAt: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Music Festival',
    description: 'A weekend of music, arts, and culture featuring both local and international artists.',
    organizerId: '2',
    organizerName: 'Event Organizer',
    location: 'Bali Beachfront',
    category: 'Music',
    startDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000),
    price: 750000,
    totalSeats: 5000,
    availableSeats: 3200,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2670&auto=format&fit=crop',
    createdAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Workshop: Digital Marketing',
    description: 'Learn the essentials of digital marketing in this hands-on workshop.',
    organizerId: '2',
    organizerName: 'Event Organizer',
    location: 'Digital Hub, Jakarta',
    category: 'Education',
    startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    price: 250000,
    totalSeats: 50,
    availableSeats: 23,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop',
    createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Community Meetup',
    description: 'Join our free community meetup to network and share ideas.',
    organizerId: '2',
    organizerName: 'Event Organizer',
    location: 'Co-working Space, Bandung',
    category: 'Networking',
    startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    price: 0,
    totalSeats: 100,
    availableSeats: 67,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2670&auto=format&fit=crop',
    createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Business Summit 2025',
    description: 'Explore business opportunities and network with industry leaders.',
    organizerId: '2',
    organizerName: 'Event Organizer',
    location: 'Grand Hyatt, Jakarta',
    category: 'Business',
    startDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 46 * 24 * 60 * 60 * 1000),
    price: 1200000,
    totalSeats: 300,
    availableSeats: 240,
    isFree: false,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2670&auto=format&fit=crop',
    createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
  },
];

const mockVouchers: Voucher[] = [];
const mockTransactions: Transaction[] = [];
const mockReviews: Review[] = [];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const { user } = useAuth();

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'organizerId' | 'organizerName' | 'availableSeats'>): Promise<Event> => {
    if (!user || user.role !== 'organizer') {
      throw new Error('Only organizers can create events');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: Event = {
          ...eventData,
          id: (events.length + 1).toString(),
          organizerId: user.id,
          organizerName: user.name,
          availableSeats: eventData.totalSeats,
          createdAt: new Date(),
        };

        setEvents(prevEvents => [...prevEvents, newEvent]);
        toast.success('Event created successfully');
        resolve(newEvent);
      }, 1000);
    });
  };

  const getEventById = (id: string) => {
    return events.find(event => event.id === id);
  };

  const getEventsByOrganizer = (organizerId: string) => {
    return events.filter(event => event.organizerId === organizerId);
  };

  const searchEvents = (query: string, category?: string, location?: string) => {
    let filteredEvents = [...events];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.name.toLowerCase().includes(searchTerm) || 
        event.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (category) {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }
    
    if (location) {
      filteredEvents = filteredEvents.filter(event => event.location.includes(location));
    }
    
    return filteredEvents;
  };

  const createVoucher = async (voucherData: Omit<Voucher, 'id'>): Promise<Voucher> => {
    if (!user || user.role !== 'organizer') {
      throw new Error('Only organizers can create vouchers');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const newVoucher: Voucher = {
          ...voucherData,
          id: (vouchers.length + 1).toString(),
        };

        setVouchers(prevVouchers => [...prevVouchers, newVoucher]);
        toast.success('Voucher created successfully');
        resolve(newVoucher);
      }, 1000);
    });
  };

  const getVouchersForEvent = (eventId: string) => {
    return vouchers.filter(voucher => voucher.eventId === eventId && voucher.isActive);
  };

  const createTransaction = async (
    eventId: string, 
    quantity: number, 
    pointsUsed: number = 0, 
    voucherId?: string, 
    couponId?: string
  ): Promise<Transaction> => {
    if (!user) {
      throw new Error('You must be logged in to purchase tickets');
    }

    const event = getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    if (event.availableSeats < quantity) {
      throw new Error('Not enough available seats');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate base price
        let totalPrice = event.price * quantity;
        
        // Apply points discount
        totalPrice -= pointsUsed;
        
        // Apply voucher discount if provided
        if (voucherId) {
          const voucher = vouchers.find(v => v.id === voucherId);
          if (voucher) {
            if (voucher.discountAmount > 0) {
              totalPrice -= voucher.discountAmount;
            } else if (voucher.discountPercentage > 0) {
              totalPrice -= totalPrice * (voucher.discountPercentage / 100);
            }
          }
        }
        
        // Apply coupon discount if provided (simplified)
        if (couponId) {
          // In a real app, we would look up the coupon and apply its discount
          totalPrice -= 50000; // Example discount
        }
        
        // Ensure price doesn't go below 0
        totalPrice = Math.max(0, totalPrice);
        
        // Create payment deadline (2 hours from now)
        const paymentDeadline = new Date();
        paymentDeadline.setHours(paymentDeadline.getHours() + 2);
        
        const newTransaction: Transaction = {
          id: (transactions.length + 1).toString(),
          userId: user.id,
          eventId,
          quantity,
          totalPrice,
          pointsUsed,
          voucherId,
          couponId,
          status: 'waiting_for_payment',
          paymentDeadline,
          createdAt: new Date(),
        };
        
        // Update available seats
        const updatedEvents = events.map(e => {
          if (e.id === eventId) {
            return { ...e, availableSeats: e.availableSeats - quantity };
          }
          return e;
        });
        
        setEvents(updatedEvents);
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        
        toast.success('Transaction created successfully');
        resolve(newTransaction);
      }, 1000);
    });
  };

  const uploadPaymentProof = async (transactionId: string, proofUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        
        if (transactionIndex === -1) {
          reject(new Error('Transaction not found'));
          return;
        }
        
        const transaction = transactions[transactionIndex];
        
        if (transaction.status !== 'waiting_for_payment') {
          reject(new Error('Transaction is not in payment waiting status'));
          return;
        }
        
        if (new Date() > transaction.paymentDeadline) {
          // Transaction has expired
          const updatedTransaction = { 
            ...transaction, 
            status: 'expired' as TransactionStatus 
          };
          
          // Restore available seats
          const updatedEvents = events.map(e => {
            if (e.id === transaction.eventId) {
              return { ...e, availableSeats: e.availableSeats + transaction.quantity };
            }
            return e;
          });
          
          setEvents(updatedEvents);
          
          const updatedTransactions = [...transactions];
          updatedTransactions[transactionIndex] = updatedTransaction;
          setTransactions(updatedTransactions);
          
          reject(new Error('Payment deadline has passed'));
          return;
        }
        
        // Update transaction with payment proof
        const updatedTransaction = { 
          ...transaction, 
          paymentProof: proofUrl,
          status: 'waiting_for_confirmation' as TransactionStatus
        };
        
        const updatedTransactions = [...transactions];
        updatedTransactions[transactionIndex] = updatedTransaction;
        setTransactions(updatedTransactions);
        
        toast.success('Payment proof uploaded successfully');
        resolve();
      }, 1000);
    });
  };

  const updateTransactionStatus = async (transactionId: string, status: TransactionStatus): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        
        if (transactionIndex === -1) {
          reject(new Error('Transaction not found'));
          return;
        }
        
        const transaction = transactions[transactionIndex];
        const updatedTransaction = { ...transaction, status };
        
        // If transaction is rejected or canceled, restore seats and return points/vouchers
        if (status === 'rejected' || status === 'canceled' || status === 'expired') {
          // Restore available seats
          const updatedEvents = events.map(e => {
            if (e.id === transaction.eventId) {
              return { ...e, availableSeats: e.availableSeats + transaction.quantity };
            }
            return e;
          });
          
          setEvents(updatedEvents);
          
          // In a real app, we would also return points and vouchers/coupons to the user
        }
        
        const updatedTransactions = [...transactions];
        updatedTransactions[transactionIndex] = updatedTransaction;
        setTransactions(updatedTransactions);
        
        toast.success(`Transaction ${status} successfully`);
        resolve();
      }, 1000);
    });
  };

  const getUserTransactions = (userId: string) => {
    return transactions.filter(t => t.userId === userId);
  };

  const getOrganizerTransactions = (organizerId: string) => {
    const organizerEventIds = events
      .filter(e => e.organizerId === organizerId)
      .map(e => e.id);
    
    return transactions.filter(t => organizerEventIds.includes(t.eventId));
  };

  const addReview = async (eventId: string, rating: number, comment: string): Promise<Review> => {
    if (!user) {
      throw new Error('You must be logged in to leave a review');
    }

    const event = getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if user has a completed transaction for this event
    const hasCompletedTransaction = transactions.some(
      t => t.userId === user.id && t.eventId === eventId && t.status === 'done'
    );

    if (!hasCompletedTransaction) {
      throw new Error('You can only review events you have attended');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          id: (reviews.length + 1).toString(),
          userId: user.id,
          userName: user.name,
          eventId,
          rating,
          comment,
          createdAt: new Date(),
        };

        setReviews(prevReviews => [...prevReviews, newReview]);
        toast.success('Review submitted successfully');
        resolve(newReview);
      }, 1000);
    });
  };

  const getEventReviews = (eventId: string) => {
    return reviews.filter(review => review.eventId === eventId);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        getEventById,
        getEventsByOrganizer,
        searchEvents,
        createVoucher,
        getVouchersForEvent,
        createTransaction,
        uploadPaymentProof,
        updateTransactionStatus,
        getUserTransactions,
        getOrganizerTransactions,
        addReview,
        getEventReviews,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
