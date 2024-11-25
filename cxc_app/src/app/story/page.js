'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { generateStory } from '../utils/story';
import { useRouter } from 'next/navigation';
import PageWrapper from '../components/PageWrapper';
import Loading from '../components/loading';

export default function StoryPage() {
  const { authenticated, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole(authenticated);
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loadingStory, setLoadingStory] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();


  useEffect(() => {
    if (!authLoading && !roleLoading && !authenticated) {
      console.log('Redirecting to login...');
      router.push('/login');
    }
  }, [authenticated, authLoading, roleLoading, router]);

  if (authLoading || roleLoading) {
    return <Loading />;
  }

  if (!authenticated) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoadingStory(true);
    setError(null);
    setSuccess(null);

    try {
      const story = await generateStory(prompt);
      setGeneratedText(story.text);
      setSuccess('Story generated successfully!');
    } catch (err) {
      console.error('Error generating story:', err.message);
      setError('There was an issue generating the story.');
    } finally {
      setLoadingStory(false);
    }
  }

  return (
    <PageWrapper title={'Start your journey'} centerContent>
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
            disabled={loadingStory}
          />
        </div>
        <button
          type="submit"
          className={`btn btn-accent btn-sm w-full ${
            loadingStory ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={loadingStory}
        >
          {loadingStory ? (
            <span className="loading loading-lg loading-infinity"></span>
          ) : (
            'Go!'
          )}
        </button>
      </form>

      {error && <p className="text-error mt-4">{error}</p>}
      {success && <p className="text-success mt-4">{success}</p>}

      {generatedText && (
        <div className="card mt-6 w-full max-w-sm md:max-w-lg bg-base-100 p-6">
          <p className="text-base-content text-xl">{generatedText}</p>
        </div>
      )}
    </PageWrapper>
  );
}