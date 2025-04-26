import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import JobPostList from "../components/JobBoard/JobPostList";
import { Loader, Search } from 'lucide-react';
import { getJobPostList } from "../library/LemmyApi";
import { Link } from "react-router-dom";
import PostCreationHandler from "../components/JobBoard/PostCreationHandler";
import PaginationControls from "../components/PaginationControls";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";
import "../styles/JobBoardPage.css"

export default function JobBoardPage() {
    const [postViews, setPostViews] = useState<PostView[]>([]);
    const [page, setPage] = useState<number>(1);
    const hasMore = postViews.length >= DEFAULT_POSTS_PER_PAGE;

    useEffect(() => {
        getJobPostList(page).then(setPostViews);
    }, [page]);

    if (!postViews) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }
    
    return (
        <div className="job-board-container">
            <h1>Job Board</h1>

            <Link to="/job-board/search"><Search /></Link>
            
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
            {postViews.length > 0 ? (<JobPostList postViews={postViews} />) : (<h3>No jobs right now!</h3>)}
            <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
        </div>
    );
}
