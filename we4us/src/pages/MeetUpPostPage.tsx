import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';

export type MeetUpPostBody = {
    location: string;
    datetime: string;
    access: string;
};

export default function MeetUpPostPage() {
    const meetUpId = Number(useParams().meetUpId);
    console.log(meetUpId);
    
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(() => {
        getPostById(meetUpId).then(response => {
            setPostView(response ? response.post_view : null);
        });
    }, [meetUpId]);

    if (!postView) return <Loader />;

    let MeetUpDetails: MeetUpPostBody = { location: "Unknown", datetime: "Not Specified", access: "Open to All" };

    try {
        if (postView.post.body) {
            MeetUpDetails = JSON.parse(postView.post.body);
        }
    } catch (error) {
        console.error("Error parsing post body:", error);
    }

    return (
        <>
            <div>
                <h3>{postView.post.name}</h3>
                <p>Organizer: {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}</p>
                <p><strong>Location:</strong> {MeetUpDetails.location}</p>
                <p><strong>Date & Time:</strong> {MeetUpDetails.datetime}</p>
                <p><strong>Access:</strong> {MeetUpDetails.access}</p>
            </div>

            {postView.creator.id === profileInfo?.lemmyId && (
                <PostDeletor postId={postView.post.id} />
            )}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}
