import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_image.png'
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';

export default function PostPage(){
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
    useEffect(
        () => {
            getPostById(postId).then(
                response =>
                setPostView(response? response.post_view : null)
            )
        },
        [postId]
    )
    if (!postView) return <Loader />;
    return (
        <>
            <div>
                <img 
                src={postView.image_details? postView.image_details.link : default_image} 
                alt="PostImage" />
            </div>
            <div>
                <h3>{postView.post.name}</h3>
                <p>{postView.creator.display_name?postView.creator.display_name:postView.creator.name}</p>
                <p>{postView.community.name}</p>
                <p>{postView.post.body}</p>
            </div>
            <PostDeletor postId={postView.post.id}/>
            <CommentsSection postId={postView.post.id}/>
        </>
    );
}