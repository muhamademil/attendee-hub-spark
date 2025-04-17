
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole, referralCode?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isOrganizer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    referralCode: 'JOHN123',
    points: 5000,
    pointsExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Event Organizer',
    email: 'organizer@example.com',
    role: 'organizer',
    referralCode: 'ORG456',
    points: 0,
    createdAt: new Date(),
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string, role: UserRole, referralCode?: string) => {
    // Simulate API call
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          setIsLoading(false);
          reject(new Error('Email already in use'));
          return;
        }

        // Generate a random referral code
        const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Create new user
        const newUser: User = {
          id: (mockUsers.length + 1).toString(),
          name,
          email,
          role,
          referralCode: newReferralCode,
          points: 0,
          createdAt: new Date(),
        };
        
        // If referral code was provided, give points to referrer and coupon to new user
        if (referralCode) {
          const referrer = mockUsers.find(u => u.referralCode === referralCode);
          if (referrer) {
            referrer.points += 10000;
            referrer.pointsExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            // In a real app, we would create a coupon for the new user here
          }
        }
        
        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user,
        isOrganizer: user?.role === 'organizer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
