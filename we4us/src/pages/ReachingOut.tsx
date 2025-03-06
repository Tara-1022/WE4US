import { useEffect, useState } from 'react'
import { PostView } from 'lemmy-js-client';
import { getPostList } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import CreateCommunityButton from "../components/CreateCommunityButton";

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null)
  
  useEffect(() => {
    setTimeout(() => { // simulating a delay. TODO: Remove timeout
      getPostList().then(postList => setPostViews(postList));
      console.log("Fetched posts")
    }, 1000)
  }
    , [])
  if (!postViews) {
    return <Loader />;
  }
  else if (postViews.length == 0) {
    return (
      <>
        <CreateCommunityButton />
        <h3>No posts to see!</h3>;
      </>
    )
  }
  else {
    return (
      <>
        <h1>Recent Posts</h1>
        <CreateCommunityButton />
        <PostList postViews={postViews} />
      </>
    );
  }
}

export default ReachingOut

