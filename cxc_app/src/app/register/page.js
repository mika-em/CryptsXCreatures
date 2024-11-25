'use client';

import { useRouter } from 'next/navigation';
import { register } from '../utils/auth';
import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';

export default function RegisterPage() {
  const router = useRouter();
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const recoveryQuestion = formData.get('recoveryQuestion');
    const recoveryAnswer = formData.get('recoveryAnswer');

    if (password !== confirmPassword) {
      setErr("The passwords don't match!");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErr('Password must be at least 8 characters long!');
      setLoading(false);
      return;
    }

    if (!recoveryQuestion || !recoveryAnswer) {
      setErr('Recovery question and answer are required!');
      setLoading(false);
      return;
    }

    try {
      await register({ email, password, recoveryQuestion, recoveryAnswer });
      router.push('/');
    } catch (err) {
      setErr(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper title="Register" centerContent={true} err={err}>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm md:max-w-md lg:max-w-lg rounded-lg p-7 mx-auto bg-base-200"
      >
        <div className="form-control mb-4">
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            aria-label="Confirm Password"
            className="input mt-2 input-bordered"
            required
          />
        </div>

        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Recovery Question</span>
          </label>
          <input
            type="text"
            name="recoveryQuestion"
            placeholder="Enter your recovery question"
            aria-label="Recovery Question"
            className="input input-bordered"
            required
          />
          <label className="label">
            <span className="label-text">Recovery Answer</span>
          </label>
          <input
            type="text"
            name="recoveryAnswer"
            placeholder="Enter your recovery answer"
            aria-label="Recovery Answer"
            className="input input-bordered"
            required
          />
        </div>
        <button
          type="submit"
          className={`btn  btn-accent w-full ${loading ? 'btn-disabled opacity-75' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-ring"></span>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </PageWrapper>
  );
}
