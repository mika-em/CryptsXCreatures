'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStories, generateStory } from '../../utils/story';
import PageWrapper from '../../components/PageWrapper';
import Loading from '@/app/components/loading';

export default function ContinueStory() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [newPrompt, setNewPrompt] = useState('');
  const [updatedStory, setUpdatedStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchStoryDetails() {
      setLoading(true);
      setError(null);
      try {
        const stories = await getStories();
        const currentStory = stories.find(
          (item) => item.storyId === parseInt(storyId, 10)
        );

        if (!currentStory) {
          throw new Error('Story not found!');
        }
        setStory(currentStory);
      } catch (err) {
        console.error('Error fetching story:', err.message);
        setError(err.message || 'Failed to load the story.');
        router.push('/user-dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchStoryDetails();
  }, [storyId, router]);

  const handleContinue = async () => {
    setError(null);
    setUpdatedStory('');
    setLoading(true);

    try {
      const result = await generateStory(newPrompt, storyId);
      setUpdatedStory(result.text);
      setNewPrompt(''); 
    } catch (err) {
      console.error('Error generating story:', err.message);
      setError('Failed to generate the next part of the story.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !story) {
    return <Loading />;
  }

  return (
    <PageWrapper
      title={`Continue Story #${storyId}`}
      error={error}
      success={
        updatedStory ? 'Next part of the story generated successfully!' : null
      }
      centerContent={true}
    >
      <div className='flex gap-2'>
      {story ? (
        <div className="card  w-[400px] max-w-2xl bg-base-100 p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Current Story</h2>
          <p className="text-base-content text-lg whitespace-pre-line">
            {story.first_prompt}
          </p>
        </div>
      ) : (
        <p className="text-error">Story not found. Please try again.</p>
      )}

      <div className="card w-[400px] max-w-2xl bg-base-100 p-6 shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Add to Your Story</h2>
        <textarea
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="Enter the next part of your story..."
          className="textarea text-base-content text-lg w-full mb-4 p-4"
          rows={5}
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

      {updatedStory && (
        <div className="card w-full max-w-2xl bg-base-100 p-6 shadow-md mt-6">
          <h2 className="text-xl font-bold mb-4">Updated Story</h2>
          <p className="text-base-content text-lg whitespace-pre-line">
            {updatedStory}
          </p>
        </div>
      )}
      </div>
    </PageWrapper>
  );
}
