import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import ReactMarkdown from 'react-markdown';
import { MeetUpPostBody } from '../components/MeetUp/MeetUpPostTypes';

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

    if (!postView) return <Loader size={32} strokeWidth={2} className="animate-spin" />;

    let MeetUpDetails: MeetUpPostBody = {
        title: postView.post.name,
        location: "Unknown",
        datetime: "Not Specified",
        open_to: "All",
        url: "",
        additional_details: ""
    };

    try {
        if (postView.post.body) {
            const parsedData = JSON.parse(postView.post.body);

            MeetUpDetails = {
                title: parsedData.title || postView.post.name,
                location: parsedData.location || "Unknown",
                datetime: parsedData.datetime || "Not Specified",
                open_to: parsedData.open_to?.trim() || "All",
                url: parsedData.url?.trim() || "",
                additional_details: parsedData.additional_details?.trim() || ""
            };
        }
    } catch (error) {
        console.error("Error parsing post body:", error);
    }

    return (
        <>
            <div>
                <h3>{MeetUpDetails.title}</h3>
                <p><strong>Location:</strong> {MeetUpDetails.location}</p>
                <p><strong>Date & Time:</strong> {MeetUpDetails.datetime}</p>
                <p><strong>Open To:</strong> {MeetUpDetails.open_to}</p>

                {MeetUpDetails.url && (
                    <p>
                        <strong>URL:</strong>{" "}
                        <a href={MeetUpDetails.url} target="_blank" rel="noopener noreferrer">
                            {MeetUpDetails.url}
                        </a>
                    </p>
                )}

                {MeetUpDetails.additional_details && (
                    <div>
                        <strong>Additional Details:</strong>
                        <ReactMarkdown>{MeetUpDetails.additional_details}</ReactMarkdown>
                    </div>
                )}
            </div>

            {postView.creator.id === profileInfo?.lemmyId && (
                <PostDeletor postId={postView.post.id} />
            )}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}
