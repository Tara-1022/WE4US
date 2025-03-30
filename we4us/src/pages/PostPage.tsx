import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
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

export default function PostPage() {
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();
    
    useEffect(
        () => {
            if (postId) {
                getPostById(Number(postId)).then(
                    response => {
                        setPostView(response ? response.post_view : null);
                        console.log(response)
                    }
                )
            }
        },
        [postId]
    )
    if (!postView) return <Loader />;
    
    const postBody: PostBodyType = getPostBody(postView)
    
    return (
        <>
            {postBody.imageData &&
            <div style={styles.imageContainer}>
                <Link to={constructImageUrl(postBody.imageData)} >
                    <img
                        src={constructImageUrl(postBody.imageData)}
                        alt="PostImage"
                        style={styles.image}
                        title='Click to view full image' />
                </Link>
                </div>
            }
            <div>
                <h3>{postView.post.name}</h3>
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
                <Link to={"/community/" + postView.community.id}>
                    <p>{postView.community.name}</p>
                </Link>
                <ReactMarkdown>{postBody.body}</ReactMarkdown>
            </div>

            <LikeHandler forPost={true} isInitiallyLiked={postView.my_vote == 1} initialLikes={postView.counts.score} id={Number(postId)} />

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} imageData={postBody.imageData} />}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}