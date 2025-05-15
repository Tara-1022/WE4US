import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import MeetUpPostList from "../components/MeetUp/MeetUpPostList";
import { Loader, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getMeetUpPostList } from "../library/LemmyApi";
import PostCreationHandler from "../components/MeetUp/PostCreationHandler";
import PaginationControls from "../components/PaginationControls";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import "../styles/MeetUpPage.css";

export default function MeetUpPage() {
    const [postViews, setPostViews] = useState<PostView[]>([]);
    const [page, setPage] = useState<number>(1);
    const hasMore = postViews.length >= DEFAULT_POSTS_PER_PAGE;

    useEffect(() => {
        getMeetUpPostList(page).then(setPostViews);
    }, [page]);
    if (!postViews) return <Loader />;

    return (
        <div className="meetup-page">
            <div className="meetup-header-row">
                <h2 className="meetup-header">Meet Up</h2>
                <div className="meetup-header-actions">
                    <Link to="/meetup/search">
                        <Search className="meetup-search-icon" />
                    </Link>
                    <PostCreationHandler
                        handleCreatedPost={(newPost) => setPostViews([newPost, ...(postViews || [])])}
                    />
                </div>
            </div>

            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />

            {postViews.length === 0 ? (
                <h3 className="no-posts">No posts to see!</h3>
            ) : (
                <MeetUpPostList postViews={postViews} />
            )}
            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
        </div>
    );
    
}
