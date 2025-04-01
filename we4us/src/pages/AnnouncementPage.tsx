import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import { getAnnouncementPostList } from "../library/LemmyApi"; 

export default function AnnouncementsPage() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await getAnnouncementPostList();
      setPostViews(posts);
    };
    
    loadPosts();
  }, []);
  

  if (!postViews) return <Loader />;
  else if (postViews.length === 0) return <h3>No announcements to see!</h3>;
  else {
      return (
          <>
              <h3>Announcements</h3>
              <PostList postViews={postViews} />
          </>
      );
  }
}
