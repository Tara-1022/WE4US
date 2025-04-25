import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../../library/LemmyApi";
import { useLemmyInfo } from "../LemmyContextProvider";
import { PostView } from "lemmy-js-client";
import { MeetUpPostType } from "./MeetUpPostTypes";
import Modal from "react-modal";

export default function PostCreationHandler({
  handleCreatedPost,
}: {
  handleCreatedPost: (newPost: PostView) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { lemmyInfo } = useLemmyInfo();

  async function handleCreation(data: MeetUpPostType): Promise<void> {
    console.log(data);
    setErrorMessage(null);

    if (!lemmyInfo) {
      setErrorMessage("Could not fetch Meet-Up community!");
      return;
    }

    try {
      const newPost = await createPost({
        body: JSON.stringify(data.body),
        name: data.title,
        community_id: lemmyInfo.meet_up_details.community.id,
        ...(data.url && { url: data.url.toString() }),
      });

      handleCreatedPost(newPost);
      setIsOpen(false);
    } catch (error) {
      console.error("Post creation failed:", error);
      setErrorMessage("Failed to create the post. Please try again.");
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={buttonStyle}>
        + New Meet-Up
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Create Meet-Up Post"
        ariaHideApp={false}
        className="meet-up-modal-content"
        overlayClassName="meet-up-modal-overlay"
      >
        <PostForm
          handleSubmit={handleCreation}
          errorMessage={errorMessage}
          onClose={() => setIsOpen(false)}
          task="Create Meet-Up Post"
        />
      </Modal>
    </>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "#2f2f2f",
  border: "1px solid #444",
  borderRadius: "8px",
  fontSize: "1em",
  cursor: "pointer",
  color: "#f1f1f1",
  fontWeight: 500,
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  transition: "background-color 0.2s ease",
  marginBottom: "10px",
};
