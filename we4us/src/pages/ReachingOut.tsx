import { useEffect, useState } from 'react';
import { CommunityView, PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';
import CommunityCreationModal from '../components/CommunityCreationModal';
import { Link, useNavigate } from 'react-router-dom';
import { useLemmyInfo } from '../components/LemmyContextProvider';
import { useProfileContext } from '../components/ProfileContext';
import { DEFAULT_POSTS_PER_PAGE } from '../constants'; // Ensure this is correctly imported

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
  const [postViews, setPostViews] = useState<PostView[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true); // Track if more posts exist
  const { setLemmyInfo } = useLemmyInfo();
  const { profileInfo } = useProfileContext();
  const navigate = useNavigate();

  useEffect(() => {
    getPostList(undefined, page, DEFAULT_POSTS_PER_PAGE).then((postList) => {
      setPostViews(postList);
      setHasMore(postList.length === DEFAULT_POSTS_PER_PAGE); // If full page loaded, enable Next
    });
  }, [page]);

  function handlePostCreated(newPost: PostView) {
    setPostViews((prevPosts) => (prevPosts ? [newPost, ...prevPosts] : [newPost]));
  }

  function handleCommunityCreated(newCommunity: CommunityView) {
    setLemmyInfo(prevLemmyInfo => ({
      ...prevLemmyInfo,
      communities: prevLemmyInfo?.communities
        ? [newCommunity, ...prevLemmyInfo.communities]
        : [newCommunity]
    }));
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
      {profileInfo?.isAdmin && <CommunityCreationButton handleCommunityCreated={handleCommunityCreated} />}

      {postViews.length === 0 ? (
        <h3>No posts to see!</h3>
      ) : (
        <PostList postViews={postViews} />
      )}

      {/* Pagination Controls */}
      <div>
        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span> Page {page} </span>
        <button disabled={!hasMore} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </>
  );
}

export default ReachingOut;
