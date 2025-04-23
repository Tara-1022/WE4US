import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import JobPostEditor from '../components/JobBoard/JobPostEditor';
import { useProfileContext } from '../components/ProfileContext';
import { JobPostBody } from '../components/JobBoard/JobTypes';
import ReactMarkDown from "react-markdown";

export function FullPost({ postView }: { postView: PostView }) {
    let jobDetails: JobPostBody = JSON.parse(postView.post.body || "{}");

    return (
        <div>
            <h3>{postView.post.name}</h3>
            <p>Posted by: &nbsp;
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name || postView.creator.name}
                </Link></p>
            <p><strong>Company:</strong> {jobDetails.company}</p>
            <p><strong>Job Status:</strong> {jobDetails.open ? "Open" : "Closed"}</p>
            <p><strong>Deadline:</strong> {jobDetails.deadline || "Not specified"}</p>
            <p><strong>Role:</strong> {jobDetails.role}</p>
            <p><strong>Location:</strong> {jobDetails.location}</p>
            <p><strong>Job Link:</strong> <a href={postView.post.url} target="_blank" rel="noopener noreferrer">{postView.post.url}</a></p>
            <p><strong>Type:</strong> {jobDetails.job_type}</p>
            <p><strong>Description:</strong> <ReactMarkDown>{jobDetails.description}</ReactMarkDown></p>
        </div>
    )
}

export default function JobPostPage() {
    const jobId = Number(useParams().jobId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { profileInfo } = useProfileContext();

    useEffect(() => {
        getPostById(jobId).then(response =>
            setPostView(response ? response.post_view : null)
        );
    }, [jobId]);

    if (!postView) return <Loader />;


    return (
        <>
            {
                isEditing ?
                    <JobPostEditor postView={postView} onClose={() => setIsEditing(false)} onPostUpdated={setPostView} />
                    :
                    <>
                        <FullPost postView={postView} />
                        {postView.creator.id === profileInfo?.lemmyId &&
                            <>
                                <PostDeletor postId={postView.post.id} />
                                &nbsp;
                                {!isEditing &&
                                    <b
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </b>}
                            </>}

                    </>
            }


            <CommentsSection postId={postView.post.id} />
        </>
    );
}
