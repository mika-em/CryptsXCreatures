'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 text-base-content">
      <h1 className="text-8xl font-bold">404</h1>
      <p className="text-xl mt-4 text-center pt-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="btn btn-sm btn-primary mt-6">
        Go Back Home
      </Link>
    </div>
  );
}
