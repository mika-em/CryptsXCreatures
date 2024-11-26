'use client';

import Link from 'next/link';
import { FaPenNib } from 'react-icons/fa';
import { logout } from '../utils/auth';
import { useAuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { authenticated, isAdmin, loading, updateAuthStatus } =
    useAuthContext();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsReady(true);
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      await logout();
      updateAuthStatus(false, false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  if (loading || !isReady) {
    return null;
  }

  return (
    <div className="navbar bg-base-300 text-white shadow-md sticky top-0 z-50">
      <div className="flex-1">
        <div className="px-5 normal-case text-2xl font-semibold flex items-center gap-2">
          <FaPenNib className="text-accent" />
          <span className="font-typewriter font-semibold">CXC</span>
        </div>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {authenticated ? (
            <>
              {isAdmin ? (
                <>
                  <li>
                    <Link
                      href="/story"
                      className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                      aria-label="Generate Story"
                    >
                      Generate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                      aria-label="Admin Dashboard"
                    >
                      Users
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* User-specific links */}
                  <li>
                    <Link
                      href="/story"
                      className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                      aria-label="Generate Story"
                    >
                      Generate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/dashboard"
                      className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
                      aria-label="User Dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
              {/* Logout */}
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
