import { useEffect, useState } from 'react'
import { PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';
import { Link } from 'react-router-dom';
import CreateCommunityButton from "../components/CreateCommunityButton";

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null)
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPostList().then(postList => setPostViews(postList));
  }, []
  )

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

      {postViews.length === 0 ? <h3>No posts to see!</h3> : <PostList postViews={postViews} />}
    </>
  );
}

export default ReachingOut
