'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminStatus = async () => {
    try {
      const res = await fetch(`${API}/admin/users`, {
        method: 'GET',
        credentials: 'include',
      });
      return res.ok;
    } catch (err) {
      console.error('Admin status fetch error:', err.message);
      return false;
    }
  };

  const updateAuthStatus = async (isAuthenticated, checkAdmin = true) => {
    setAuthenticated(isAuthenticated);
    if (isAuthenticated && checkAdmin) {
      const adminStatus = await fetchAdminStatus();
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    async function validateJWT() {
      try {
        const res = await fetch(`${API}/verifyjwt`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const text = await res.text();
          const isAuthenticated = text === 'Welcome!';
          setAuthenticated(isAuthenticated);

          if (isAuthenticated) {
            const adminStatus = await fetchAdminStatus();
            setIsAdmin(adminStatus);
          } else {
            setIsAdmin(false);
          }
        } else {
          setAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('JWT validation error:', err.message);
        setError('Failed to validate session.');
        setAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    validateJWT();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        isAdmin,
        error,
        updateAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
