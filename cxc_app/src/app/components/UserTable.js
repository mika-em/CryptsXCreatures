export default function UserTable({ users }) {
  return (
<div className="overflow-x-auto overflow-y-auto max-h-96 pt-5 border-base-content rounded-md shadow-xl p-4">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>#</th>
            <th>Role</th>
            <th>Email</th>
            <th>Prompt Count</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.email} className="hover">
                <td>{index + 1}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td className="text-center">{user.call_count || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users yet!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}