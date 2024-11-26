'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Typewriter from './typewriter';

export default function PageWrapper({
  title,
  children,
  centerContent = false,
  error = null,
  success = null,
}) {
  useEffect(() => {
    const toastOptions = {
      id: 'unique-toast-id',
      duration: 3000,
    };

    if (error) {
      toast.error(error, {
        ...toastOptions,
        icon: '⚠️',
        style: {
          cursor: 'pointer',
        },
      });
    }

    if (success) {
      toast.success(success, {
        ...toastOptions,
        icon: '🎉',
        style: {
          cursor: 'pointer',
        },
      });
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