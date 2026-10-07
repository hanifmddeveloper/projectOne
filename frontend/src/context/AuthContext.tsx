'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  bloodGroup?: string;
  avatar?: string;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  doctorProfile?: {
    title?: string;
    specialization?: string;
    qualifications?: string[];
    experienceYears?: number;
    bio?: string;
    consultationFee?: number;
    availableDays?: string[];
    availableTimeSlots?: string[];
    clinicAddress?: string;
    hospitalAffiliation?: string;
    languages?: string[];
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('doctor_portal_token');
    const storedUser = localStorage.getItem('doctor_portal_user');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
      // Revalidate from server
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('doctor_portal_user', JSON.stringify(response.data.user));
      }
    } catch (err) {
      console.warn('Unable to refresh session from server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('doctor_portal_token', receivedToken);
    localStorage.setItem('doctor_portal_user', JSON.stringify(receivedUser));
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('doctor_portal_token', receivedToken);
    localStorage.setItem('doctor_portal_user', JSON.stringify(receivedUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('doctor_portal_token');
    localStorage.removeItem('doctor_portal_user');
  };

  const refreshUser = async () => {
    await fetchMe();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
