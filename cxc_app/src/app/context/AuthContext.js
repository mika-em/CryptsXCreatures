import { API } from './constants/api';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API}/verifyJWT`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Authentication failed');
        }
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('AuthContext error:', error);
        setUser(null);
        //redirect to home page if unauthenticated
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
