'use client';

import Link from 'next/link';

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-300 text-base-content">
      <h1 className="text-8xl font-bold ">500</h1>
      <p className="text-lg mt-4 mb-5 text-center pt-4">
        {error || 'Something went wrong. Please try again later.'}
      </p>
      <div className="mt-6 flex space-x-4">
        {reset && (
          <button className="btn btn-sm btn-secondary" onClick={reset}>
            Retry
          </button>
        )}
        <Link href="/" className="btn btn-sm btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
