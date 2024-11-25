'use client';

import { useState, useEffect } from 'react';
import { API } from '../constants/api';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function validateJWT() {
      try {
        const res = await fetch(`${API}/verifyjwt`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const text = await res.text(); // Expect "Welcome!"
          setAuthenticated(text === 'Welcome!');
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error('JWT validation error:', err.message);
        setError('Failed to validate session.');
      } finally {
        setLoading(false);
      }
    }

    validateJWT();
  }, []);

  return { authenticated, loading, error };
}
