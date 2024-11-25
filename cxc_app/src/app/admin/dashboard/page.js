'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '../../utils/auth';
import UserTable from '../../components/UserTable';
import PageWrapper from '../../components/PageWrapper';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const { authenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole(authenticated);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !authenticated) {
      console.log('Redirecting to login...');
      router.push('/login');
      return;
    }

    if (!roleLoading && authenticated && !isAdmin) {
      console.log('Redirecting non-admin to user dashboard...');
      router.push('/user/dashboard');
    }
  }, [authenticated, authLoading, isAdmin, roleLoading, router]);

  useEffect(() => {
    if (!authenticated || roleLoading || !isAdmin) return;

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
  }, [authenticated, isAdmin, roleLoading]);

  if (authLoading || roleLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl">Checking permissions and loading data...</h1>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-3xl text-error">{dataError}</h1>
      </div>
    );
  }

  return (
    <PageWrapper title="Admin Dashboard" centerContent={true}>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4">Users</h1>
        <UserTable users={users} />
      </div>
    </PageWrapper>
  );
}
