import { useEffect, useState } from 'react'
import { PostView } from 'lemmy-js-client';
import { getPostList } from './components/lib';
import PostList from './components/PostList';
import './App.css'

const Loader = () => <h3>Loading...</h3>;

function App() {
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
    return <h3>No posts to see!</h3>;
  }
  else {
    return (
      <>
        <h1>Recent Posts</h1>
        <PostList postViews={postViews} />
      </>
    );
  }
}

export default App
