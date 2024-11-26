'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { generateStory } from '../utils/story';
import PageWrapper from '../components/PageWrapper';
import Loading from '../components/loading';

export default function StoryPage() {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [storyId, setStoryId] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [error, setError] = useState(null);
  const { authenticated, loading: authLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !authenticated) {
      router.push('/login');
    }
  }, [authenticated, authLoading, router]);

  if (authLoading) {
    return <Loading />;
  }

  async function handleGenerateStory() {
    if (!prompt) return;

    setLoadingStory(true);
    setError(null);

    try {
      const response = await generateStory(prompt, storyId);

      if (response?.text) {
        const newStoryPart = `${prompt} ${response.text}`;
        setStory((prevStory) =>
          prevStory ? `${prevStory} ${newStoryPart}` : newStoryPart
        );
        if (!storyId) {
          setStoryId(response.storyId);
        }
        setPrompt('');
      } else {
        throw new Error('Invalid response from the server');
      }
    } catch (e) {
      setError('There was an issue generating the story. Please try again.');
    } finally {
      setLoadingStory(false);
    }
  }

  function handleNewStory() {
    setPrompt('');
    setStory('');
    setStoryId(null);
    setError(null);
  }

  return (
    <PageWrapper
      title="Story Generator"
      centerContent
      error={error}
      success={story ? 'Story updated successfully!' : null}
    >
      <div className="card w-full max-w-2xl bg-base-200 p-6 shadow-md">
        {story && (
          <div className="mb-4 text-right">
            <button
              onClick={handleNewStory}
              className="btn btn-sm btn-secondary"
              aria-label="Generate a new story"
            >
              Generate New Story
            </button>
          </div>
        )}

        <div className="story-content mb-4 p-4 bg-base-100 rounded-lg max-h-96 overflow-y-auto">
          {story ? (
            story.split('\n').map((line, index) => (
              <p key={index} className="text-base-content text-lg leading-relaxed">
                {line}
              </p>
            ))
          ) : (
            <p className="text-base-content text-lg italic">
              Start your journey below
            </p>
          )}
        </div>

        <textarea
          className="textarea text-base-content text-xl p-4 mb-4 h-24"
          placeholder={story ? 'Continue your story...' : 'Type your prompt here...'}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          aria-label="Story input"
          disabled={loadingStory}
        />

        <button
          onClick={handleGenerateStory}
          className={`btn btn-accent w-full ${
            loadingStory || !prompt ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loadingStory || !prompt}
        >
          {loadingStory ? (
            <span className="loading loading-lg loading-infinity"></span>
          ) : story ? (
            'Go'
          ) : (
            'Generate Story'
          )}
        </button>
      </div>
    </PageWrapper>
  );
}