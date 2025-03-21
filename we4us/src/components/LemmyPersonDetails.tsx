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
                        })
                    }
                )
        }, [username]
    )

    return (
        <div>
            <div className="detail-item">
                <span className="detail-value"><b>{overview?.isAdmin && "Is an Admin!"}</b></span>
            </div>
            <div className="detail-item">
                <span className="detail-label">Posts: </span>
                <span className="detail-value">{overview?.postsCount}</span>
            </div>
            <div className="detail-item">
                <span className="detail-label">Comments: </span>
                <span className="detail-value">{overview?.commentsCount}</span>
            </div>
            {/* <p>
                {overview?.isAdmin && "Is an Admin!"} <br />
                {"Posts: " + overview?.postsCount}<br />
                {"Comments: " + overview?.commentsCount}<br />
            </p> */}
            <div style={{ color: "black" }}>
                <span style={{margin: "0 10px"}}>Posts</span>
                <button onClick={() => setPostsToggle(!isPostsToggle)} >
                    {isPostsToggle ?
                        <ToggleLeft />
                        :
                        <ToggleRight />
                    }
                </button>
                <span style={{margin: "0 10px"}}>Comments</span>
            </div>
            {isPostsToggle ?
                <PostList postViews={posts} />
                :
                <CommentList commentViews={comments} />}

        </div>
    )
}