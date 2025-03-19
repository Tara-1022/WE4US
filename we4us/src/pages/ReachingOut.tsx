import { useEffect, useState } from 'react';
import { PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';
import { Link } from 'react-router-dom';

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[]>([]);
  const [page, setPage] = useState<number>(1); // Current page gets updated.
  const limit = 10; // Posts per page
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPostList(undefined, page, limit).then((postList) => {
      setPostViews(postList);
    });
  }, [page]);

  const handlePostCreated = (newPost: PostView) => {
    setPostViews((prevPosts) => (prevPosts ? [newPost, ...prevPosts] : [newPost]));
  };

  if (!postViews) {
    return <Loader />;
  }

  return (
    <>
      <h1>Recent Posts</h1>
      <Link to="/search"><Search /></Link>
      <button onClick={() => setShowForm(true)}>Create Post</button>

      <PostCreationModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onPostCreated={handlePostCreated} 
      />

      {postViews.length === 0 ? (
        <h3>No posts to see!</h3>
      ) : (
        <PostList postViews={postViews} />
      )}
      <div>
        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span> Page {page} </span>
        <button disabled={postViews.length < limit} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </>
  );
}

export default ReachingOut;
