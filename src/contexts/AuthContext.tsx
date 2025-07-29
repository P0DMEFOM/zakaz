import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone: string, telegram: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Администратор',
      email: 'admin',
      role: 'admin',
      department: 'Управление',
      salary: 50000,
      phone: '+7 (999) 123-45-67',
      telegram: '@admin'
    }
  ]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check for admin credentials
    if (email === 'admin' && password === 'admin') {
      const adminUser = users.find(u => u.email === 'admin');
      if (adminUser) {
        setUser(adminUser);
        return true;
      }
    }

    // Check for regular users
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }

    return false;
  };

  const register = async (name: string, email: string, password: string, phone: string, telegram: string): Promise<boolean> => {
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'photographer',
      department: 'Фотография',
      salary: 30000,
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
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    
    // Update current user if it's the one being updated
    if (user && user.id === id) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    
    // Logout if current user is being deleted
    if (user && user.id === id) {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    users,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};