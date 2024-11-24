'use client';

import { useState, useEffect } from 'react';
import { generateStory } from '../utils/story';
import PageWrapper from '../components/PageWrapper';

export default function StoryPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setToastMessage(null);

    try {
      const story = await generateStory(prompt);
      setGeneratedText(story);
      setSuccess('Story generated successfully!');
    } catch (err) {
      setErr('There was an issue generating the story.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper
      title="Start Your Journey"
      centerContent={true}
      err={err}
      success={success}
    >
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm md:max-w-lg bg-base-200 p-6 shadow-md"
      >
        <div className="form-control mb-4">
          <textarea
            className="textarea text-base-content text-xl p-4"
            rows={3}
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            aria-label="Story prompt"
          />
        </div>
        <button
          type="submit"
          className={`btn text-base-content btn-primary w-full flex items-center justify-center ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-lg loading-infinity"></span>
          ) : (
            'Go!'
          )}
        </button>
      </form>

      {generatedText && (
        <div className="card mt-6 w-full max-w-sm md:max-w-lg bg-base-100 p-6">
          <p className="text-base-content text-xl">{generatedText}</p>
        </div>
      )}
    </PageWrapper>
  );
}
