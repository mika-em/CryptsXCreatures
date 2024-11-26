'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { API } from '../constants/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateAuthStatus = async (isAuthenticated, userRole = null) => {
    setAuthenticated(isAuthenticated);
    setRole(userRole);
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

          if (!isAuthenticated) {
            setRole(null);
          }
        } else {
          setAuthenticated(false);
          setRole(null);
        }
      } catch (err) {
        console.error('JWT validation error:', err.message);
        setError('Failed to validate session.');
        setAuthenticated(false);
        setRole(null);
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
        role,
        isAdmin: role === 'admin',
        loading,
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
