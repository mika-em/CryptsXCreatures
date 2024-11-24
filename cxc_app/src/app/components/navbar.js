'use client';
import Link from 'next/link';
import { FaPenNib } from 'react-icons/fa'; 

export default function Navbar() {
  return (
    <div className="navbar text-white shadow-md sticky top-0 z-50">
      <div className="flex-1">
      <Link
          href="/"
          className="btn btn-ghost normal-case text-2xl font-semibold flex items-center gap-2"
          aria-label="Homepage"
        >
          <FaPenNib className="text-accent" />
          <span className="font-serif font-semibold">CXC</span>
        </Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/story"
              className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
              aria-label="Generate"
            >
              Generate
            </Link>
          </li>
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
          <li>
            <Link
              href="/admin"
              className="px-4 font-sans text-md hover:text-accent transition-all font-medium"
              aria-label="Admin"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
