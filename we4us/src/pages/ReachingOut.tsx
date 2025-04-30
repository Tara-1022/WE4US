import { useEffect, useState } from 'react';
import { CommunityView, PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search } from 'lucide-react';
import PostCreationButton from '../components/PostCreationButton';
import CommunityCreationModal from '../components/CommunityCreationModal';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileContext } from '../components/ProfileContext';
import { DEFAULT_POSTS_PER_PAGE } from '../constants';
import PaginationControls from "../components/PaginationControls";
import '../styles/ReachingOut.css';

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
  const { profileInfo } = useProfileContext();
  const navigate = useNavigate();
  const hasMore = postViews.length >= DEFAULT_POSTS_PER_PAGE;
  
  useEffect(() => {
    getPostList({ page, limit: DEFAULT_POSTS_PER_PAGE }).then(setPostViews);
  }, [page]);
   
  function handlePostCreated(newPost: PostView) {
    setPostViews((prevPosts) => (prevPosts ? [newPost, ...prevPosts] : [newPost]));
  }

  function handleCommunityCreated(newCommunity: CommunityView): void {
    navigate("/community/" + newCommunity.community.id);
  }

  if (!postViews) {
    return (
      <div className="reaching-out-container loader-container">
        <Loader className="loader-icon" size={40} />
      </div>
    );
  }

  return (
    <div className="reaching-out-container">
      <div className="reaching-out-header">
        <h1 className="reaching-out-title">Recent Posts</h1>
        <div className="reaching-out-actions">
          <Link to="/search" className="search-link">
            <Search size={24} />
          </Link>
          <PostCreationButton handlePostCreated={handlePostCreated} />
          {profileInfo?.isAdmin && (
            <CommunityCreationButton handleCommunityCreated={handleCommunityCreated} />
          )}
        </div>
      </div>
      
      <div className="pagination-controls">
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
      
      {postViews.length === 0 ? (
        <h3 className="empty-posts">No posts to see!</h3>
        ) : (
        <PostList postViews={postViews} />
        )}
      
      <div className="pagination-controls">
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    </div>
  );
}

export default ReachingOut;