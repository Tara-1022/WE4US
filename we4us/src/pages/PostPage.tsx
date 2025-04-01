import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import LikeHandler from '../components/LikeHandler';
import { getPostBody, PostBodyType } from '../library/PostBodyType';
import { constructImageUrl } from '../library/LemmyImageHandling';
import ReactMarkdown from "react-markdown"

let styles: { [key: string]: React.CSSProperties } = {
    imageContainer: {
        width: "50%",
        maxWidth: "500px",
        flex: 1,
        aspectRatio: "1",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },
}

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
                <h3>{postView.post.name}</h3>
                <a href={postView.post.url} target='_blank' rel="noopener noreferrer">{postView.post.url}</a>
                <br/>
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
                <Link to={"/community/" + postView.community.id}>
                    <p>{postView.community.name}</p>
                </Link>
                <ReactMarkdown>{postBody.body}</ReactMarkdown>
            </div>

            {postView.creator.id === profileInfo?.lemmyId && (
                <PostDeletor postId={postView.post.id} />
            )}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}
