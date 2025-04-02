import { useState } from "react";
import Modal from "react-modal";
import { ImageDetailsType, uploadImage, deleteImage } from "../library/LemmyImageHandling";
import { createPost, editPost } from "../library/LemmyApi";
import CommunitySelector from "./CommunitySelector";
import { PostBodyType } from "../library/PostBodyType";

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
}

function addPostLinkToPostBody(postBody: PostBodyType, postId: number): PostBodyType {
  return {
    ...postBody,
    body: postBody.body + "\n\n Also see this post [here](" + window.location.origin + "/post/" + postId + ")"
  }
    ;
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
  const [imageData, setImageData] = useState<ImageDetailsType>();

  function deleteUploadedImage() {
    if (imageData) {
      deleteImage(imageData).then(() => {
        setImageData(undefined);
        console.log("Deleted")
      })
    }
  }

  function handleCancel() {
    deleteUploadedImage();
    onClose();
  }

  // referring https://github.com/LemmyNet/lemmy-ui/blob/c15a0eb1e5baa291e175567967db4c3205711807/src/shared/components/post/post-form.tsx#L247
  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0]) {
      console.log("No file")
      return;
    }
    // delete previous image
    deleteUploadedImage();
    const file = event.target.files[0];
    uploadImage(file).then(
      (imageDetails) => {
        console.log("Image uploaded:", imageDetails);
        setImageData(imageDetails);
      }
    )
  }

  function handleImageDelete(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    deleteUploadedImage();
    window.alert("Image deleted");
  }

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
      imageData: imageData
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
        const secondPost = await createPost({
          ...newPost,
          body: JSON.stringify(
            addPostLinkToPostBody(
              newPost.postBody, firstPost.post.id
            )),
          community_id: Number(secondCommunityId)
        });
        onPostCreated(secondPost);
        updatePostWithLink(firstPost.post.id, newPost.postBody, secondPost.post.id);
      }

      onPostCreated(firstPost); // Passing the newpost for the parent to handle.
      onClose();

    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
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
        <label htmlFor="url">URL</label>
        <input type="url" name="url" placeholder="URL" />
        <br />
        <label htmlFor="communityId">Choose Community: </label>
        <CommunitySelector name="communityId" isRequired={true} />
        <br />
        <label htmlFor="fileUpload">Upload image/video: </label>
        <input
          id="fileUpload"
          type="file"
          accept="image/*"
          name="file"
          onChange={handleImageUpload}
        />
        <br />
        <label htmlFor="secondCommunityId">Create a copy of this post in: </label>
        <CommunitySelector name="secondCommunityId" />
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </button>
          <button onClick={handleImageDelete}>Delete image</button>
          <button type="reset" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PostCreationModal;
