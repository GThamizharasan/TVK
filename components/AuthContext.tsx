
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  loginWithSSO: (email: string, name: string, provider: 'GOOGLE' | 'FACEBOOK') => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Traditional mock login
  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'ADMIN' ? 'admin-1' : 'member-123',
      name: role === 'ADMIN' ? 'General Secretary' : 'Arun Kumar',
      email: role === 'ADMIN' ? 'admin@tvk.org' : 'member@tvk.org',
      role: role,
      membershipId: role === 'MEMBER' ? 'TVK-2024-88219' : undefined,
      avatar: role === 'MEMBER' ? 'https://i.pravatar.cc/150?u=tvkmember' : undefined,
      joinedAt: new Date().toISOString()
    };
    setUser(mockUser);
  };

  // Real SSO Integration Logic (Simulated for Demo)
  const loginWithSSO = async (email: string, name: string, provider: 'GOOGLE' | 'FACEBOOK') => {
    // 1. Check PostgreSQL (simulated) for existing user
    let dbUser = await db.findUserByEmail(email);

    if (!dbUser) {
      // 2. If user doesn't exist, auto-create as Member (OIDC Flow)
      dbUser = await db.registerMember({
        email,
        name,
        role: 'MEMBER',
        ssoProvider: provider
      });
    }

    setUser(dbUser);
    return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'ADMIN';
  const isMember = user?.role === 'MEMBER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithSSO,
      updateUser,
      logout, 
      isAuthenticated: !!user,
      isAdmin,
      isMember
    }}>
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
