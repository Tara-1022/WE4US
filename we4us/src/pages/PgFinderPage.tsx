import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PgPostList from "../components/PgFinder/PgPostList";
import { Loader, Search } from 'lucide-react';
import { getPgPostList } from "../library/LemmyApi";
import { Link } from "react-router-dom";
import PostCreationHandler from "../components/PgFinder/PostCreationHandler";
import "../components/PgFinder/PgFinderPage.css";

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
                <h3 style={{textAlign: "center"}}>PG FINDER</h3>
                <Link to="/pg-finder/search"><Search /></Link>
                <PostCreationHandler handleCreatedPost={(newPost) => { setPostViews([newPost, ...postViews]) }} />
                {postViews.length > 0 ?
                    <PgPostList postViews={postViews} />
                    :
                    <h3>No PGs yet!</h3>
                }
            </>
        )
    }
}