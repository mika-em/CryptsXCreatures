'use client';

import { useAuthContext } from './context/authcontext';
import Loading from './components/loading';

export default function AppContent({ children }) {
  const { loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}
