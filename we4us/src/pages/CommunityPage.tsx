import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CommunityView, PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import { getCommunityDetailsFromId, getPostList } from "../library/LemmyApi";
import CommunitySnippet from "../components/CommunitySnippet";
import PaginationControls from "../components/PaginationControls";
import { DEFAULT_POSTS_PER_PAGE } from "../constants";

export default function CommunityPage() {
    const communityId = Number(useParams().communityId);

    const [postViews, setPostViews] = useState<PostView[] | null>(null);
    const [communityView, setCommunityView] = useState<CommunityView | null>(null)
    const [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState<boolean>(false)

    useEffect(
        () => {
                getCommunityDetailsFromId(communityId).then(setCommunityView);

                getPostList({ communityId, page, limit: DEFAULT_POSTS_PER_PAGE }).then((posts) => {
                    setPostViews(posts);
                    setHasMore(posts.length === DEFAULT_POSTS_PER_PAGE);
                });
            }, [communityId, page]
)

    if (!postViews) return <Loader />;
    if (!communityView) return <h3>Looks like this community doesn't exist!</h3>

    return (<>
            <CommunitySnippet communityView={communityView} />
            {postViews.length === 0 ? (
                <h3>No posts to see!</h3>
            ) : (
                <>
                    <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
                    <PostList postViews={postViews} />
                    <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
                </>
            )}
        </>
    )
}
