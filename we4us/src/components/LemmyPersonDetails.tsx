import '../styles/ProfilePage.css';
import { useEffect, useState } from "react";
import { getPersonDetails } from "../library/LemmyApi";
import { CommentView, PostView } from "lemmy-js-client";
import PostList from "./PostList";
import CommentList from "./CommentList";
import { Loader, ToggleLeft, ToggleRight } from "lucide-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { DEFAULT_POSTS_PER_PAGE } from '../constants';

type OverviewDetails = {
    isAdmin: boolean,
    postsCount: number,
    commentsCount: number
}

export default function LemmyPersonDetails({ username }: { username: string }) {
    const [overviewDetails, setOverviewDetails] = useState<OverviewDetails>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isPostsToggle, setPostsToggle] = useState<boolean>(true);

    const [posts, setPosts] = useState<PostView[]>();
    const [comments, setComments] = useState<CommentView[]>();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(
        () => {
            setLoading(true);
            getPersonDetails(username, page)
                .then(
                    (loadedPersonDetails) => {
                        setOverviewDetails({
                            isAdmin: loadedPersonDetails.person_view.is_admin,
                            postsCount: loadedPersonDetails.person_view.counts.post_count,
                            commentsCount: loadedPersonDetails.person_view.counts.comment_count
                        });
                        setPosts(loadedPersonDetails.posts);
                        setComments(loadedPersonDetails.comments);
                        console.log(loadedPersonDetails.posts, loadedPersonDetails.comments, loadedPersonDetails.moderates)
                        window.alert(
                            loadedPersonDetails.posts.length + " "
                            + loadedPersonDetails.comments.length + " "
                            + loadedPersonDetails.moderates.length
                        )
                        if (loadedPersonDetails.posts.length < DEFAULT_POSTS_PER_PAGE
                            && loadedPersonDetails.comments.length < DEFAULT_POSTS_PER_PAGE
                            && loadedPersonDetails.moderates.length < DEFAULT_POSTS_PER_PAGE
                        ) setHasMore(false)
                    }
                )
                .catch(
                    (error) => console.error("Error fetching person details:", error)
                )
                .finally(() => setLoading(false))
        }, [username]
    )

    useEffect(
        () => {
            setLoading(true);
            getPersonDetails(username, page)
                .then(
                    (loadedPersonDetails) => {
                        setPosts([...(posts || []), ...loadedPersonDetails.posts]);
                        setComments([...(comments || []), ...loadedPersonDetails.comments]);
                        console.log(
                            "Loaded more!",
                            loadedPersonDetails.posts, loadedPersonDetails.comments, loadedPersonDetails.moderates)
                        window.alert(
                            page + " page, " +
                            loadedPersonDetails.posts.length + " "
                            + loadedPersonDetails.comments.length + " "
                            + loadedPersonDetails.moderates.length
                        )
                        if (loadedPersonDetails.posts.length < DEFAULT_POSTS_PER_PAGE
                            && loadedPersonDetails.comments.length < DEFAULT_POSTS_PER_PAGE
                            && loadedPersonDetails.moderates.length < DEFAULT_POSTS_PER_PAGE
                        ) setHasMore(false)
                    }
                )
                .catch(
                    (error) => console.error("Error fetching more details:", error)
                )
                .finally(() => setLoading(false))
        }, [page]
    )

    if (isLoading) return <Loader />;

    if (!overviewDetails) {
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
                    <span className="detail-value"><b>{overviewDetails.isAdmin && "Is an Admin!"}</b></span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Posts: </span>
                    <span className="detail-value">{overviewDetails.postsCount || 0}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Comments: </span>
                    <span className="detail-value">{overviewDetails.commentsCount || 0}</span>
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
                {/* <InfiniteScroll
                    next={() => setPage(page + 1)}
                    dataLength={
                        isPostsToggle ? posts?.length || 0 : comments?.length || 0
                    }
                    hasMore={hasMore}
                    loader={<Loader />}> */}
                    {
                        isPostsToggle ?
                            posts && posts.length > 0 ?
                                <PostList postViews={posts} />
                                : <><br /><h4>No posts yet!</h4></>
                            :
                            comments && comments.length > 0 ?
                                <CommentList commentViews={comments} />
                                : <><br /><h4>No comments yet!</h4></>
                    }
                {/* </InfiniteScroll> */}
                {
                    hasMore && <button onClick={() => setPage(page + 1)}
                    >See more</button>
                }
            </div>
        </>
    )
}