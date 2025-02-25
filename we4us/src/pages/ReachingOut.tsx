import { useEffect, useRef, useState } from 'react';
import { PostView } from 'lemmy-js-client';
import { getPostList, createPost } from '../library/LemmyApi';
import PostList from '../components/PostList';
import { Loader } from 'lucide-react';
import Modal from 'react-modal';

function ReachingOut() {
  const [postViews, setPostViews] = useState<PostView[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    //Removed Timeout since PostList fetches the newest post.
    getPostList().then(postList => setPostViews(postList));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(formRef.current!);
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;

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
      setShowForm(false);
      formRef.current?.reset();
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
      <button onClick={() => setShowForm(true)}>Create Post</button>

      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Create Post"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
          />
          <textarea
            name="body"
            placeholder="Body"
            required
          />
          <div>
            <button 
              type="button" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Posting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {postViews.length === 0 ? <h3>No posts to see!</h3> : <PostList postViews={postViews} />}
    </>
  );
}

export default ReachingOut;
