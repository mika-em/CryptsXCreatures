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
      router.push('/story');
    } catch (err) {
      setErr(err.message || 'Something went wrong');
    }
  }

  return (
    <PageWrapper title="Login" centerContent={true} err={err}>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg p-7 m-5 bg-base-200"
      >
        <div className="form-control mb-4 ">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            aria-label="Email Address"
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
            aria-label="Password"
            className="input input-bordered"
            required
          />
          <div className="text-left mt-3">
            <a
              href="/recover"
              className="link link-info text-sm hover:text-secondary-focus"
              aria-label="Forgot Password Link"
            >
              Forgot your password?
            </a>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-accent w-full"
          aria-label="Login Button"
        >
          Login
        </button>
      </form>
    </PageWrapper>
  );
}
