'use client';

import { useEffect } from 'react';
import Typewriter from './typewriter';
import { toast } from 'react-hot-toast';
export default function PageWrapper({
  title,
  children,
  centerContent = false,
  error = null,
  success = null,
}) {
  useEffect(() => {
    if (error) {
      toast.error(error, { icon: '⚠️' });
    }
    if (success) {
      toast.success(success, { icon: '🎉' });
    }
  }, [error, success]);
  return (
    <div
      className={`flex flex-col ${
        centerContent
          ? 'items-center justify-center min-h-screen'
          : 'items-start'
      } p-8`}
    >
      {title && (
        <h1 className="text-5xl font-bold mb-6 text-accent">
          <Typewriter text={title} delay={100} />
        </h1>
      )}
      <div className="w-full flex justify-center">{children}</div>
    </div>
  );
}
