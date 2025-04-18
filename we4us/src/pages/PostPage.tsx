import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader, MessageSquare, Share2, Edit } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import LikeHandler from '../components/LikeHandler';
import { getPostBody, PostBodyType } from '../library/PostBodyType';
import { constructImageUrl } from '../library/LemmyImageHandling';
import ReactMarkdown from "react-markdown";
import PostEditor from '../components/PostEditor';
import "../styles/FullImageView.css";
import "../styles/PostPage.css";

function FullPostView({ postView, postBody }: { postView: PostView, postBody: PostBodyType }) {
    return (
        <div className="post-content">
            {postBody.imageData &&
                <div className='post-image-container'>
                    <Link to={constructImageUrl(postBody.imageData)}>
                        <img
                            src={constructImageUrl(postBody.imageData)}
                            alt="PostImage"
                            className='post-image'
                            title='Click to view full image' />
                    </Link>
                </div>
            }
            
            {postView.post.url && 
                <a href={postView.post.url} target='_blank' rel="noopener noreferrer" className="post-url">
                    {postView.post.url}
                </a>
            }
            
            <div className="post-body">
                <ReactMarkdown>{postBody.body}</ReactMarkdown>
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
                    console.log(response);
                }
            )
        },
        [postId]
    )
    
    if (!postView) return (
        <div className="loading-container">
            <Loader className="loading-icon" />
        </div>
    );

    const postBody: PostBodyType = getPostBody(postView);

    return (
        <div className="post-container">
            {isEditing ? (
                <PostEditor
                    postView={postView}
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={(updatedPostView) => setPostView(updatedPostView)} 
                />
            ) : (
                <>
                    <div className="post-header">
                        <div className="post-meta">
                            <span className="post-source">
                                Posted in <Link to={"/community/" + postView.community.id} className="community-link">
                                    {postView.community.name}
                                </Link> by <Link to={"/profile/" + postView.creator.name} className="user-link">
                                    {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                                </Link>
                            </span>
                            <span className="post-date">
                                Published on {new Date(postView.post.published).toLocaleString()}
                                {postView.post.updated && 
                                    <span className="last-edit">
                                        · Last edited {new Date(postView.post.updated).toLocaleString()}
                                    </span>
                                }
                            </span>
                        </div>
                        <h3 className="post-title">{postView.post.name}</h3>
                    </div>
                    
                    <FullPostView postView={postView} postBody={postBody} />
                    
                    <div className="post-actions">
                        <div className="vote-container">
                            <LikeHandler 
                                id={postId} 
                                forPost={true} 
                                isInitiallyLiked={postView.my_vote == 1} 
                                initialLikes={postView.counts.score} 
                            />
                        </div>
                        
                        <button className="action-button">
                            <MessageSquare size={16} />
                            {postView.counts.comments} Comments
                        </button>
                        
                        <button className="action-button">
                            <Share2 size={16} />
                            Share
                        </button>
                        
                        {postView.creator.id == profileInfo?.lemmyId && (
                            <div className="author-actions">
                                <button 
                                    className="action-button edit-button"
                                    onClick={() => setIsEditing(true)}>
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <div className="delete-button-wrapper">
                                    <PostDeletor postId={postView.post.id} imageData={postBody.imageData} />
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            
            <div className="comments-section">
                <CommentsSection postId={postView.post.id} />
            </div>
        </div>
    );
}