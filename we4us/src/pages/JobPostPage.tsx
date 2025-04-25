import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import JobPostEditor from '../components/JobBoard/JobPostEditor';
import { useProfileContext } from '../components/ProfileContext';
import { JobPostBody } from '../components/JobBoard/JobTypes';
import ReactMarkDown from "react-markdown";
import "../styles/JobPostPage.css";
import JobStatusChanger from '../components/JobBoard/JobStatusChanger';
import { Link } from 'react-router-dom';


export default function JobPostPage() {
    const jobId = Number(useParams().jobId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { profileInfo } = useProfileContext();
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        getPostById(jobId).then(response => setPostView(response ? response.post_view : null));
    }, [jobId]);

    if (!postView) {
        return (
            <div className="loader-container">
                <Loader className="loader-icon" />
            </div>
        );
    }

    const jobDetails: JobPostBody = JSON.parse(postView.post.body || "{}");

    return (
        <div className="job-post-container">
            {isEditing ? (
                <JobPostEditor
                    postView={postView}
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={setPostView}
                />
            ) : (
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
                               <Link className="detail-value" to={"/profile/" + postView.creator.name}>
                                {postView.creator.display_name || postView.creator.name}
                               </Link>
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
                            <span className="detail-label">Status</span>
                            <span className="detail-value">{jobDetails.open ? "Open" : "Closed"}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Deadline</span>
                            <span className="detail-value deadline">
                                {jobDetails.deadline ? (
                                    new Date(jobDetails.deadline).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? (
                                        <span className="deadline-passed">Deadline Passed</span>
                                    ) : (
                                        jobDetails.deadline
                                    )
                                ) : (
                                    "Job Closed"
                                )}
                            </span>
                        </div>
                        {postView.post.url && (
                            <div className="detail-item">
                                <span className="detail-label">Link</span>
                                <a
                                    href={postView.post.url}
                                    className="detail-value"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Site!
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="job-description">
                        <h3>Job Description</h3>
                        <div className="markdown-content">
                            <ReactMarkDown>{jobDetails.description || "No description provided"}</ReactMarkDown>
                        </div>
                    </div>

                    {postView.creator.id === profileInfo?.lemmyId && (
                        <div className="job-controls">
                            <PostDeletor postId={postView.post.id} />
                            <button
                                style={{
                                    cursor: "pointer",
                                    marginLeft: "0rem",
                                    backgroundColor: isHovered ? "#a29bfe" : "#6c5ce7",
                                    color: "white",
                                    padding: "7px 25px",
                                    border: "none",
                                    borderRadius: "1rem",
                                    transition: "background-color 0.2s ease",
                                }}
                                onClick={() => setIsEditing(true)}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                Edit
                            </button>
                            <JobStatusChanger
                                postId={postView.post.id}
                                initialView={postView}
                                onUpdate={setPostView}
                            />
                        </div>
                    )}
                </article>
            )}
            <CommentsSection postId={postView.post.id} />
        </div>
    );
}
