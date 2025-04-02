import '../styles/ProfilePage.css';
import { useEffect, useState } from "react";
import { getPersonDetails } from "../library/LemmyApi";
import { CommentView, PostView } from "lemmy-js-client";
import PostList from "./PostList";
import CommentList from "./CommentList";
import { Loader, ToggleLeft, ToggleRight } from "lucide-react";

type OverviewDetails = {
    isAdmin: boolean,
    postsCount: number,
    commentsCount: number
}

type PersonDetails = {
    posts: PostView[],
    comments: CommentView[],
    overview: OverviewDetails
}

export default function LemmyPersonDetails({ username }: { username: string }) {
    const [personDetails, setPersonDetails] = useState<PersonDetails>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isPostsToggle, setPostsToggle] = useState<boolean>(true);

    useEffect(
        () => {
            setLoading(true);
            getPersonDetails(username)
                .then(
                    (personDetails) => {
                        setPersonDetails({
                            posts: personDetails.posts,
                            comments: personDetails.comments,
                            overview: {
                                isAdmin: personDetails.person_view.is_admin,
                                postsCount: personDetails.person_view.counts.post_count,
                                commentsCount: personDetails.person_view.counts.comment_count
                            }
                        });
                    }
                )
                .catch(
                    (error) => console.error("Error fetching person details:", error)
                )
                .finally(() => setLoading(false))
        }, [username]
    )

    if (isLoading) return <Loader />;

    if (!personDetails) {
        return <div className="profile-details" style={{ textAlign: "left" }}>
            <h5 style={{ color: "red" }}>
                Could not fetch Reaching out profile!
            </h5>
        </div>
    }

    return (
        <>
            <div className="profile-details" style={{ textAlign: "left" }}>
                <h3 style={{ color: "#333" }}>
                    Reaching out Profile:
                </h3>
                <div className="detail-item">
                    <span className="detail-value"><b>{personDetails.overview.isAdmin && "Is an Admin!"}</b></span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Posts: </span>
                    <span className="detail-value">{personDetails.overview.postsCount || 0}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Comments: </span>
                    <span className="detail-value">{personDetails.overview.commentsCount || 0}</span>
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
                        personDetails.posts.length > 0 ? <PostList postViews={personDetails.posts} /> : <><br /><h4>No posts yet!</h4></>
                        :
                        personDetails.comments.length > 0 ? <CommentList commentViews={personDetails.comments} /> : <><br /><h4>No comments yet!</h4></>
                }
            </div>
        </>
    )
}