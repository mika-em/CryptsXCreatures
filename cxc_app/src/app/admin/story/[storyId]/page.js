'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { generateStory } from '../../../utils/story';
import PageWrapper from '../../../components/PageWrapper';
import Loading from '../../../components/loading';

export default function AdminContinueStoryPage() {
  const { storyId } = useParams();
  const [history, setHistory] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchInitialStory() {
      setLoading(true);
      setError(null);

      try {
        const response = await generateStory('', storyId);
        setHistory(response.history || '');
      } catch (err) {
        console.error('Error fetching story:', err.message);
        setError('Failed to load the story. Redirecting...');
        setTimeout(() => router.push('/admin/dashboard'), 3000);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialStory();
  }, [storyId, router]);

  const handleContinue = async () => {
    if (!newPrompt) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateStory(newPrompt, storyId);
      setHistory(result.history);
      setNewPrompt('');
    } catch (e) {
      console.error('Error continuing story:', e.message);
      setError('Failed to generate the next part of the story.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !history) {
    return <Loading />;
  }

  return (
    <PageWrapper
      title={`Continue Story #${storyId}`}
      error={error}
      success={history ? 'Story updated successfully!' : null}
      centerContent={true}
    >
      <div className="card w-full max-w-2xl bg-base-100 p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Current Story</h2>
        <div className="story-content mb-4 p-4 bg-base-100 rounded-lg max-h-96 overflow-y-auto">
          <p className="text-base-content text-lg whitespace-pre-line">
            {history}
          </p>
        </div>

        <textarea
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="Enter the next part of the story..."
          className="textarea text-base-content text-lg w-full mb-4 p-4"
          rows={5}
          disabled={loading}
        />
        <button
          onClick={handleContinue}
          className={`btn btn-accent w-full ${loading ? 'btn-disabled' : ''}`}
          disabled={loading || !newPrompt}
        >
          {loading ? (
            <span className="loading loading-lg loading-infinity"></span>
          ) : (
            'Continue Story'
          )}
        </button>
      </div>
    </PageWrapper>
  );
}
