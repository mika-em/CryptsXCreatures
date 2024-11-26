'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '../../utils/auth';
import UserTable from '../../components/UserTable';
import PageWrapper from '../../components/PageWrapper';
import { useAuthContext } from '../../context/AuthContext';
import Loading from '@/app/components/loading';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const { authenticated, isAdmin, loading: authLoading, error: authError } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || !authenticated) return;

    // Redirect if the user is not an admin
    if (!isAdmin) {
      console.error('Access denied: User is not an admin.');
      router.push('/error/403'); // Redirect to 403 error page
      return;
    }

    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err.message);
        setDataError('Failed to load users. Please try again later.');
      } finally {
        setDataLoading(false);
      }
    };

    loadUsers();
  }, [authenticated, isAdmin, authLoading, router]);

  if (authLoading || dataLoading) {
    return <Loading />;
  }

  if (dataError || authError) {
    router.push('/error/500'); 
    return null;
  }

  return (
    <PageWrapper title="Admin Dashboard" centerContent={true}>
      <UserTable users={users} />
    </PageWrapper>
  );
}