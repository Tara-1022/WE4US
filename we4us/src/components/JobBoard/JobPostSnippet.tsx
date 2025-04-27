import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';
import { JobPostBody } from './JobTypes';
import "../../styles/JobBoardPage.css";

export default function JobPostSnippet({ postView }: { postView: PostView }) {
    
    let postBody: Partial<JobPostBody> = {};
    
    try {
        postBody = postView.post.body ? JSON.parse(postView.post.body) : {};
    } catch (error) {
        console.error("Error parsing post body:", error);
    }

    const isClosed = postBody.open === false;

    return (
        <div className={`job-post-item ${isClosed ? "job-closed" : ""}`}>
            <div className="job-header">
                <h3 className="job-title">
                    {postView.post.name}
                </h3>
                <Link 
                    to={`/job-board/${postView.post.id}`} 
                    className="apply-now-button"
                >
                    More Info
                </Link>
            </div>
            
            <div className="job-details">
                <div className="job-details-row">
                    <div className="job-detail-item">
                        <strong className="job-detail-label">Posted by: </strong>
                        <span className="job-detail-value">
                            {postView.creator.display_name || postView.creator.name}
                        </span>
                    </div>
                    
                    <div className="job-detail-item">
                        <strong className="job-detail-label">Company: </strong>
                        <span className="job-detail-value">
                            {postBody.company || "Not specified"}
                        </span>
                    </div>
                    
                    <div className="job-detail-item">
                        <strong className="job-detail-label">Type: </strong>
                        <span className="job-detail-value">
                            {postBody.job_type || "Not specified"}
                        </span>
                    </div>
                    
                    <div className="job-detail-item">
                        <strong className="job-detail-label">Role: </strong>
                        <span className="job-detail-value">
                            {postBody.role || "Not mentioned"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}