'use client';

import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { register } from '../utils/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null); // State for success message
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    if (!recoveryQuestion || !recoveryAnswer) {
      setErr('Recovery question and answer are required!');
      return;
    }

    setErr(null);
    setLoading(true);

    try {
      console.log('Attempting to register:', { email, recoveryQuestion });
      await register({ email, password, recoveryQuestion, recoveryAnswer });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error.message);
      setErr(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper
      title="Register"
      centerContent={true}
      error={err}
      success={success}
    >
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
          className={`btn btn-accent w-full ${loading ? 'btn-disabled opacity-75' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-infinity"></span>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </PageWrapper>
  );
}
