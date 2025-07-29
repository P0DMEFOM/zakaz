import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users для демонстрации
const initialMockUsers: User[] = [
  {
    id: '1',
    name: 'Анна Иванова',
    email: 'anna@photoalbums.com',
    role: 'photographer',
    department: 'Фотостудия',
    position: 'Старший фотограф',
    salary: 75000,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Михаил Петров',
    email: 'mikhail@photoalbums.com',
    role: 'designer',
    department: 'Дизайн',
    position: 'Ведущий дизайнер',
    salary: 80000,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Елена Сидорова',
    email: 'elena@photoalbums.com',
    role: 'admin',
    department: 'Администрация',
    position: 'Администратор системы',
    salary: 90000,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: new Date('2024-01-01')
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialMockUsers);

  const login = async (email: string, password: string) => {
    // Симуляция авторизации
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Неверные учетные данные');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...userData } : u
    ));
    
    // Если обновляется текущий пользователь, обновляем и состояние user
    if (user?.id === id) {
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    
    // Если удаляется текущий пользователь, выходим из системы
    if (user?.id === id) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}