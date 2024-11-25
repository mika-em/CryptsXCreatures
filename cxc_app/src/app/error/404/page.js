'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-base-content">
      <h1 className="text-8xl font-bold text-error">404</h1>
      <p className="text-xl mt-4 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        Go Back Home
      </Link>
    </div>
  );
}
