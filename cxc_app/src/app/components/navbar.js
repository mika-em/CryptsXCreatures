'use client';
import Link from 'next/link';
import { FaPenNib } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../utils/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div className="navbar bg-base-300 text-white shadow-md sticky top-0 z-50">
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-2xl font-semibold flex items-center gap-2"
          aria-label="Homepage"
        >
          <FaPenNib className="text-accent" />
          <span className="font-typewriter font-semibold">CXC</span>
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user ? (
            <>
              <li>
                <Link
                  href="/story"
                  className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                  aria-label="Generate"
                >
                  Generate
                </Link>
              </li>
              {user.role === 'admin' && (
                <li>
                  <Link
                    href="/admin-dashboard"
                    className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                    aria-label="Users"
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                  aria-label="Login"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                  aria-label="Register"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
