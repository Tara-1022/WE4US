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
import "../styles/ReachingOut.css";


function CommunityCreationButton({ handleCommunityCreated }: 
   { handleCommunityCreated: (newCommunity: CommunityView) => void }) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className='create-community-button'
      >
      Create Community
      </button>
      <CommunityCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </>
  );
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
  
  function handleCommunityCreated(newCommunity: CommunityView) {
    navigate("/community/" + newCommunity.community.id);
  }
  
  if (!postViews) {
    return (
       <div className='recent-posts-wrapper'>
      <div className='recent-posts-container'>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Loader size={48} color="var(--primary-dark-orange)" />
        </div>
      </div>
      </div>
    );
  }
  
  return (
    <div className='recent-posts-wrapper'>
    <div className='recent-posts-container'>
      <div className='recent-posts-header-container'>
        <h1 className='recent-posts-header'>Recent Posts</h1>
        
        <div className='actions-container'>
          <Link 
            to="/search" 
            className='search-link'
          >
            <Search className='reaching-out-search-icon' size={20} />
          </Link>
          
          <PostCreationButton handlePostCreated={handlePostCreated} />
          
          {profileInfo?.isAdmin && 
            <CommunityCreationButton handleCommunityCreated={handleCommunityCreated} />
          }
        </div>
      </div>
      
      <div className='pagination-container'>
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
      
      {postViews.length === 0 ? (
        <div className='no-posts-message'>
          <h3>No posts to see!</h3>
          <p>Be the first to create a post</p>
        </div>
      ) : (
        <div className='post-list-container'>
          <PostList postViews={postViews} />
        </div>
      )}
      
      <div className='pagination-container'>
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    </div>
    </div>
  );
}

export default ReachingOut;