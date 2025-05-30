import { useState } from "react";
import Modal from "react-modal";
import { ImageDetailsType, deleteImage } from "../library/ImageHandling";
import { createPost, editPost } from "../library/LemmyApi";
import CommunitySelector from "./CommunitySelector";
import { PostBodyType } from "../library/PostBodyType";
import ImageUploader from "./ImageUploader";
import "../styles/PostImageUploader.css"
// Temporary, can be removed any time
import "../styles/UploadsModal.css"
import { PostView } from "lemmy-js-client";
import "../styles/PostCreationButton.css";


interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
  communityId?: number;
}

export default function PostCreationButton({ handlePostCreated, communityId }:
  {
    handlePostCreated: (newPost: PostView) => void;
    communityId?: number
  }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button 
        onClick={() => setShowModal(true)} 
        className='create-rco-post-button'
      >
        Create Post
      </button>
      <PostCreationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
        communityId={communityId}
      />
    </>
  )
}

function addPostLinkToPostBody(postBody: PostBodyType, postId: number): PostBodyType {
  return {
    ...postBody,
    body: postBody.body + "\n\n Also see this post [here](" + window.location.origin + "/post/" + postId + ")"
  };
}

function updatePostWithLink(toUpdatePostId: number, previousBody: PostBodyType, toLinkPostId: number) {
  editPost(
    {
      post_id: toUpdatePostId,
      body: JSON.stringify(addPostLinkToPostBody(previousBody, toLinkPostId))
    }
  )
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onPostCreated, communityId }) => {
  const [loading, setLoading] = useState(false);
  const [uploadedImageCopies, setUploadedImageCopies] = useState<ImageDetailsType[] | undefined>(undefined);
  

  function handleCancel() {
    // Clean up any pending image copies
    if (!uploadedImageCopies) {
      onClose();
      return;
    }
    uploadedImageCopies.forEach(
      img => deleteImage(img)
        .catch(err => console.error("Error cleaning up pending image copy:", err))
    )
    onClose();
  }

  const handleImageChange = (imageDetails: ImageDetailsType[] | undefined) => {
    setUploadedImageCopies(imageDetails);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const {
      title, body, communityId, url, secondCommunityId
    } = Object.fromEntries(formData);
    // since the field is required, the form will ensure a valid communityId is selected.

    const postBody: PostBodyType = {
      body: body.toString(),
      ...(uploadedImageCopies && { imageData: uploadedImageCopies[0] })
    }

    const newPost = {
      name: title.toString(),
      postBody: postBody,
      ...(url && { url: url.toString() })
    };

    try {

      const firstPost = await createPost({
        ...newPost,
        body: JSON.stringify(newPost.postBody),
        community_id: Number(communityId)
      });

      if (secondCommunityId) {
        const secondPostBody: PostBodyType = addPostLinkToPostBody(
          {
            ...newPost.postBody,
            ...(uploadedImageCopies && { imageData: uploadedImageCopies[1] })
          },
          firstPost.post.id
        );

        const secondPost = await createPost({
          ...newPost,
          body: JSON.stringify(secondPostBody),
          community_id: Number(secondCommunityId)
        });

        onPostCreated(secondPost);
        updatePostWithLink(firstPost.post.id, newPost.postBody, secondPost.post.id);
      }
      else {
        if (uploadedImageCopies) deleteImage(uploadedImageCopies[1]);
      }

      onPostCreated(firstPost);
      setUploadedImageCopies([]);
      onClose();

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCancel}
        contentLabel="Create Post"
        className='post-creation-modal-content'
        style={{
          overlay: {
            backgroundColor: " rgba(0, 0, 0, 0.75)"
          }}
        }
        
      >
      <div className="post-creation-container">
        <form onSubmit={handleSubmit} className="post-creation-form">
          <div className="post-creation-form-group">
            <label htmlFor="title" className="post-creation-label">Post Title: </label>
            <input 
              type="text" 
              name="title" 
              placeholder="Title" 
              required 
              className="post-creation-input" 
            />
          </div>
          
          <div className="post-creation-form-group">
            <label htmlFor="body" className="post-creation-label">Post Body: </label>
            <textarea 
              name="body" 
              placeholder="Body" 
              required 
              className="post-creation-textarea"
            />
          </div>
          
          <div className="post-creation-form-group">
            <label htmlFor="url" className="post-creation-label">URL</label>
            <input 
              type="url" 
              name="url" 
              placeholder="URL" 
              className="post-creation-input"
            />
          </div>
          
          {communityId ? (
            <input type="hidden" name="communityId" value={communityId} />
          ) : (
            <div className="post-creation-form-group">
              <label htmlFor="communityId" className="post-creation-label">Choose Community: </label>
              <CommunitySelector name="communityId" isRequired={true} />
            </div>
          )}

          <div className="post-creation-form-group">
            <label className="post-creation-label">Upload image: </label>
            <ImageUploader
              originalImage={undefined}
              onUploadChange={handleImageChange}
              copiesCount={2}
              purpose="post"
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          
          <div className="post-creation-form-group">
            <label htmlFor="secondCommunityId" className="post-creation-label">Optionally, create a copy of this post in: </label>
            <CommunitySelector name="secondCommunityId" />
          </div>
          
          <div className="post-creation-button-group">
            <button 
              type="submit" 
              disabled={loading}
              className="post-creation-submit-button"
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <button 
              type="reset" 
              onClick={handleCancel}
              className="post-creation-cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </Modal>
    </>
  );
};
