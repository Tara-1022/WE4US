import '../styles/ProfilePage.css';
import { useEffect, useState } from "react";
import { getPersonDetails } from "../library/LemmyApi";
import { CommentView, PostView } from "lemmy-js-client";
import PostList from "./PostList";
import CommentList from "./CommentList";
import { ToggleLeft, ToggleRight } from "lucide-react";

type OverviewDetails = {
    isAdmin: boolean,
    postsCount: number,
    commentsCount: number
}

export default function LemmyPersonDetails({ username }: { username: string }) {
    const [posts, setPosts] = useState<PostView[]>([]);
    const [comments, setComments] = useState<CommentView[]>([]);
    const [overview, setOverview] = useState<OverviewDetails>();
    const [isPostsToggle, setPostsToggle] = useState<boolean>(true);

    useEffect(
        () => {
            getPersonDetails(username)
                .then(
                    (personDetails) => {
                        setPosts(personDetails.posts);
                        setComments(personDetails.comments);
                        setOverview({
                            isAdmin: personDetails.person_view.is_admin,
                            postsCount: personDetails.person_view.counts.post_count,
                            commentsCount: personDetails.person_view.counts.comment_count
                        });
                    }
                )
        }, [username]
    )

    return (
        <>
            <div className="profile-details" style={{ textAlign: "left" }}>
                <h3 style={{ color: "#333" }}>
                    Reaching out Profile:
                </h3>
                <div className="detail-item">
                    <span className="detail-value"><b>{overview?.isAdmin && "Is an Admin!"}</b></span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Posts: </span>
                    <span className="detail-value">{overview?.postsCount || 0}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Comments: </span>
                    <span className="detail-value">{overview?.commentsCount || 0}</span>
                </div>
            </div>

            <div style={{ color: "black", textAlign: "left" }}>
                <span style={{ margin: "0 10px" }}>Posts</span>
                <span onClick={() => setPostsToggle(!isPostsToggle)} >
                    {isPostsToggle ?
                        <ToggleLeft color='black' />
                        :
                        <ToggleRight color='black' />
                    }
                </span>
                <span style={{ margin: "0 10px" }}>Comments</span>
                {
                    isPostsToggle ?
                        posts.length > 0 ? <PostList postViews={posts} /> : <><br/><h4>No posts yet!</h4></>
                        :
                        comments.length > 0 ? <CommentList commentViews={comments} /> : <><br/><h4>No comments yet!</h4></>
                }
            </div>
        </>
    )
}