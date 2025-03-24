import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import JobPostList from "../job_board/JobPostList";
import { Loader } from 'lucide-react';
import { getJobPostList } from "../library/LemmyApi";
import PostCreationHandler from "../job_board/PostCreationHandler";
import "../styles/JobBoardPage.css"

export default function JobBoardPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getJobPostList().then((postViews) => {
            setPostViews(postViews);
        });
    }, []);

    if (!postViews) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    if (postViews.length === 0) return <h3>No posts to see!</h3>;

    return (
        <div className="job-board-container"> 
            <h1>Job Board</h1>
            
    
            {/* Search Box */}
            <input
                type="text"
                placeholder="Search by name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
    
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
            <JobPostList postViews={postViews.filter(post => 
                post.post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.post.body?.toLowerCase().includes(searchQuery.toLowerCase())
            )} />
        </div>
    );

}
