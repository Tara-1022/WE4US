import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import { JobPostBody } from '../components/JobBoard/JobTypes';
import ReactMarkDown from "react-markdown";
import "../styles/JobPostPage.css";

export default function JobPostPage() {
    const jobId = Number(useParams().jobId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(() => {
        getPostById(jobId).then(response =>setPostView(response ? response.post_view : null))
    }, [jobId]);

    if (!postView) return (
        <div className="loader-container">
            <Loader className="loader-icon" />
        </div>
    );

    let jobDetails: JobPostBody = JSON.parse(postView.post.body || "{}");

    return (
        <div className="job-post-container">
            <article className="job-post-card">
                <header className="job-post-header">
                    <h1 className="job-title">{postView.post.name}</h1>
                    <div className="job-meta">
                        <span className="job-company">{jobDetails.company}</span>
                        <span className="job-type">{jobDetails.job_type}</span>
                    </div>
                </header>

                <div className="job-details-grid">
                    <div className="detail-item">
                        <span className="detail-label">Posted by</span>
                        <span className="detail-value">{postView.creator.display_name || postView.creator.name}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{jobDetails.location || "Remote"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Role</span>
                        <span className="detail-value">{jobDetails.role}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Deadline</span>
                        <span className="detail-value deadline">{jobDetails.deadline || "Rolling"}</span>
                    </div>
                </div>

                {postView.post.url && (
                    <a href={postView.post.url} className="job-apply-button" target="_blank" rel="noopener noreferrer">
                        Apply Now
                    </a>
                )}

                <div className="job-description">
                    <h3>Job Description</h3>
                    <div className="markdown-content">
                        <ReactMarkDown>{jobDetails.description || "No description provided"}</ReactMarkDown>
                    </div>
                </div>

                {postView.creator.id === profileInfo?.lemmyId && (
                    <PostDeletor postId={postView.post.id} />
                )}
            </article>

            <CommentsSection postId={postView.post.id} />
        </div>
    );
}
