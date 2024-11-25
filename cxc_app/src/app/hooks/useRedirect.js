'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';
import { useRole } from './useRole';

export function useRedirectBasedOnRole() {
  const { authenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole(authenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading || roleLoading) return;


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
  }, [authenticated, isAdmin, authLoading, roleLoading, router, pathname]);

  return { authenticated, isAdmin, roleChecked: !authLoading && !roleLoading };
}
