'use client';
import { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/auth';
import UserTable from '../components/UserTable';
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
        setError(e.message || "An error occured.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
      <h1 className="-pt-8 pb-7 text-5xl
       bg-clip-text glowing-text text-transparent
        bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold mb-6">
        Admin Dashboard
      </h1>
      <h1 className="text-2xl">Users</h1>
      <UserTable users={users} />
    </div>
  );
}
