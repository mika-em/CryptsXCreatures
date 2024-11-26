'use client';

import { useAuthContext } from '../context/AuthContext';

export function useRole() {
  const { role, isAdmin, loading, error } = useAuthContext();
  return { role, isAdmin, loading, error };
}
