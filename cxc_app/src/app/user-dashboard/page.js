'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getStories } from '../utils/story';
import PageWrapper from '../components/PageWrapper';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const stories = await getStories();
        setStories(storiesData);
      } catch (e) {
        console.error("Error fetching user's stories.", e.message);
      } finally {
        setLoading(false);
      }

      if (user) {
        fetchStories();
      }
    }
  }, [user]);

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading your stories...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h1>
        <h2 className="text-xl mb-4">Your Stories</h2>

        <div className="overflow-x-auto overflow-y-auto max-h-96 pt-5 border-base-content rounded-md shadow-xl p-4">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Story ID</th>
                <th>First Prompt</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.length > 0 ? (
                stories.map((story, index) => (
                  <tr key={story.storyId} className="hover">
                    <td className="justify-center items-center">{index + 1}</td>
                    <td>{story.storyId}</td>
                    <td>{story.first_prompt}</td>
                    <td>{new Date(story.created_at).toLocaleString()}</td>
                    <td className="text-center">
                      <Link
                        href={`/story/${story.storyId}`}
                        className="btn btn-primary btn-sm"
                      >
                        Continue Story
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No stories yet! Start generating one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Link href="/story" className="btn btn-primary">
            Generate New Story
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
