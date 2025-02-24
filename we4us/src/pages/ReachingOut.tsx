import { useEffect, useState } from 'react';
import { PostView } from 'lemmy-js-client';
import { getPostList, createPost } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //Removed Timeout since PostList fetches the newest post.
    getPostList().then(postList => setPostViews(postList));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPost = {
        name: title,
        community_id: 2, //Default Community ID. 
        // TODO: Create a dropdown of available communities after fetchCommunity is implemented.
        body: body,
      };

      await createPost(newPost);
      const updatedPosts = await getPostList();
      setPostViews(updatedPosts);
      setTitle("");
      setBody("");
      setShowForm(false);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!postViews) {
    return <Loader />;
  }
  return (
    <>
      <h1>Recent Posts</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Create Post"}
      </button>

      {showForm && (
  <form 
    onSubmit={handleSubmit} 
    className="mt-4 p-4 border border-gray-700 rounded-lg shadow-lg bg-gray-900 max-w-md mx-auto flex flex-col gap-3"
  >
    <input
      type="text"
      placeholder="Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      className="w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
    />
    <textarea
      placeholder="Body"
      value={body}
      onChange={(e) => setBody(e.target.value)}
      required
      className="w-full p-2 border border-gray-600 rounded-md h-24 resize-none bg-gray-800 text-white focus:ring-2 focus:ring-blue-400 outline-none"
    />
    <div className="flex justify-between">
      <button 
        type="button" 
        onClick={() => setShowForm(false)}
        className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={loading} 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        {loading ? "Posting..." : "Submit"}
      </button>
    </div>
  </form>
)}



      {postViews.length === 0 ? <h3>No posts to see!</h3> : <PostList postViews={postViews} />}
    </>
  );
}

export default ReachingOut;
