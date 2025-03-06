import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import { getJobPostList } from "../library/LemmyApi";

export default function JobBoardPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(
        () => {
            getJobPostList().then(
                (postViews) => { setPostViews(postViews) }
            )
        }, [])

    if (!postViews) return <Loader />;
    else if (postViews.length == 0) return <h3>No posts to see!</h3>;
    else {
        return (
            <>
                <h3>Job board</h3>
                <PostList postViews={postViews} />
            </>
        )
    }
}