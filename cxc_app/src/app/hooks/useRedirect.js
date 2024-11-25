'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { useRole } from './useRole';

export function useRedirectBasedOnRole() {
  const { authenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole(authenticated);
  const router = useRouter();

  useEffect(() => {
    if (authLoading || roleLoading) return;

    if (!authenticated) {
      console.log('Redirecting to login...');
      router.push('/login');
    } else if (isAdmin) {
      console.log('Redirecting to admin dashboard...');
      router.push('/admin/dashboard');
    } else {
      console.log('Redirecting to user dashboard...');
      router.push('/user/dashboard');
    }
  }, [authenticated, isAdmin, authLoading, roleLoading, router]);

  return { authenticated, isAdmin, roleChecked: !authLoading && !roleLoading };
}
