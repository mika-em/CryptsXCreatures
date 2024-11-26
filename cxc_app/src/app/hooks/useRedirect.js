'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';

export function useRedirectBasedOnRole() {
  const { authenticated, loading: authLoading, isAdmin } = useAuthContext(); // Use updated context
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;

    if (!authenticated) {
      console.log('Redirecting to login...');
      router.push('/login');
    } else if (isAdmin && pathname === '/') {
      console.log('Redirecting admin to dashboard...');
      router.push('/admin/dashboard');
    } else if (!isAdmin && pathname === '/') {
      console.log('Redirecting user to dashboard...');
      router.push('/user/dashboard');
    }
  }, [authenticated, isAdmin, authLoading, router, pathname]);

  return { authenticated, isAdmin, roleChecked: !authLoading };
}