'use client';

import { useRouter } from 'next/navigation';
import { login } from '../utils/auth';
import Typewriter from '../components/typewriter';
import { useState } from 'react';

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
      <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-base-content items-center pb-4">
        {''}
        <Typewriter text="login" delay={100} />
      </h1>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm bg-base-100 p-4"
      >
        {err && (
          <div className="alert alert-error mb-4">
            <span>{err}</span>
          </div>
        )}
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
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
}
