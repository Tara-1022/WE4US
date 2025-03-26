import { useEffect, useState } from 'react';
import { CommunityView, PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';
import CommunityCreationModal from '../components/CommunityCreationModal';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileContext } from '../components/ProfileContext';

function PostCreationButton({ handlePostCreated }:
  { handlePostCreated: (newPost: PostView) => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Create Post</button>
      <PostCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}

function CommunityCreationButton({ handleCommunityCreated }:
  { handleCommunityCreated: (newCommunity: CommunityView) => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Create Community</button>
      <CommunityCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </>
  )

}

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const { profileInfo } = useProfileContext();
  const navigate = useNavigate();

  useEffect(() => {
    getPostList().then((postList) => setPostViews(postList));
  }, []);

  function handlePostCreated(newPost: PostView) {
    setPostViews((prevPosts) => (prevPosts ? [newPost, ...prevPosts] : [newPost]));
  };

  function handleCommunityCreated(newCommunity: CommunityView) {
    navigate("/community/" + newCommunity.community.id);
  }

  if (!postViews) {
    return <Loader />;
  }

  return (
    <>
      <h1>Recent Posts</h1>
      <Link to="/search"><Search /></Link>
      <PostCreationButton handlePostCreated={handlePostCreated} />
      {
        profileInfo?.isAdmin &&
        <CommunityCreationButton handleCommunityCreated={handleCommunityCreated} />
      }

      {postViews.length === 0 ? <h3>No posts to see!</h3> : <PostList postViews={postViews} />}
    </>
  );
}

export default ReachingOut;
