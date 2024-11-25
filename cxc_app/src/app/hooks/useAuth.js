"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../constants/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API}/verifyjwt`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 500) {
            console.warn('Token missing or invalid. Redirecting to login.');
          } else {
            console.error('Unexpected server response:', res.status);
          }
          throw new Error('Authentication failed.');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error.message);
        setUser(null);
        router.push('/'); 
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  return { user, loading };
}