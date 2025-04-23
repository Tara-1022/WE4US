import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PgPostList from "../components/PgFinder/PgPostList";
import { Loader, Search } from 'lucide-react';
import { getPgPostList } from "../library/LemmyApi";
import { Link } from "react-router-dom";
import PostCreationHandler from "../components/PgFinder/PostCreationHandler";
import PaginationControls from "../components/PaginationControls";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import "../styles/PgPost.css"

export default function PgFinderPage() {
    const [postViews, setPostViews] = useState<PostView[]>([]);
    const [page, setPage] = useState<number>(1);
    const hasMore = postViews.length >= DEFAULT_POSTS_PER_PAGE;

    useEffect(
        () => {
        getPgPostList(page).then(setPostViews);
    }, [page]);
    if (!postViews) return <Loader />;

    return (
        <>
            <h3>PG FINDER</h3>
            <Link to="/pg-finder/search"><Search /></Link>
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
            
            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
            
            {postViews.length > 0 ? (
                <PgPostList postViews={postViews} />
            ) : (
                <h3>No PGs yet!</h3>
            )}
            
            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
        </>
    )
}