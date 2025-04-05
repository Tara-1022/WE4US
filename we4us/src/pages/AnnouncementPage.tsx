import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import AnnouncementPostSnippet from "../announcements/AnnouncementPostSnippet";
import { Loader } from 'lucide-react';
import { getAnnouncementPostList } from "../library/LemmyApi";
import PostCreationModal from "../announcements/AnnouncementCreationModal";
import { useProfileContext } from "../components/ProfileContext";

let styles = {
  list: {
    listStyleType: "none",
    margin: 0,
    padding: 0
  },
  listItem: {

  },
  text: {
    marginTop: "5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
}

function PostCreationButton({ handlePostCreated }:
  { handlePostCreated: (newPost: PostView) => void }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>New Announcement</button>
      <PostCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}

export default function AnnouncementsPage() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const { profileInfo } = useProfileContext();

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await getAnnouncementPostList();
      setPostViews(posts);
    };

    loadPosts();
  }, []);


  if (!postViews) return <Loader />;
  else {
    const list = postViews.map(
      postView => <li key={postView.post.id} style={styles.listItem}>
        <AnnouncementPostSnippet postView={postView} />
      </li>
    );
    return (
      <>
        <h1>Announcements</h1>
        {
          profileInfo?.isAdmin &&
          <PostCreationButton handlePostCreated={(newPost: PostView) => setPostViews([newPost, ...postViews])} />
        }
        {postViews.length > 0 ?
          <ul style={styles.list}>{list}</ul>
          :
          <h3 style={styles.text}>No announcements yet!</h3>
        }
      </>
    );
  }
}
