import { useState } from "react";
import Modal from "react-modal";
import { ImageDetailsType, deleteImage } from "../library/ImageHandling";
import { createPost, editPost } from "../library/LemmyApi";
import CommunitySelector from "./CommunitySelector";
import { PostBodyType } from "../library/PostBodyType";
import ImageUploader from "./ImageUploader";

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
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

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [loading, setLoading] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<ImageDetailsType | undefined>(undefined);
  const [pendingImageCopies, setPendingImageCopies] = useState<ImageDetailsType[]>([]);
  const [originalImageData, setOriginalImageData] = useState<ImageDetailsType | undefined>(undefined);

  
  function handleCancel() {
    setPendingImageData(originalImageData);
    
    // Clean up any pending image uploads that weren't saved
    if (pendingImageData && pendingImageData !== originalImageData) {
      deleteImage(pendingImageData).catch(err => 
        console.error("Error cleaning up pending image:", err)
      );
    }
    
    // Clean up any pending image copies
    pendingImageCopies.forEach(img => {
      deleteImage(img).catch(err => 
        console.error("Error cleaning up pending image copy:", err)
      );
    });
    
    setPendingImageCopies([]);
    onClose();
  }

  const handleImageChange = (imageDetails: ImageDetailsType | undefined) => {
    setPendingImageData(imageDetails);
  };

  const handleMultipleImageUploads = (images: ImageDetailsType[]) => {
    if (images.length > 0) {
      // First image is already set by onImageChange
      // store the rest as copies
      setPendingImageCopies(images.slice(1));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const {
      title, body, communityId, secondCommunityId
    } = Object.fromEntries(formData);
    // since the field is required, the form will ensure a valid communityId is selected.

    const postBody: PostBodyType = {
      body: body.toString(),
      imageData: pendingImageData
    }

    const newPost = {
      name: title.toString(),
      postBody: postBody,
    };

    try {
      if (originalImageData && 
        pendingImageData && 
        originalImageData !== pendingImageData) {
        await deleteImage(originalImageData).catch(err => 
          console.error("Error deleting original image:", err)
        );
      }
      const firstPost = await createPost({
        ...newPost,
        body: JSON.stringify(newPost.postBody),
        community_id: Number(communityId)
      });

      if (secondCommunityId) {
        // Use a pre-uploaded copy for the second post if available
        const secondPostImageData = pendingImageCopies.length > 0 ? pendingImageCopies[0] : undefined;
        
        const secondPostBody: PostBodyType = addPostLinkToPostBody(
          {
            ...newPost.postBody,
            imageData: secondPostImageData
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

      onPostCreated(firstPost);
      setOriginalImageData(pendingImageData);
      setPendingImageCopies([])
      onClose();

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNeededCopies = () => {
    // Default to 2 - one for primary post, one for potential secondary post
    return 2;
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      contentLabel="Create Post"
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "20px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          color: "black"
          // TODO: Update color from theme, not hardcoded
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Post Title: </label>
        <input type="text" name="title" placeholder="Title" required />
        <br />
        <label htmlFor="body">Post Body: </label>
        <textarea name="body" placeholder="Body" required />
        <br />
        <label htmlFor="communityId">Choose Community: </label>
        <CommunitySelector name="communityId" isRequired={true} />
        <br />
        <label>Upload image: </label>
        <ImageUploader
          currentImage={pendingImageData}
          onImageChange={handleImageChange}
          onMultipleUploads={handleMultipleImageUploads}
          copiesCount={calculateNeededCopies()}
          purpose="post"
        />
        <br />
        <label htmlFor="secondCommunityId">Create a copy of this post in: </label>
        <CommunitySelector name="secondCommunityId" />
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
          <button type="reset" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PostCreationModal;
