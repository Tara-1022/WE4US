import { useState } from "react";
import Modal from "react-modal";
import { imageDetailsType, uploadImage, deleteImage, constructImageUrl } from "../library/LemmyImageHandling";
import { createPost } from "../library/LemmyApi";
import CommunitySelector from "./CommunitySelector";

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: any) => void;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<imageDetailsType>();

  function deleteUploadedImage() {
    if (imageData) {
      console.log(imageData)
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const {
      title, body, communityId
    } = Object.fromEntries(formData);
    // since the field is required, the form will ensure a valid communityId is selected.

    try {
      createPost({
        name: title.toString(),
        community_id: Number(communityId),
        body: body.toString(),
        ...(imageData && { url: constructImageUrl(imageData) })
      })
        .then((createdPost) => {
          onPostCreated(createdPost); // Passing the newpost for the parent to handle.
          onClose();
        })

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
        <div>
          <button type="reset" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Submit"}
          </button>
          <button onClick={handleImageDelete}>Remove image</button>
        </div>
      </form>
    </Modal>
  );
};

export default PostCreationModal;
