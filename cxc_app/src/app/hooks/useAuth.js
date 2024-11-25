'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '../constants/api';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/verifyjwt`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 500) {
          setError('Server error occurred. Please try again later.');
          router.push('/error/500');
        } else {
          setError('Unauthorized access. Redirecting to 404.');
          router.push('/error/404');
        }
        return;
      }

      const userData = await res.json();
      setUser(userData);
    } catch (e) {
      console.error('Auth error:', e.message);
      setUser(null);
      setError('An unexpected error occurred. Please try again later.');
      router.push('/error/500');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [router]);

  return { user, loading, error, retry: fetchUser };
}
