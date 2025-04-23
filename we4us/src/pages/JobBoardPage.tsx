import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import JobPostList from "../components/JobBoard/JobPostList";
import { Loader, Search } from 'lucide-react';
import { getJobPostList } from "../library/LemmyApi";
import { Link } from "react-router-dom";
import PostCreationHandler from "../components/JobBoard/PostCreationHandler";
import "../styles/JobBoardPage.css"

export default function JobBoardPage() {
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

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


    return (
        <div className="page">
            <div className="job-board-container">
                <h1>Job Board</h1>

                <Link to="/job-board/search"><Search /></Link>

                <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
                {postViews.length > 0 ? (<JobPostList postViews={postViews} />) : (<h3>No jobs right now!</h3>)}
            </div>
        </div>
    );

}
