import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PgPostList from "../components/PgFinder/PgPostList";
import { Loader, Search } from 'lucide-react';
import { getPgPostList } from "../library/LemmyApi";
import { Link } from "react-router-dom";
import PostCreationHandler from "../components/PgFinder/PostCreationHandler";
import "../styles/PgFinderPage.css";
import PaginationControls from "../components/PaginationControls";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import "../styles/PgPostPage.css"

export default function PgFinderPage() {
    const [postViews, setPostViews] = useState<PostView[]>([]);
    const [page, setPage] = useState<number>(1);
    const hasMore = postViews.length >= DEFAULT_POSTS_PER_PAGE;

    useEffect(
        () => {
        getPgPostList(page).then(setPostViews);
    }, [page]);
    if (!postViews) return <Loader />;
    else if (postViews.length == 0) return <h3>No posts to see!</h3>;
    else {
        return (
            <>
                <h2 style={{ textAlign: "center" }}>PG Finder</h2>
                <div className="pg-header-actions">
                    <div className="pg-search-wrapper">
                        <Link to="/pg-finder/search">
                        <Search className="search-icon" />
                        </Link>
                    </div>
                        <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
                    </div>
                

                <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
                {postViews.length > 0 ?
                    <PgPostList postViews={postViews} />
                 : ( 
                    <h3>No PGs yet!</h3>
                )}

                <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
            </>
        )
    }
}