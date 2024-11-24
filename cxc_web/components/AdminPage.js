'use client';
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://cheryl-lau.com/cxc/api/admin/users", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else if (response.status === 403) {
          setError("You do not have permission to view this page. Admins only.");
        } else {
          throw new Error("Failed to fetch users.");
        }
      } catch (err) {
        console.error("Error fetching admin users:", err.message);
        setError("There was an error loading the user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="alert alert-info text-center">Loading admin data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="card p-4 shadow-sm">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Prompt Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.call_count || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}