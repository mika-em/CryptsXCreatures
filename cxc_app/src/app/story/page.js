'use client';

import { useState } from 'react';
import { generateStory } from '../utils/story';
import PageWrapper from '../components/PageWrapper';
import Loading from '../components/loading';

export default function StoryPage() {
  const [prompt, setPrompt] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [loadingStory, setLoadingStory] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingStory(true);
    setError(null);

    try {
      setStoryContent((prevContent) => `${prevContent}\n\n ${prompt}`);
      const response = await generateStory({ prompt });

      if (response?.text) {
        setStoryContent((prevContent) => `${prevContent}\n\nAI: ${response.text}`);
      } else {
        throw new Error('Invalid response from the server');
      }

      setPrompt('');
    } catch (err) {
      console.error('Error generating story:', err.message);
      setError('There was an issue generating the story.');
    } finally {
      setLoadingStory(false);
    }
  }

  return (
    <PageWrapper title={'Start your journey'} centerContent>
      <div className="card w-full max-w-2xl bg-base-200 p-6 shadow-md">
        <div className="story-content mb-4 p-4 bg-base-100 rounded-lg max-h-96 overflow-y-auto">
          {storyContent ? (
            storyContent.split('\n').map((line, index) => (
              <p key={index} className="text-base-content text-lg leading-relaxed">
                {line}
              </p>
            ))
          ) : (
            <p className="text-base-content text-lg italic">Your story starts here...</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="form-control">
          <textarea
            className="textarea text-base-content text-xl p-4 mb-4"
            rows={5}
            placeholder="Type your next input..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            aria-label="Story input"
            disabled={loadingStory}
          />
          <button
            type="submit"
            className={`btn btn-accent w-full ${
              loadingStory ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={loadingStory}
          >
            {loadingStory ? (
              <span className="loading loading-lg loading-infinity"></span>
            ) : (
              'Continue Story'
            )}
          </button>
        </form>

        {error && <p className="text-error mt-4">{error}</p>}
      </div>
    </PageWrapper>
  );
}