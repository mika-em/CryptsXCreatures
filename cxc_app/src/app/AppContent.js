'use client';

import { useAuthContext } from './context/AuthContext';
import Loading from './components/loading';
import { useRouter } from 'next/navigation';

export default function AppContent({ children }) {
  const { loading, authenticated, error } = useAuthContext();
  const router = useRouter();
  if (loading) {
    return <Loading />;
  }
  return <>{children}</>;
}
