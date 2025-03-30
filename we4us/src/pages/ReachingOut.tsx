import { useEffect, useState } from 'react';
import { CommunityView, PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationModal from '../components/PostCreationModal';
import CommunityCreationModal from '../components/CommunityCreationModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLemmyInfo } from '../components/LemmyContextProvider';
import { useProfileContext } from '../components/ProfileContext';
import { DEFAULT_POSTS_PER_PAGE } from '../constants';
import PaginationControls from "../components/PaginationControls";

// Helper function to get URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

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
  const query = useQuery();
  const pageFromUrl = parseInt(query.get('page') || '1');
  const [postViews, setPostViews] = useState<PostView[]>([]);
  const [page, setPage] = useState<number>(pageFromUrl);
  const { setLemmyInfo } = useLemmyInfo();
  const { profileInfo } = useProfileContext();
  const navigate = useNavigate();
  const hasMore = postViews.length === DEFAULT_POSTS_PER_PAGE;
  useEffect(() => {
    setPage(pageFromUrl);
  }, [pageFromUrl]);
  
  useEffect(() => {
    getPostList({ page, limit: DEFAULT_POSTS_PER_PAGE }).then(setPostViews);
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

      <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />

      {postViews.length === 0 ? (
        <h3>No posts to see!</h3>
        ) : (
        <PostList postViews={postViews} page={page} />
        )}

      <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
    </>
  );
}

export default ReachingOut;
