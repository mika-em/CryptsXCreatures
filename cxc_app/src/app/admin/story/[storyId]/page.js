// 'use client';

// import { useEffect, useState } from 'react';
// import { useRedirectBasedOnRole } from '../../../hooks/useRedirect';
// import { getStories } from '../../../utils/story';
// import PageWrapper from '../../../components/PageWrapper';
// import Link from 'next/link';
// import Loading from '../../../components/loading';

// export default function AdminStoryPage() {
//   const { authenticated, isAdmin, roleChecked } = useRedirectBasedOnRole();
//   const [stories, setStories] = useState([]);
//   const [loadingStories, setLoadingStories] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchStories() {
//       setLoadingStories(true);
//       setError(null);

//       try {
//         if (!authenticated || !isAdmin) return;
//         const storiesData = await getStories();
//         setStories(storiesData);
//       } catch (e) {
//         console.error("Error fetching admin's stories:", e.message);
//         setError('Failed to load stories. Please try again later.');
//       } finally {
//         setLoadingStories(false);
//       }
//     }

//     if (roleChecked && authenticated && isAdmin) {
//       fetchStories();
//     }
//   }, [authenticated, isAdmin, roleChecked]);

//   if (!roleChecked || loadingStories) {
//     return <Loading />;
//   }

//   if (!authenticated || !isAdmin) {
//     return (
//       <PageWrapper
//         title="Unauthorized Access"
//         error="You do not have permission to view this page."
//         centerContent
//       >
//         <Link href="/login" className="btn btn-primary mt-4">
//           Go to Login
//         </Link>
//       </PageWrapper>
//     );
//   }

//   return (
//     <PageWrapper
//       title="Admin Stories"
//       error={error}
//       success={stories.length > 0 ? 'Stories loaded successfully!' : null}
//       centerContent
//     >
//       <div className="card w-full max-w-3xl bg-base-100 p-6 shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Story Management</h2>
//         <div className="overflow-x-auto max-h-96 rounded-md shadow-md">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Story ID</th>
//                 <th>First Prompt</th>
//                 <th>Created At</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stories.length > 0 ? (
//                 stories.map((story, index) => (
//                   <tr key={story.storyId}>
//                     <td>{index + 1}</td>
//                     <td>{story.storyId}</td>
//                     <td className="truncate">{story.first_prompt}</td>
//                     <td>{new Date(story.created_at).toLocaleString()}</td>
//                     <td>
//                       <Link
//                         href={`/admin/story/${story.storyId}`}
//                         className="btn btn-primary btn-sm"
//                       >
//                         Continue
//                       </Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No stories available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-center mt-6">
//           <Link href="/story" className="btn btn-accent">
//             Create New Story
//           </Link>
//         </div>
//       </div>
//     </PageWrapper>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStories, generateStory } from '../../../utils/story';
import PageWrapper from '../../../components/PageWrapper';
import Loading from '../../../components/loading';

export default function AdminContinueStoryPage() {
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
        router.push('/admin/dashboard'); // Redirect admins back to the dashboard if the story is not found
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
      setNewPrompt(''); // Clear the input after a successful story continuation
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
      <div className="flex flex-col gap-4 items-center">
        {story ? (
          <div className="card w-full max-w-2xl bg-base-100 p-6 shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Current Story</h2>
            <p className="text-base-content text-lg whitespace-pre-line">
              {story.first_prompt}
            </p>
          </div>
        ) : (
          <p className="text-error">Story not found. Please try again.</p>
        )}

        <div className="card w-full max-w-2xl bg-base-100 p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Add to Story</h2>
          <textarea
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Enter the next part of the story..."
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