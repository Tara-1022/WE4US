import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_image.png'
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import LikeHandler from '../components/LikeHandler';

export default function PostPage() {
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(postId).then(
                response =>
                    setPostView(response ? response.post_view : null)
            )
        },
        [postId]
    )
    if (!postView) return <Loader />;
    return (
        <>
            <div>
                <img
                    src={postView.image_details ? postView.image_details.link : default_image}
                    alt="PostImage" />
            </div>
            <div>
                <h3>{postView.post.name}</h3>
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
                <Link to={"/community/" + postView.community.id}>
                    <p>{postView.community.name}</p>
                </Link>
                <p>{postView.post.body}</p>
            </div>

            <LikeHandler forPost={true} isInitiallyLiked={postView.my_vote == 1} initialLikes={postView.counts.score} id={postId} />

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} />}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}