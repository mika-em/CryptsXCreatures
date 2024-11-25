"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API } from '../constants/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/', '/login', '/register'];

  useEffect(() => {

    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${API}/verifyjwt`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 500) {
            setError('Server error occurred. Please try again later.');
            router.push('/500');
          } else {
            setError('Unauthorized access.');
            router.push('/404');
          }
          return;
        }

        const userData = await res.json();
        setUser(userData);
      } catch (e) {
        console.error('Auth error:', e.message);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [pathname, router]);

  return { user, loading, error };
}