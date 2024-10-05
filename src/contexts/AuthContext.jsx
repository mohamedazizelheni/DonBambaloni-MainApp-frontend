import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Cached user
  const [loading, setLoading] = useState(true); // Loading state
  const [accessToken, setAccessToken] = useState(null); // Access token stored in memory
  const router = useRouter();

  const publicRoutes = useMemo(() => ['/login', '/signup'], []);

  // Fetch the user from the backend using the access token
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user); // Cache user data
    } catch (error) {
      setUser(null); // Clear user data if token is invalid or expired
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle token refresh
  const refreshToken = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh-token');
      setAccessToken(data.accessToken); // Update access token in memory
      api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`; // Update Axios header with new access token
      await fetchUser(); // Fetch user after token refresh
    } catch (error) {
      setUser(null); // Clear user if refresh fails
      setAccessToken(null); // Clear access token
      router.push('/login'); // Redirect to login
    }
  }, [fetchUser, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!user && !publicRoutes.includes(router.pathname)) {
        setLoading(true);
        try {
          await refreshToken(); // Try refreshing the token
        } catch (error) {
          setLoading(false);
        }
      } else {
        setLoading(false); // Skip fetching if on a public route
      }
    };

    initializeAuth();
  }, [router.pathname, user, publicRoutes, refreshToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
