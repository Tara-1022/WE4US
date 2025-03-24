import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import { JobPostBody } from '../job_board/PostCreationHandler';

export default function JobPostPage() {
    const jobId = Number(useParams().jobId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(() => {
        getPostById(jobId).then(response =>
            setPostView(response ? response.post_view : null)
        );
    }, [jobId]);

    if (!postView) return <Loader />;
    
    let jobDetails: JobPostBody = JSON.parse(postView.post.body || "{}");

    return (
        <>
            <div>
                <h3>{postView.post.name}</h3>
                <p>Posted by: {postView.creator.display_name || postView.creator.name}</p>
                <p><strong>Company:</strong> {jobDetails.company}</p>
                <p><strong>Role:</strong> {jobDetails.role}</p>
                <p><strong>Location:</strong> {jobDetails.location}</p>
                <p><strong>Experience Required:</strong> {jobDetails.experience || "Not specified"}</p>
                <p><strong>Job Status:</strong> {jobDetails.open ? "Open" : "Closed"}</p>
                <p><strong>Referral Available:</strong> {jobDetails.referral ? "Yes" : "No"}</p>
                <p><strong>Deadline:</strong> {jobDetails.deadline || "Not specified"}</p>
                {jobDetails.internship_duration && (
                    <p><strong>Internship Duration:</strong> {jobDetails.internship_duration}</p>
                )}
                <p><strong>Job Link/ID:</strong> <a href={jobDetails.job_link} target="_blank" rel="noopener noreferrer">{jobDetails.job_link}</a></p>
                <p><strong>Description:</strong> {jobDetails.description}</p>
            </div>

            {postView.creator.id === profileInfo?.lemmyId && (
                <PostDeletor postId={postView.post.id} />
            )}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}
