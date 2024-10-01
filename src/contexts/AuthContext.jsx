import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';  // Import useRouter from Next.js
import api from '@/utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const publicRoutes = ['/login', '/signup']; // Define your public routes here

  useEffect(() => {
    const fetchUser = async () => {
      // Skip fetching user if on a public route like /login or /signup
      if (publicRoutes.includes(router.pathname)) {
        setLoading(false); // Don't try to fetch user, just finish loading
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
