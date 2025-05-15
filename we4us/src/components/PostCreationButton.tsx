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
import { CSSProperties } from "react";
// Internal CSS styles
const styles: {
  modal: Modal.Styles;
  form: CSSProperties;
  formGroup: CSSProperties;
  label: CSSProperties;
  input: CSSProperties;
  textarea: CSSProperties;
  buttonGroup: CSSProperties;
  submitButton: CSSProperties;
  submitButtonHover: CSSProperties;
  submitButtonDisabled: CSSProperties;
  cancelButton: CSSProperties;
  cancelButtonHover: CSSProperties;
  createPostButton: CSSProperties;
} = {
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    },
    content: {
      backgroundColor: '#000',
      color: '#fff',
      border: '2px solid #ff6600',
      borderRadius: '8px',
      padding: '20px',
      maxWidth: '800px',
      margin: '20px auto'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5px'
  },
  label: {
    color: '#fff',
    marginBottom: '5px',
    fontWeight: '500'
  },
  input: {
    padding: '10px',
    backgroundColor: '#222',
    border: '1px solid #ff6600',
    borderRadius: '4px',
    color: '#fff',
    width: '100%'
  },
  textarea: {
    padding: '10px',
    backgroundColor: '#222',
    border: '1px solid #ff6600',
    borderRadius: '4px',
    color: '#fff',
    minHeight: '120px',
    width: '100%',
    resize: 'vertical'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  submitButton: {
    backgroundColor: '#ff6600',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  submitButtonHover: {
    backgroundColor: '#ff8533'
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
    cursor: 'not-allowed'
  },
  cancelButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    border: '1px solid #ff6600',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  cancelButtonHover: {
    backgroundColor: '#444'
  },
  createPostButton: {
    backgroundColor: '#ff6600',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500'
  }
};

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
        style={styles.createPostButton}
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
  const [hoverSubmit, setHoverSubmit] = useState(false);
  const [hoverCancel, setHoverCancel] = useState(false);

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
  const customStyles = `
    .community-selector .control {
      border: 1px solid #ff6600 !important;
      background-color: #222 !important;
    }
    
    .community-selector .search-value {
      color: white !important;
      background-color: #222 !important;
    }
    
    .community-selector .options {
      background-color: #222 !important;
      border: 1px solid #ff6600 !important;
    }
    
    .community-selector .option {
      color: white !important;
    }
    
    .community-selector .option:hover,
    .community-selector .option.selected {
      background-color: #ff6600 !important;
    }
    
    .image-uploader {
      border: 1px solid #ff6600 !important;
      padding: 10px !important;
      border-radius: 4px !important;
      background-color: #222 !important;
      margin-bottom: 15px !important;
    }
    
    .image-controls button {
      background-color: #ff6600 !important;
      color: white !important;
      border: none !important;
      padding: 5px 10px !important;
      border-radius: 4px !important;
      cursor: pointer !important;
      margin-right: 5px !important;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleCancel}
        contentLabel="Create Post"
        style={styles.modal}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Post Title: </label>
            <input 
              type="text" 
              name="title" 
              placeholder="Title" 
              required 
              style={styles.input} 
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="body" style={styles.label}>Post Body: </label>
            <textarea 
              name="body" 
              placeholder="Body" 
              required 
              style={styles.textarea} 
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="url" style={styles.label}>URL</label>
            <input 
              type="url" 
              name="url" 
              placeholder="URL" 
              style={styles.input} 
            />
          </div>
          
          {communityId ? (
            <input type="hidden" name="communityId" value={communityId} />
          ) : (
            <div style={styles.formGroup}>
              <label htmlFor="communityId" style={styles.label}>Choose Community: </label>
              <CommunitySelector name="communityId" isRequired={true} />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Upload image: </label>
            <ImageUploader
              originalImage={undefined}
              onUploadChange={handleImageChange}
              copiesCount={2}
              purpose="post"
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="secondCommunityId" style={styles.label}>Create a copy of this post in: </label>
            <CommunitySelector name="secondCommunityId" />
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {}),
                ...(hoverSubmit && !loading ? styles.submitButtonHover : {})
              }}
              onMouseEnter={() => setHoverSubmit(true)}
              onMouseLeave={() => setHoverSubmit(false)}
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <button 
              type="reset" 
              onClick={handleCancel}
              style={{
                ...styles.cancelButton,
                ...(hoverCancel ? styles.cancelButtonHover : {})
              }}
              onMouseEnter={() => setHoverCancel(true)}
              onMouseLeave={() => setHoverCancel(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
