import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import ReactMarkdown from 'react-markdown';
import { MeetUpPostType, defaultPostData } from '../components/MeetUp/MeetUpPostTypes';
import PostEditor from '../components/MeetUp/PostEditor';

function FullPostView({ postView }: { postView: PostView }) {
    let MeetUpDetails: MeetUpPostType = {
        title: postView.post.name,
        url: defaultPostData.url,
        body: defaultPostData.body
    };

    try {
        if (postView.post.body) {
            const parsedData = JSON.parse(postView.post.body);

            MeetUpDetails = {
                title: parsedData.title || postView.post.name,
                url: parsedData.url?.trim() || defaultPostData.url,
                body: {
                    location: parsedData.location || defaultPostData.body.location,
                    datetime: parsedData.datetime || defaultPostData.body.datetime,
                    open_to: parsedData.open_to?.trim() || defaultPostData.body.open_to,
                    additional_details: parsedData.additional_details?.trim() || defaultPostData.body.additional_details
                }
            };
        }
    } catch (error) {
        console.error("Error parsing post body:", error);
    }
    return (
        <>
            <div>
                <h4>{MeetUpDetails.title}</h4>
                <p><strong>Location:</strong> {MeetUpDetails.body.location}</p>
                <p><strong>Date & Time:</strong> {MeetUpDetails.body.datetime}</p>
                <p><strong>Open To:</strong> {MeetUpDetails.body.open_to}</p>

                {MeetUpDetails.url && (
                    <p>
                        <strong>URL:</strong>{" "}
                        <a href={MeetUpDetails.url} target="_blank" rel="noopener noreferrer">
                            {MeetUpDetails.url}
                        </a>
                    </p>
                )}

                {MeetUpDetails.body.additional_details && (
                    <div>
                        <strong>Additional Details:</strong>
                        <ReactMarkdown>{MeetUpDetails.body.additional_details}</ReactMarkdown>
                    </div>
                )}
            </div>
            <p>
                <strong>Posted by:</strong>{' '}
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
            </p>
        </>
    )
}

export default function MeetUpPostPage() {
    const [isEditing, setIsEditing] = useState(false);
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

    return (
        <>
            {isEditing ?
                <PostEditor
                    postView={postView}
                    onPostUpdated={setPostView}
                    onClose={() => setIsEditing(false)}
                />
                :
                <>
                    <FullPostView postView={postView} />

                    {postView.creator.id === profileInfo?.lemmyId && (
                        <PostDeletor postId={postView.post.id} />
                    )}
                </>
            }
            &nbsp;
            {!isEditing && <b
                onClick={() => setIsEditing(true)}
                style={{ cursor: "pointer" }}>
                Edit
            </b>}
            <CommentsSection postId={postView.post.id} />
        </>
    );
}
