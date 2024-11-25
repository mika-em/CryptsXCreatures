// 'use client';

// import { useState, useEffect } from 'react';
// import { API } from '../constants/api';

// export function useRole(authenticated) {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Only proceed if the user is authenticated
//     if (!authenticated) {
//       setLoading(false);
//       return;
//     }

//     async function determineRole() {
//       try {
//         const res = await fetch(`${API}/admin/users`, {
//           method: 'GET',
//           credentials: 'include', // Send cookies automatically
//         });

//         if (res.ok) {
//           const data = await res.json();

//           // Check if the response indicates the user is an admin
//           const currentUser = data.find((user) => user.role === 'admin');
//           setIsAdmin(!!currentUser); // Set admin status based on the response
//         } else if (res.status === 403) {
//           setIsAdmin(false); // User is not an admin
//         } else {
//           throw new Error('Unexpected response while determining role.');
//         }
//       } catch (err) {
//         console.error('Error determining role:', err.message);
//         setError('Failed to determine role.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     determineRole();
//   }, [authenticated]);

//   return { isAdmin, loading, error };
// }

'use client';

import { useAuthContext } from '../context/AuthContext';

export function useRole() {
  const { isAdmin, loading, error } = useAuthContext();
  return { isAdmin, loading, error };
}
