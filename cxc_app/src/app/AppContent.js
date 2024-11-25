'use client';

import { useAuth } from './hooks/useAuth';
import Loading from './components/loading';

export default function AppContent({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />; 
  }

  return <>{children}</>;
}
