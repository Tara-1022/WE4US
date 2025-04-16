import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader, MessageSquare, Share2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import PostDeletor from '../components/PostDeletor';
import { useProfileContext } from '../components/ProfileContext';
import LikeHandler from '../components/LikeHandler';
import { getPostBody, PostBodyType } from '../library/PostBodyType';
import { constructImageUrl } from '../library/LemmyImageHandling';
import ReactMarkdown from "react-markdown"
import "../styles/FullImageView.css"
import "../styles/PostPage.css"

export default function PostPage() {
    const postId = Number(useParams().postId);
    const [postView, setPostView] = useState<PostView | null>(null);
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
    
    if (!postView) return (
        <div className="loading-container">
            <Loader className="loading-icon" />
        </div>
    );
    
    const postBody: PostBodyType = getPostBody(postView)
    
    return (
        <div className="post-container">
            <div className="post-header">
                <div className="post-meta">
                    <Link to={"/community/" + postView.community.id} className="community-link">
                        <p>{postView.community.name}</p>
                    </Link>
                    <span className="dot-separator">•</span>
                    <span className="user-link">
                        <span className="posted-by">Posted by </span>
                        <Link to={"/profile/" + postView.creator.name}>
                            {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                        </Link>
                    </span>
                </div>
                <h3 className="post-title">{postView.post.name}</h3>
            </div>
            
            {postBody.imageData &&
                <div className='imageContainer'>
                    <Link to={constructImageUrl(postBody.imageData)}>
                        <img
                            src={constructImageUrl(postBody.imageData)}
                            alt="PostImage"
                            className='image'
                            title='Click to view full image' />
                    </Link>
                </div>
            }
            
            <div className="post-content">
                {postView.post.url && 
                    <a href={postView.post.url} target='_blank' rel="noopener noreferrer" className="post-url">
                        {postView.post.url}
                    </a>
                }
                <div className="post-body">
                    <ReactMarkdown>{postBody.body}</ReactMarkdown>
                </div>
            </div>
            
            <div className="post-actions">
                <div className="vote-container">
                    <LikeHandler forPost={true} isInitiallyLiked={postView.my_vote == 1} initialLikes={postView.counts.score} id={postId} />
                </div>
                
                <button className="action-button">
                    <MessageSquare size={16} />
                    {postView.counts.comments} Comments
                </button>
                
                <button className="action-button">
                    <Share2 size={16} />
                    Share
                </button>
                
                {postView.creator.id == profileInfo?.lemmyId &&
                    <PostDeletor postId={postView.post.id} imageData={postBody.imageData} />
                }
            </div>
            
            <div className="comments-section">
                <CommentsSection postId={postView.post.id} />
            </div>
        </div>
    );
}