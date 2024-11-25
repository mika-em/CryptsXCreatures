'use client';

import { useState, useEffect } from 'react';
import { API } from '../constants/api';

export function useRole(authenticated) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authenticated) {
      setLoading(false);
      return;
    }

    async function determineRole() {
      try {
        const res = await fetch(`${API}/admin/users`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setIsAdmin(true);
        } else if (res.status === 403) {
          setIsAdmin(false);
        } else {
          throw new Error('Unexpected response while checking role.');
        }
      } catch (err) {
        console.error('Role determination error:', err.message);
        setError('Failed to determine role.');
      } finally {
        setLoading(false);
      }
    }

    determineRole();
  }, [authenticated]);

  return { isAdmin, loading, error };
}
