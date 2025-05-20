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
import { CSSProperties } from 'react';

const styles: {
  container: CSSProperties;
  header: CSSProperties;
  headerContainer: CSSProperties;
  actionsContainer: CSSProperties;
  searchIcon: CSSProperties;
  noPostsMessage: CSSProperties;
  paginationContainer: CSSProperties;
  postListContainer: CSSProperties;
  postItem: CSSProperties;
} = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#111',
    color: '#fff',
    minHeight: '100vh'
  },
  header: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 20px 0',
    color: 'var(--primary-dark-orange)',
    textAlign: 'left'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid var(--primary-dark-orange)',
    paddingBottom: '15px',
    marginTop: '40px', 
  },
  actionsContainer: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  searchIcon: {
    color: '#fff'
  },
  noPostsMessage: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#aaa',
    margin: '40px 0',
    padding: '20px',
    backgroundColor: '#222',
    borderRadius: '8px',
    border: '1px solid #333'
  },
  paginationContainer: {
    margin: '20px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  postListContainer: {
    backgroundColor: '#222',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px'
  },
  postItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: '6px',
    border: '1px solid #333',
    margin: '0 0 15px 0',
    padding: '15px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    display: 'block',
    position: 'relative',
  }
};



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
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Loader size={48} color="var(--primary-dark-orange)" />
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .post-item {
        background-color: #1a1a1a;
        border-radius: 6px;
        border: 1px solid #333;
        margin-bottom: 15px;
        padding: 15px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .post-item:hover {
        border-color: var(--primary-dark-orange);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
      }
      
      .create-community-button{
      background-color: var(--primary-dark-orange);
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
  }

      .create-community-button:hover{
      background-color: var(--primary-light-orange);
  }
  
      .search-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background-color: var(--primary-dark-orange);
      border-radius: 50%;
      color: #fff;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    
    .search-link:hover {
    background-color: var(--primary-light-orange) 
    }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>Recent Posts</h1>
        
        <div style={styles.actionsContainer}>
          <Link 
            to="/search" 
            className='search-link'
          >
            <Search style={styles.searchIcon} size={20} />
          </Link>
          
          <PostCreationButton handlePostCreated={handlePostCreated} />
          
          {profileInfo?.isAdmin && 
            <CommunityCreationButton handleCommunityCreated={handleCommunityCreated} />
          }
        </div>
      </div>
      
      <div style={styles.paginationContainer}>
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
      
      {postViews.length === 0 ? (
        <div style={styles.noPostsMessage}>
          <h3>No posts to see!</h3>
          <p>Be the first to create a post</p>
        </div>
      ) : (
        <div style={styles.postListContainer}>
          <PostList postViews={postViews} />
        </div>
      )}
      
      <div style={styles.paginationContainer}>
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    </div>
  );
}

export default ReachingOut;