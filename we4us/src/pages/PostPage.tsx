import { PostView } from 'lemmy-js-client';
import default_image from '../assets/default_image.png'
import { useEffect, useState } from 'react';
import { getPostById, editPost } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import LikeHandler from '../components/LikeHandler';
import PostEditor from '../components/PostEditor';

export default function PostPage() {
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const { profileInfo } = useProfileContext();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedBody, setEditedBody] = useState("");

    useEffect(
        () => {
            getPostById(postId).then(
                response =>
                    setPostView(response ? response.post_view : null)
            )
        },
        [postId]
    )

    async function handleSave() {
        if (!postView) return;
        try {
            const updatedPost = await editPost(postView.post.id, editedTitle, editedBody);
            setPostView({ ...postView, post: updatedPost.post });
            setIsEditing(false);
        } catch (error) {
            window.alert("Failed to update post.");
            console.error(error);
        }
    }

    if (!postView) return <Loader />;
    return (
        <>
            <div>
                <img
                    src={postView.image_details ? postView.image_details.link : default_image}
                    alt="PostImage" />
            </div>
            <div>{isEditing ? (
                <>
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder={postView.post.name}
                        style={{ width: "100%", fontSize: "1.5em" }}
                    />
                    <textarea
                        value={editedBody}
                        onChange={(e) => setEditedBody(e.target.value)}
                        placeholder={postView.post.body || "No content"}
                        style={{ width: "100%", minHeight: "100px" }}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <h3>{postView.post.name}</h3>
                    <Link to={"/profile/" + postView.creator.name}>
                        {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                    </Link>
                    <Link to={"/community/" + postView.community.id}>
                        <p>{postView.community.name}</p>
                    </Link>
                    <p>{postView.post.body}</p>
                </>
            )}
            </div>

            <LikeHandler forPost={true} isInitiallyLiked={postView.my_vote == 1} initialLikes={postView.counts.score} id={postId} />

            {postView.creator.id == profileInfo?.lemmyId &&
                <PostDeletor postId={postView.post.id} />}

            {postView.creator.id === profileInfo?.lemmyId && (
                <>
                    <br />
                    <b onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
                        Edit
                    </b>
                    <br />
                </>
            )}

            <CommentsSection postId={postView.post.id} />
        </>
    );
}