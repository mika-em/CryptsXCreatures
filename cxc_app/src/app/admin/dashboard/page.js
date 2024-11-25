'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '../../utils/auth';
import UserTable from '../../components/UserTable';
import PageWrapper from '../../components/PageWrapper';
import { useRole } from '../../hooks/useRole';
import { useAuth } from '../../hooks/useAuth';
import Loading from '@/app/components/loading';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const { authenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole(authenticated);
  const router = useRouter();
  useEffect(() => {
    if (authLoading || roleLoading || !authenticated || !isAdmin) return;

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
  }, [authenticated, isAdmin, authLoading, roleLoading]);

  if (authLoading || roleLoading || dataLoading) {
    <Loading></Loading>;
  }

  if (dataError) {
    router.push("/error/500")
  }

  return (
    <PageWrapper title="Admin Dashboard" centerContent={true}>
      <UserTable users={users} />
    </PageWrapper>
  );
}
