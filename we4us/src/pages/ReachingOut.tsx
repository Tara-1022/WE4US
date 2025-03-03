import { useEffect, useState } from 'react';
import { PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    //Removed Timeout since PostList fetches the newest post.
    getPostList().then((postList) => setPostViews(postList));
  }, []);

  const handlePostCreated = (newPosts: PostView[]) => {
    setPostViews(newPosts);
  };

  if (!postViews) {
    return <Loader />;
  }
  return (
    <>
      <h1>Recent Posts</h1>
      <button onClick={() => setShowForm(true)}>Create Post</button>

      <PostCreationModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onPostCreated={handlePostCreated} 
      />

      {postViews.length === 0 ? <h3>No posts to see!</h3> : <PostList postViews={postViews} />}
    </>
  );
}

export default ReachingOut;