import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import MeetUpPostList from "../components/MeetUp/MeetUpPostList";
import { Loader } from "lucide-react";
import { getMeetUpPostList } from "../library/LemmyApi";
import PostCreationHandler from "../components/MeetUp/PostCreationHandler";

export default function MeetUpPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(() => {
        getMeetUpPostList().then(setPostViews);
    }, []);

    if (!postViews) return <Loader />;
    if (postViews.length === 0) return <h3>No posts to see!</h3>;

    return (
        <>
            <h3>Meet Up</h3>
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
            <MeetUpPostList postViews={postViews} />
        </>
    );
}
