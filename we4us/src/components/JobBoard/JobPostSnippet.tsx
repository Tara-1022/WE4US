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
                    className="more-info-button"
                >
                    More Info
                </Link>
            </div>
            
            <div className="job-snippet-details">
                <div className="job-details-row">
                    <div className="job-snippet-detail-item">
                        <strong className="job-snippet-detail-label">Posted by: </strong>
                        <span className="job-snippet-detail-value">
                            {postView.creator.display_name || postView.creator.name}
                        </span>
                    </div>
                    
                    <div className="job-snippet-detail-item">
                        <strong className="job-snippet-detail-label">Company: </strong>
                        <span className="job-snippet-detail-value">
                            {postBody.company || "Not specified"}
                        </span>
                    </div>
                    
                    <div className="job-snippet-detail-item">
                        <strong className="job-snippet-detail-label">Type: </strong>
                        <span className="job-snippet-detail-value">
                            {postBody.job_type || "Not specified"}
                        </span>
                    </div>
                    
                    <div className="job-snippet-detail-item">
                        <strong className="job-snippet-detail-label">Role: </strong>
                        <span className="job-snippet-detail-value">
                            {postBody.role || "Not mentioned"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}