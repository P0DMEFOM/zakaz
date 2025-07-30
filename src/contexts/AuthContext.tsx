import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'photographer' | 'designer';
  phone?: string;
  telegram?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: 'admin' | 'photographer' | 'designer', phone?: string, telegram?: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Администратор',
      email: 'admin',
      role: 'admin',
      phone: '+7 (999) 123-45-67',
      telegram: '@admin'
    }
  ]);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin' && password === 'admin') {
      setUser(users[0]);
      return true;
    }
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const register = (name: string, email: string, password: string, role: 'admin' | 'photographer' | 'designer', phone?: string, telegram?: string): boolean => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      phone,
      telegram
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (user && user.id === id) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      register,
      logout,
      addUser,
      updateUser,
      deleteUser
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