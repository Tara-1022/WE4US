import { PostView } from 'lemmy-js-client';
import { useEffect, useState } from 'react';
import { getPostById } from '../library/LemmyApi';
import { Loader } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import CommentsSection from '../components/CommentsSection';
import ReactMarkdown from "react-markdown";
import PostDeletor from '../components/PostDeletor';
import AnnouncementEditor from '../components/Announcements/AnnouncementEditor';
import { Bell } from 'lucide-react';
import { useProfileContext } from '../components/ProfileContext';

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        margin: "10px"
    },
    content: {
        margin: "10px",
        marginLeft: "30px"
    }
}

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
                    console.log(response)
                }
            )
        },
        [announcementId]
    )
    if (!postView) return <Loader />;

    return (
        <div className='page'>
            {isEditing ?
                <AnnouncementEditor
                    onClose={() => setIsEditing(false)}
                    onPostUpdated={setPostView}
                    postView={postView} />
                :
                <>
                    <div style={styles.post}>
                        <h3><Bell />&nbsp; {postView.post.name}</h3>
                        <div style={styles.content}>
                            <ReactMarkdown>{postView.post.body}</ReactMarkdown>
                        </div>
                        <Link to={"/profile/" + postView.creator.name}>
                            <p>
                                - {postView.creator.display_name ? postView.creator.display_name : postView.creator.name}
                            </p>
                        </Link>
                    </div>

                    {postView.creator.id == profileInfo?.lemmyId &&
                        <>
                            <PostDeletor postId={postView.post.id} />
                            &nbsp;
                            {!isEditing &&
                                <b
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </b>}
                        </>}
                </>
            }
            <CommentsSection postId={postView.post.id} />
        </div>
    );
}