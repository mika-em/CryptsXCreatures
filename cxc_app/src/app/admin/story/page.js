'use client';

import { useEffect, useState } from 'react';
import { useRedirectBasedOnRole } from '../../hooks/useRedirect';
import { getStories } from '../../utils/story';
import PageWrapper from '../../components/PageWrapper';
import Link from 'next/link';
import Loading from '../../components/loading';

export default function AdminStoryDashboard() {
  const { authenticated, isAdmin, roleChecked } = useRedirectBasedOnRole();
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdminStories() {
      if (!authenticated || !isAdmin) {
        return;
      }

      try {
        const storiesData = await getStories();
        setStories(storiesData);
      } catch (e) {
        console.error("Error fetching admin's stories:", e.message);
        setError('Failed to load stories. Please try again later.');
      } finally {
        setLoadingStories(false);
      }
    }

    if (roleChecked && authenticated && isAdmin) {
      fetchAdminStories();
    }
  }, [authenticated, isAdmin, roleChecked]);

  if (!roleChecked || loadingStories) {
    return <Loading />;
  }

  if (!authenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-300 text-center">
        <p className="text-xl font-medium">
          Unauthorized access. Please log in as an admin to view this dashboard.
        </p>
        <Link href="/login" className="btn btn-primary mt-4">
          Go to Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-300 text-center">
        <p className="text-xl font-medium text-error">{error}</p>
        <Link href="/" className="btn btn-primary mt-4">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <PageWrapper
      title="Admin Stories"
      success={stories.length > 0 ? 'Stories loaded.' : null}
      centerContent
    >
      <div>
        <div className="overflow-x-auto justify-center items-center overflow-y-auto max-h-96 pt-5 border-base-content rounded-md shadow-xl p-4">
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
            <tbody className="mb-5">
              {stories.length > 0 ? (
                stories.map((story, index) => (
                  <tr key={story.storyId} className="hover">
                    <td className="justify-center items-center">{index + 1}</td>
                    <td>{story.storyId}</td>
                    <td>{story.first_prompt}</td>
                    <td>{new Date(story.created_at).toLocaleString()}</td>
                    <td className="text-center">
                      <Link
                        href={`/admin/story/${story.storyId}`}
                        className="btn btn-primary btn-sm"
                        aria-label={`Continue story with ID ${story.storyId}`}
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
      </div>
    </PageWrapper>
  );
}