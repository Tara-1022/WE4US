import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import AnnouncementPostSnippet from "../components/Announcements/AnnouncementPostSnippet";
import { Loader, Search } from "lucide-react";
import { getAnnouncementPostList } from "../library/LemmyApi";
import PostCreationModal from "../components/Announcements/AnnouncementCreationModal";
import { useProfileContext } from "../components/ProfileContext";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import PaginationControls from "../components/PaginationControls";
import { Link } from "react-router-dom";
import "../styles/Announcement.css";

function PostCreationButton({
  handlePostCreated,
}: {
  handlePostCreated: (newPost: PostView) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="new-announcement-button"
        onClick={() => setShowModal(true)}
      >
        New Announcement
      </button>
      <PostCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
}

export default function AnnouncementsPage() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const { profileInfo } = useProfileContext();
  const hasMore = postViews?.length === DEFAULT_POSTS_PER_PAGE;

  useEffect(() => {
    getAnnouncementPostList({ page: page }).then(
      (posts) => setPostViews(posts)
    );
  }, [page]);

  if (!postViews) return <Loader />;
  else {
    const list = postViews.map(
      (postView) => (
        <li key={postView.post.id} className="announcement-list-item">
          <AnnouncementPostSnippet postView={postView} />
        </li>
      ));
    return (
      <div className="announcements-page">
        <div className="announcement-header">
          <h1>Announcements</h1>
          <Link to="/announcements/search">
            <Search size="30" />
          </Link>
        </div>

        {profileInfo?.isAdmin && (
          <PostCreationButton
            handlePostCreated={(newPost: PostView) =>
              setPostViews([newPost, ...postViews])
            }
          />
        )}

        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />

        {postViews.length > 0 ? (
          <ul className="announcement-list">{list}</ul>
        ) : (
          <h3 className="no-announcement-text">No announcements yet!</h3>
        )}

        <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
      </div>
    );
  }
}
