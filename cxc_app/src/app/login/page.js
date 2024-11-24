'use client';

import { useRouter } from 'next/navigation';
import { login } from '../utils/auth';
import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      setErr(err.message || 'Something went wrong');
    }
  }

  return (
    <PageWrapper title="Login" centerContent={true}>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm rounded-lg p-7 m-5 bg-base-200"
      >
        {err && (
          <div className="alert alert-error mb-4">
            <span>{err}</span>
          </div>
        )}
        <div className="form-control mb-4 ">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="input input-bordered"
            required
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
          />
          <div className="text-left mt-3">
            <a
              href="/recover"
              className="link link-info text-sm hover:text-secondary-focus"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        <button type="submit" className="btn btn-accent w-full">
          Login
        </button>
      </form>
    </PageWrapper>
  );
}
