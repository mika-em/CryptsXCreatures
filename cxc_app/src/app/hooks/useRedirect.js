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
      router.push('/login');
    } else if (isAdmin && pathname === '/') {
      console.log('Redirecting admin to dashboard...');
      router.push('/admin/dashboard');
    } else if (!isAdmin && pathname === '/') {
      console.log('Redirecting user to dashboard...');
      router.push('/user/dashboard');
    }
    if (isAdmin && pathname.startsWith('/user')) {
      console.log('Redirecting admin from user dashboard to admin dashboard');
      router.push('/admin/dashboard');
    }
    if (!isAdmin && pathname.startsWith('/admin')) {
      console.log('Redirecting user from admin dashboard to user dashboard');
      router.push('/user/dashboard');
    }
  }, [authenticated, isAdmin, authLoading, router, pathname]);

  return { authenticated, isAdmin, roleChecked: !authLoading };
}
