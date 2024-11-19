'use client';

import { useRouter } from 'next/navigation';
import { register } from '../utils/auth';
import Typewriter from '../components/typewriter';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const recoveryQuestion = formData.get('recoveryQuestion');
    const recoveryAnswer = formData.get('recoveryAnswer');

    if (password !== confirmPassword) {
      setErr("The passwords don't match!");
      return;
    }

    try {
      await register({ email, password, recoveryQuestion, recoveryAnswer });
      router.push('/');
    } catch (err) {
      setErr(err.message || 'Something went wrong');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
      <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-base-content items-center pb-4">
        {''}
        <Typewriter text="register" delay={100} />
      </h2>
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="input mt-2 input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Recovery Question</span>
          </label>
          <input
            type="recoveryQuestion"
            name="recoveryQuestion"
            placeholder="Enter your recovery question"
            className="input input-bordered"
            required
          />
          <label className="label">
            <span className="label-text">Recovery Answer</span>
          </label>
          <input
            type="recoveryAnswer"
            name="recoveryAnswer"
            placeholder="Enter your recovery answer"
            className="input input-bordered"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </div>
  );
}
