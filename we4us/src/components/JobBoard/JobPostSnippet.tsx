import { PostView } from 'lemmy-js-client';
import { Link } from 'react-router-dom';
import { JobPostBody } from './JobTypes';
import "../../styles/JobBoardPage.css";

export default function JobPostSnippet({ postView }: { postView: PostView }) {
    // Parse the post body
    let postBody: Partial<JobPostBody> = {};
    
    try {
        postBody = postView.post.body ? JSON.parse(postView.post.body) : {};
    } catch (error) {
        console.error("Error parsing post body:", error);
    }

    return (
        <div className="job-post-item">
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
                        <span className="job-detail-label">Posted by:</span>
                        <strong className="job-detail-value">
                            {postView.creator.display_name || postView.creator.name}
                        </strong>
                    </div>
                    
                    <div className="job-detail-item">
                        <span className="job-detail-label">Company:</span>
                        <strong className="job-detail-value">
                            {postBody.company || "Not specified"}
                        </strong>
                    </div>
                    
                    <div className="job-detail-item">
                        <span className="job-detail-label">Type:</span>
                        <strong className="job-detail-value">
                            {postBody.job_type || "Not specified"}
                        </strong>
                    </div>
                    
                    <div className="job-detail-item">
                        <span className="job-detail-label">Role:</span>
                        <strong className="job-detail-value">
                            {postBody.role || "Not mentioned"}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}