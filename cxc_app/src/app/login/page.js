'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { login } from '../utils/auth';
import { useRouter } from 'next/navigation';
import Loading from '../components/loading';
import { useAuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { authenticated, loading: authLoading, updateAuthStatus } = useAuthContext();

  useEffect(() => {
    if (!authLoading && authenticated) {
      router.push('/');
    }
  }, [authenticated, authLoading, router]);

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
      await updateAuthStatus(true);
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err.message);
      setErr(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return <Loading />;
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
