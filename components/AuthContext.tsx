
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
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

  // Email/Password login
  const login = async (email: string, password?: string) => {
    const authenticatedUser = await db.authenticate(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  // Real SSO Integration Logic (Simulated for Demo)
  const loginWithSSO = async (email: string, name: string, provider: 'GOOGLE' | 'FACEBOOK') => {
    let dbUser = await db.findUserByEmail(email);

    if (!dbUser) {
      // Auto-create for SSO users (password-less)
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
