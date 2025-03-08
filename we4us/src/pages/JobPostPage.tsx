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
    console.log(jobId)
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(jobId).then(
                response =>
                    setPostView(response ? response.post_view : null)
            )
        },
        [jobId]
    )
    if (!postView) return <Loader />;
    let jobDetails: JobPostBody = JSON.parse(postView.post.body || "");

    return (
        <>
            <div>
                <h3>{postView.post.name}</h3>
                <p>{postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
                <p>URL: {postView.post.url}</p>
                <p>Extra Field: {jobDetails.extra_field}</p>
                <p>Actual Body: {jobDetails.body}</p>
                This was extracted from body: {postView.post.body}
            </div>

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} />}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}