'use client';

import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useRedirectBasedOnRole } from '../hooks/useRedirect';
import { login } from '../utils/auth';

export default function LoginPage() {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { roleChecked } = useRedirectBasedOnRole();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    setErr(null);
    setLoading(true);

    try {
      console.log(`Attempting login with email: ${email}`);
      await login({ email, password });
      console.log('Login successful.');
    } catch (err) {
      console.error('Login failed:', err.message);
      setErr(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  if (!roleChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200 text-center">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <PageWrapper title="Login" centerContent={true} err={err}>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg p-7 m-5 bg-base-200"
      >
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered"
            required
            disabled={loading}
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="input input-bordered"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`btn btn-accent w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </PageWrapper>
  );
}
