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
import { constructImageUrl } from '../library/ImageHandling';
import ReactMarkdown from "react-markdown"
import PostEditor from '../components/PostEditor';
import "../styles/FullImageView.css"

function FullPostView({ postView, postBody }: { postView: PostView, postBody: PostBodyType }) {

    return (
        <div>
            {postBody.imageData &&
                <div className='imageContainer'>
                    <Link to={constructImageUrl(postBody.imageData)} >
                        <img
                            src={constructImageUrl(postBody.imageData)}
                            alt="PostImage"
                            className='image'
                            title='Click to view full image' />
                    </Link>
                </div>
            }
            <div>
                <h3>{postView.post.name}</h3>
                <a href={postView.post.url} target='_blank' rel="noopener noreferrer">{postView.post.url}</a>
                <br />
                <Link to={"/profile/" + postView.creator.name}>
                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                </Link>
                <Link to={"/community/" + postView.community.id}>
                    <p>{postView.community.name}</p>
                </Link>
                <ReactMarkdown>{postBody.body}</ReactMarkdown>
                <p>Created: &nbsp;
                    {new Date(postView.post.published).toLocaleString()} </p>
                <p>
                    {postView.post.updated ?
                        "Edited: " + new Date(postView.post.updated).toLocaleString() :
                        ""}
                </p>
            </div>
        </div>
    )
}

export default function PostPage() {
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(postId).then(
                response => {
                    setPostView(response ? response.post_view : null);
                    console.log(response)
                }
            )
        },
        [postId]
    )
    if (!postView) return <Loader />;

    const postBody: PostBodyType = getPostBody(postView)

    return (<>
        {isEditing ?
            <PostEditor
                postView={postView}
                onClose={() => setIsEditing(false)}
                onPostUpdated={(updatedPostView) => setPostView(updatedPostView)} />
            :
            <>
                <FullPostView postView={postView} postBody={postBody} />

                <LikeHandler
                    id={postId}
                    forPost={true}
                    isInitiallyLiked={postView.my_vote == 1}
                    initialLikes={postView.counts.score} />

                {postView.creator.id == profileInfo?.lemmyId &&
                    <>
                        &nbsp;
                        <PostDeletor postId={postView.post.id} imageData={postBody.imageData} />
                        &nbsp;
                        <b
                            onClick={() => setIsEditing(true)}
                            style={{ cursor: "pointer" }}>
                            Edit
                        </b>
                    </>}
            </>
        }
        <CommentsSection postId={postView.post.id} />
    </>
    );
}