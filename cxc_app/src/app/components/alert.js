'use client';

import { useState, useEffect } from 'react';
import { fetchCallCount } from '../utils/story';
import { FiX } from 'react-icons/fi';

export default function CallCountAlert({ max = 20 }) {
  const [callCount, setCallCount] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    async function getCallCount() {
      const callCount = await fetchCallCount();
      if (callCount !== null) {
        setCallCount(callCount);
        if (callCount >= max) {
          setShowAlert(true);
        }
      }
    }

    getCallCount();
  }, [max]);

  if (callCount === null) return null;

  return (
    <>
      {showAlert && (
        <div
          className="fixed left-1/2 transform top-48 -translate-x-1/2 alert alert-warning shadow-md flex items-center justify-between px-4 py-2 rounded-md text-sm"
          style={{ maxWidth: 'fit-content', zIndex: 1050 }}
        >
          <span className="">
            ⚠️  You have used <strong>{callCount}</strong> story generation
            calls!
                </span>
          <button
            onClick={() => setShowAlert(false)}
            className="btn btn-xs btn-ghost p-0 ml-2"
            aria-label="Close alert"
          >
            <FiX className="text-lg" /> 
          </button>
        </div>
      )}
    </>
  );
}
