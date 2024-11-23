import { fetchUsers } from '../utils/admin';
import UserTable from '../components/UserTable';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'View list of users and their prompt counts.',
};

export default async function AdminPage() {
  try {
    const users = await fetchUsers();
    return (
      <div className=" min-h-screen">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <UserTable users={users} />
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
        <div className=" min-h-screen p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-red-500">Failed to load users. Please try again later.</p>
        </div>
    );
  }
}
