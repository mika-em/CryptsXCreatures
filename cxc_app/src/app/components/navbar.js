'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar text-white shadow-md sticky top-0 z-50">
      {/* Left Section - Brand */}
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-2xl font-bold"
          aria-label="Homepage"
        >
          CXC
        </Link>
      </div>

      {/* Right Section - Menu */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/story"
              className="px-4 text-lg hover:text-yellow-300 transition-all font-medium"
              aria-label="Generate"
            >
              Generate
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="px-4 text-lg hover:text-yellow-300 transition-all font-medium"
              aria-label="Login"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="px-4 text-lg hover:text-yellow-300 transition-all font-medium"
              aria-label="Register"
            >
              Register
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
