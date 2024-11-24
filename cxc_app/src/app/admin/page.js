'use client';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/auth';
import UserTable from '../components/UserTable';
import PageWrapper from '../components/PageWrapper';

export default function AdminPage() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (e) {
        setError(e.message || 'An error occured.');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="Admin Dashboard" centerContent={true}>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-3xl">Loading...</h1>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Admin Dashboard" centerContent={true}>
        <div className="alert alert-error text-center mt-4">{error}</div>
      </PageWrapper>
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
