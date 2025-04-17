import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import MeetUpPostList from "../components/MeetUp/MeetUpPostList";
import { Loader, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getMeetUpPostList } from "../library/LemmyApi";
import PostCreationHandler from "../components/MeetUp/PostCreationHandler";
import './MeetUpPage.css';

export default function MeetUpPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(() => {
        getMeetUpPostList().then(setPostViews);
    }, []);

    if (!postViews) return <Loader />;

    return (
        <div className="meetup-page">
          <div className="meetup-header-row">
            <h2 className="meetup-header">Meet Up</h2>
            <PostCreationHandler
              handleCreatedPost={(newPost) => setPostViews([newPost, ...(postViews || [])])}
            />
          </div>
      
          {postViews.length === 0 ? (
            <h3 className="no-posts">No posts to see!</h3>
          ) : (
            <MeetUpPostList postViews={postViews} />
          )}
        </div>
      );
      
}
