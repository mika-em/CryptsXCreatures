'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; 
import { getStories, generateStory } from '../../../services/api';
import PageWrapper from '../../../components/pageWrapper';

export default function ContinueStory() {
  const { storyId } = useParams(); 
  const [story, setStory] = useState(null);
  const [newPrompt, setNewPrompt] = useState('');
  const [updatedStory, setUpdatedStory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchStoryDetails() {
      try {
        const stories = await getStories();
        const currentStory = stories.find(
          (item) => item.storyId === parseInt(storyId, 10)
        ); 

        if (!currentStory) {
          setError('Story not found!');
          router.push('/user-dashboard');
          return;
        }
        setStory(currentStory);
      } catch (err) {
        console.error('Error fetching story:', err.message);
        setError('Failed to load the story.');
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
    } catch (err) {
      console.error('Error generating story:', err.message);
      setError('Failed to generate the next part of the story.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Loading Story..." centerContent>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Continue Story ${storyId}`}
      error={error}
      success={updatedStory ? 'Story updated successfully!' : null}
    >
      {story && (
        <div className="border p-4 rounded shadow mb-4">
          <h2 className="font-bold mb-2">Previous Story:</h2>
          <p className="whitespace-pre-line">{story.first_prompt}</p>
        </div>
      )}

      <textarea
        value={newPrompt}
        onChange={(e) => setNewPrompt(e.target.value)}
        placeholder="Enter the next part of your story..."
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleContinue}
        className="btn btn-primary"
        disabled={loading || !newPrompt}
      >
        {loading ? 'Continuing...' : 'Continue Story'}
      </button>

      {updatedStory && (
        <div className="mt-6 border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Updated Story:</h2>
          <p className="whitespace-pre-line">{updatedStory}</p>
        </div>
      )}
    </PageWrapper>
  );
}