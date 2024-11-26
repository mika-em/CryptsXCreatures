'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../context/AuthContext';
import { generateStory } from '../utils/story';
import PageWrapper from '../components/PageWrapper';
import Loading from '../components/loading';

export default function StoryPage() {
  const [prompt, setPrompt] = useState('');
  const [storyContent, setStoryContent] = useState('');
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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingStory(true);
    setError(null);

    try {
      const response = await generateStory(prompt);

      if (response?.text) {
        setStoryContent(`${prompt} ${response.text}`);
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

  function handleNewStory() {
    setPrompt('');
    setStoryContent('');
    setError(null);
  }

  return (
    <PageWrapper
      title={'Start your journey'}
      centerContent
      error={error}
      success={storyContent ? 'Story generated successfully!' : null}
    >
      <div className="card w-full max-w-2xl bg-base-200 p-6 shadow-md">
        <form onSubmit={handleSubmit} className="form-control">
          <textarea
            className="textarea text-base-content text-xl p-4 mb-4"
            rows={10}
            placeholder="Type your story prompt here..."
            value={storyContent || prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required={!storyContent}
            aria-label="Story input"
            disabled={loadingStory || !!storyContent}
          />
          <button
            type="submit"
            className={`btn btn-accent w-full mb-4 ${
              loadingStory || !!storyContent
                ? 'opacity-75 cursor-not-allowed'
                : ''
            }`}
            disabled={loadingStory || !!storyContent}
          >
            {loadingStory ? (
              <span className="loading loading-lg loading-infinity"></span>
            ) : (
              'Generate Story'
            )}
          </button>
        </form>

        {storyContent && (
          <button
            onClick={handleNewStory}
            className="btn btn-md btn-accent w-full"
          >
            Start Again
          </button>
        )}
      </div>
    </PageWrapper>
  );
}
