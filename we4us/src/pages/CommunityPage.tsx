import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CommunityView, PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import { useLemmyInfo } from "../components/LemmyContextProvider";
import { getPostList } from "../library/LemmyApi";
import CommunitySnippet from "../components/CommunitySnippet";

export default function CommunityPage() {
    const communityId = Number(useParams().communityId);
    const { lemmyInfo } = useLemmyInfo();

    const [postViews, setPostViews] = useState<PostView[] | null>(null);
    const [communityDetails, setCommunityDetails] = useState<CommunityView | undefined>(
        lemmyInfo?.communities.filter(
            (communityView) => { return communityView.community.id == communityId; }
        )[0]
    )

    useEffect(
        () => {
            setCommunityDetails(
                lemmyInfo?.communities.filter(
                    (communityView) => { return communityView.community.id == communityId; }
                )[0]);
            getPostList(communityId).then(
                (postViews) => { setPostViews(postViews) }
            )
        }, [communityId, lemmyInfo]
    )

    if (!postViews) return <Loader />;
    else if (!communityDetails) return <h3>Looks like this community doesn't exist!</h3>
    else if (postViews.length == 0) {
        return (<>
            <CommunitySnippet communityView={communityDetails} />
            <h3>No posts to see!</h3></>
        )
            ;
    }
    else {
        return (
            <>
                <CommunitySnippet communityView={communityDetails} />
                <PostList postViews={postViews} />
            </>
        )
    }
}