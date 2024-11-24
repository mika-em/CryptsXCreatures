'use client';

import { useState } from 'react';
import { recovery } from '../utils/auth';
import { useRouter } from 'next/navigation';
import PageWrapper from '../components/PageWrapper';

export default function RecoverPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [step, setStep] = useState(1);
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get('email');
    const recoveryAnswer = formData.get('recoveryAnswer');
    const newPassword = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (step === 1) {
      try {
        const response = await recovery.getQuestion({ email });
        setRecoveryQuestion(response.question);
        setStep(2);
      } catch (err) {
        setErr(err.message || 'User not found.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 2) {
      try {
        await recovery.verifyAnswer({ email, answer: recoveryAnswer });
        setStep(3);
      } catch (err) {
        setErr(err.message || 'Incorrect recovery answer.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 3) {
      if (newPassword !== confirmPassword) {
        setErr("The passwords don't match!");
        setLoading(false);
        return;
      }

      try {
        await recovery.resetPassword({ email, newPassword });
        setErr('Password successfully reset!');
        setTimeout(() => router.push('/login'), 3000);
      } catch (err) {
        setErr(err.message || 'There was an issue resetting your password.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <PageWrapper title="Recover Password" centerContent={true}>
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm rounded-lg p-7 m-5 bg-base-200"
      >
        {err && (
          <div className="alert alert-error mb-4">
            <span>{err}</span>
          </div>
        )}

        {step === 1 && (
          <>
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
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Recovery Question</span>
              </label>
              <p className="text-sm text-gray-600">{recoveryQuestion}</p>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Answer</span>
              </label>
              <input
                type="text"
                name="recoveryAnswer"
                placeholder="Enter your recovery answer"
                className="input input-bordered"
                required
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="input input-bordered"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
        >
          {loading ? <span className="loading loading-ring"></span> : 'Submit'}
        </button>
      </form>
    </PageWrapper>
  );
}
