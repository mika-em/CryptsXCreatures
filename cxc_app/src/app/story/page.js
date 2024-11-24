'use client';

import { useState, useEffect } from 'react';
import { generateStory } from '../utils/story';
import Typewriter from '../components/typewriter';

export default function StoryPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setToastMessage(null);

    try {
      const story = await generateStory(prompt);
      setGeneratedText(story);
      setToastMessage('Story generated successfully!');
      setToastType('success');
    } catch (err) {
      setToastMessage('There was an issue. Please try again later.');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-8">
      <h1 className="text-6xl bg-clip-text glowing-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold pb-5 mb-6">
        <Typewriter text="start your journey" delay={100} />
      </h1>
      <form
        onSubmit={handleSubmit}
        className="card w-1/3 bg-base-100 p-4"
      >
        <div className="form-control mb-4">
          <textarea
            className="textarea text-base-content text-xl p-4"
            rows={3}
            placeholder="..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`btn text-base-content btn-primary w-full ${loading ? 'btn-disabled' : ''}`}
        >
          {loading ? (
            <span className="loading loading-lg loading-infinity"></span>
          ) : (
            'Go!'
          )}
        </button>
      </form>
      {generatedText && (
        <div className="card mt-4 w-1/3 bg-base-100 p-4">
          <p className="text-base-content text-xl">{generatedText}</p>
        </div>
      )}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center">
          <div
            className={`p-2 rounded-md text-center text-sm max-w-xs ${
              toastType === 'success'
                ? 'bg-gray-800 text-green-300'
                : 'bg-gray-800 text-red-300'
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}