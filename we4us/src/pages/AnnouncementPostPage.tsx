import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader, Bell, Edit } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import ReactMarkdown from "react-markdown";
import PostDeletor from '../components/PostDeletor';
import AnnouncementEditor from '../components/Announcements/AnnouncementEditor';
import { useProfileContext } from '../components/ProfileContext';
import "../styles/AnnouncementPostPage.css"

export default function AnnouncementPostPage() {
    const announcementId = Number(useParams().announcementId);
    const [postView, setPostView] = useState<PostView | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { profileInfo } = useProfileContext();

    useEffect(
        () => {
            getPostById(announcementId).then(
                response => {
                    setPostView(response ? response.post_view : null);
                }
            )
        },
        [announcementId]
    )
    if (!postView) return <Loader />;

    return (
        <>
            {isEditing ? (
                <div className="announcement-editor-container">
                    <AnnouncementEditor
                        onClose={() => setIsEditing(false)}
                        onPostUpdated={setPostView}
                        postView={postView}
                    />
                </div>
            ) : (
                <>
                    <div className="announcement-post">
                        <div className="announcement-header">
                            <h3>
                                <Bell className="bell-icon" />
                                &nbsp; {postView.post.name}
                            </h3>
                            {postView.creator.id === profileInfo?.lemmyId && (
                                <div className="announcement-actions">
                                    <button 
                                        className="icon-button" 
                                        onClick={() => setIsEditing(true)}
                                        title="Edit post"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <PostDeletor postId={postView.post.id} />
                                </div>
                            )}
                        </div>
                        <div className="announcement-content">
                            <ReactMarkdown>{postView.post.body}</ReactMarkdown>
                        </div>
                        <Link to={"/profile/" + postView.creator.name}>
                            <p className="announcement-author">
                                - {postView.creator.display_name || postView.creator.name}
                            </p>
                        </Link>
                    </div>
                    <CommentsSection postId={postView.post.id} />
                </>
            )}
        </>
    );
}