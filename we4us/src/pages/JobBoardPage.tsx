import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import JobPostList from "../components/JobBoard/JobPostList";
import { Loader } from 'lucide-react';
import { getJobPostList } from "../library/LemmyApi";
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
        <div className="job-board-container"> 
          <div className="job-board-header">
            <h1>Job Board</h1>
            <PostCreationHandler handleCreatedPost={(newPost) => setPostViews([newPost, ...postViews])} />
          </div>
      
          {postViews.length > 0 ? (
            <JobPostList postViews={postViews} />
          ) : (
            <h3>No jobs right now!</h3>
          )}
        </div>
      );
      
}
