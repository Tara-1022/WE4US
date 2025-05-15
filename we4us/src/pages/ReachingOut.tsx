import { useEffect, useState } from 'react';
import { CommunityView, PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader, Search, Plus } from 'lucide-react';
import PostCreationButton from '../components/PostCreationButton';
import CommunityCreationModal from '../components/CommunityCreationModal';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileContext } from '../components/ProfileContext';
import { DEFAULT_POSTS_PER_PAGE } from '../constants';
import PaginationControls from "../components/PaginationControls";
import { CSSProperties } from 'react';

// Styles object for consistent theme
const styles: {
  container: CSSProperties;
  header: CSSProperties;
  headerContainer: CSSProperties;
  actionsContainer: CSSProperties;
  searchLink: CSSProperties;
  searchIcon: CSSProperties;
  createCommunityButton: CSSProperties;
  noPostsMessage: CSSProperties;
  paginationContainer: CSSProperties;
  postListContainer: CSSProperties;
  postItem: CSSProperties; // Added missing postItem style property
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
    color: '#ff6600',
    textAlign: 'left'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #ff6600',
    paddingBottom: '15px'
  },
  actionsContainer: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  searchLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    backgroundColor: '#ff6600',
    borderRadius: '50%',
    color: '#fff',
    border: 'none',
    transition: 'all 0.2s ease'
  },
  searchIcon: {
    color: '#fff'
  },
  createCommunityButton: {
    backgroundColor: '#ff6600',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s ease'
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
    transition: 'all 0.2s ease'
  }
};

function CommunityCreationButton({ handleCommunityCreated }: 
   { handleCommunityCreated: (newCommunity: CommunityView) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        style={{
          ...styles.createCommunityButton,
          backgroundColor: isHovered ? '#ff8533' : '#ff6600'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Plus size={16} color="#fff" /> Create Community
      </button>
      <CommunityCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </>
  );
}

// Update PostList.tsx to accept customStyles prop
// Add this interface in your PostList component file:
// interface PostListProps {
//   postViews: PostView[];
//   customStyles?: {
//     postItem?: CSSProperties;
//   };
// }

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
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
          <Loader size={48} color="#ff6600" />
        </div>
      </div>
    );
  }
  
  // Apply the paginationStyles to style element or inline styles if needed
  // For example, you can add a style element in the component:
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = paginationStyles;
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
            style={{
              ...styles.searchLink, 
              backgroundColor: isSearchHovered ? '#ff8533' : '#ff6600'
            }}
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
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
          {/* Option 1: Remove customStyles prop if PostList doesn't support it */}
          <PostList postViews={postViews} />
          
          {/* Option 2: If you want to keep customStyles, update your PostList component 
          to accept this prop - see comment above about PostListProps interface */}
        </div>
      )}
      
      <div style={styles.paginationContainer}>
        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    </div>
  );
}

// Define paginationStyles for use in the component
const paginationStyles = `
  .pagination-button {
    background-color: #222;
    color: #fff;
    border: 1px solid #ff6600;
    border-radius: 4px;
    padding: 8px 15px;
    margin: 0 5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .pagination-button:hover {
    background-color: #333;
  }
  
  .pagination-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-page {
    color: #ff6600;
    font-weight: bold;
    margin: 0 10px;
  }
`;

export default ReachingOut;