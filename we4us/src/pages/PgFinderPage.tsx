import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PgPostList from "../pg_finder/PgPostList";
import { Loader } from 'lucide-react';
import { getPgPostList } from "../library/LemmyApi";
import PostCreationHandler from "../pg_finder/PostCreationHandler";
import "../styles/PgPost.css"

export default function PgFinderPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(
        () => {
            getPgPostList().then(
                (postViews) => { setPostViews(postViews) }
            )
        }, [])
  

    if (!postViews) return <Loader />;
    else if (postViews.length == 0) return <h3>No posts to see!</h3>;
    else {
        return (
            <>
                <h3>PG FINDER</h3>
                <PostCreationHandler handleCreatedPost={(newPost) => { setPostViews([newPost, ...postViews]) }} />
                <PgPostList postViews={postViews} />
            </>
        )
    }
}