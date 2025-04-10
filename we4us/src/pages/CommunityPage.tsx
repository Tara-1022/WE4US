import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CommunityView, PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import { getCommunityDetailsFromId, getPostList } from "../library/LemmyApi";
import CommunitySnippet from "../components/CommunitySnippet";

export default function CommunityPage() {
    const communityId = Number(useParams().communityId);

    const [postViews, setPostViews] = useState<PostView[] | null>(null);
    const [communityView, setCommunityView] = useState<CommunityView | null>(null)


    useEffect(
        () => {
            getCommunityDetailsFromId(communityId).then(
                (communityView) => setCommunityView(communityView)
            )
            getPostList({communityId: communityId}).then(
                (postViews) => { setPostViews(postViews) }
            )
        }, [communityId]
    )

    if (!postViews) return <Loader />;
    else if (!communityView) return <h3>Looks like this community doesn't exist!</h3>
    else if (postViews.length == 0) {
        return (<>
            <CommunitySnippet communityView={communityView} />
            <h3>No posts to see!</h3></>
        );
    }
    else {
        return (
            <>
                <CommunitySnippet communityView={communityView} />
                <PostList postViews={postViews} />
            </>
        )
    }
}