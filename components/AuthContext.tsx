
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    const mockUser: User = {
      id: role === 'ADMIN' ? 'admin-1' : 'member-123',
      name: role === 'ADMIN' ? 'General Secretary' : 'Arun Kumar',
      role: role,
      membershipId: role === 'MEMBER' ? 'TVK-2024-88219' : undefined,
      avatar: role === 'MEMBER' ? 'https://i.pravatar.cc/150?u=tvkmember' : undefined,
      joinedAt: new Date().toISOString()
    };
    setUser(mockUser);
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
