import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PostView } from "lemmy-js-client";
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';

export default function CommunityPage(){
    const communityId = Number(useParams().communityId);
    const [postViews, setPostViews] = useState<PostView[] | null>(null);

    useEffect(
        () => {

        }, [communityId]
    )

    if (!postViews) return <Loader />;
    else if (postViews.length == 0) return <h3>No posts to see!</h3>;
    else{
        return (
            <>
            <PostList postViews={postViews} />
            </>
        )
    }
}