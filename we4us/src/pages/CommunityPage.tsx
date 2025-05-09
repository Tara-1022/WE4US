import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CommunityView, PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import PostCreationButton from '../components/PostCreationButton';
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
            getCommunityDetailsFromId(
                communityId).then(
                    (communityView) => setCommunityView(communityView)
                );

            setPostViews(null);
            getPostList({ communityId: communityId, page: page, limit: DEFAULT_POSTS_PER_PAGE }).then(
                (postViews) => {
                    setPostViews(postViews);
                    setHasMore(postViews.length >= DEFAULT_POSTS_PER_PAGE);
                }
            );
        }, [communityId, page]
    );

    function handlePostCreated(newPost: PostView) {
        // Don't display the copy of a post in another community
        if (newPost.community.id == communityId) setPostViews((prevPosts) => (prevPosts ? [newPost, ...prevPosts] : [newPost]));
    }

    if (!postViews) return <Loader />;
    if (!communityView) return <h3>Looks like this community doesn't exist!</h3>
    else if (postViews.length == 0) {
        return (<>
            <CommunitySnippet communityView={communityView} />
            <h3>No posts to see!</h3></>
        )
            ;
    }
    else {
        return (
            <>
                <CommunitySnippet communityView={communityView} />
                <PostCreationButton
                    handlePostCreated={handlePostCreated}
                    communityId={communityId} />
                <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
                <PostList postViews={postViews} />
                <PaginationControls page={page} setPage={setPage} hasMore={hasMore} />
            </>
        )
    }
}