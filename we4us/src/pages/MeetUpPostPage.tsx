import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import ReactMarkdown from 'react-markdown';
import { MeetUpPostBody } from '../components/MeetUp/MeetUpPostTypes';
import './MeetUpPostPage.css'; // 👈 Import the CSS

export default function MeetUpPostPage() {
    const meetUpId = Number(useParams().meetUpId);
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
        <div className="meetup-post-container">
            <h4 className="meetup-post-title">{MeetUpDetails.title}</h4>

            <div className="meetup-post-section">
                <p><strong>Location:</strong> {MeetUpDetails.location}</p>
                <p><strong>Date & Time:</strong> {MeetUpDetails.datetime}</p>
                <p><strong>Open To:</strong> {MeetUpDetails.open_to}</p>

                {MeetUpDetails.url && (
                    <p>
                        <strong>URL:</strong>{' '}
                        <a href={MeetUpDetails.url} target="_blank" rel="noopener noreferrer">
                            {MeetUpDetails.url}
                        </a>
                    </p>
                )}
            </div>

            {MeetUpDetails.additional_details && (
                <div className="meetup-post-section">
                    <strong>Additional Details:</strong>
                    <div className="meetup-post-details">
                        <ReactMarkdown>{MeetUpDetails.additional_details}</ReactMarkdown>
                    </div>
                </div>
            )}

            <p className="meetup-post-author">
                <strong>Posted by:</strong>{' '}
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name || postView.creator.name}
                </Link>
            </p>

            <div className="meetup-post-footer">
                {postView.creator.id === profileInfo?.lemmyId && (
                    <PostDeletor postId={postView.post.id} />
                )}

                <CommentsSection postId={postView.post.id} />
            </div>
        </div>
    );
}
