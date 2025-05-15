import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import MeetUpPostList from "../components/MeetUp/MeetUpPostList";
import { Loader, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getMeetUpPostList } from "../library/LemmyApi";
import PostCreationHandler from "../components/MeetUp/PostCreationHandler";

export default function MeetUpPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(() => {
        getMeetUpPostList().then(setPostViews);
    }, []);

    if (!postViews) return <Loader />;

    return (
        <>
            <h1>Meet Up</h1>
            <Link to="/meetup/search"><Search /></Link>
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...(postViews || [])])} />
            {postViews.length === 0 ? (
                <h3>No posts to see!</h3>
            ) : (
                <MeetUpPostList postViews={postViews} />
            )}
        </>
    );
}
