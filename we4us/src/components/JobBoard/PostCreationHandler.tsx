import { useState } from "react";
import PostForm from "./PostForm";
import { createPost } from "../../library/LemmyApi";
import { PostView } from "lemmy-js-client";
import { useLemmyInfo } from "../LemmyContextProvider"
import { JobPostData } from "./JobTypes";
import Modal from "react-modal";

export default function PostCreationHandler({ 
  handleCreatedPost, 
  buttonStyle 
}: { 
  handleCreatedPost: (newPost: PostView) => void;
  buttonStyle?: React.CSSProperties;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { lemmyInfo } = useLemmyInfo();

    const [isHovered, setIsHovered] = useState(false);

    if (!lemmyInfo) return <h3>Could not fetch Job Board community!</h3>

    function handleCreation(data: JobPostData) {
        console.log(data);

        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return
        }

        createPost({
            ...(data.url && { url: data.url }),
            body: JSON.stringify(data.body),
            name: data.name.toString(),
            community_id: lemmyInfo.job_board_details.community.id
        }).then(
            (newPost) => handleCreatedPost(newPost)
        );
        setIsOpen(false);
    }

    const defaultButtonStyle: React.CSSProperties = {
        backgroundColor: isHovered ?  "#a29bfe ": " #4839a1",
        color: "white",
        padding: "7px 20px", 
        margin: "4px 2px",
        cursor: "pointer",
        borderRadius: "4px",
        borderColor: "#655fb8",
        fontWeight: "bold",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        transition: "background-color 0.3s"
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={buttonStyle || defaultButtonStyle}
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
            >
                 New Post
            </button>
            <Modal 
                isOpen={isOpen}
                contentLabel="Create Job Post"
                onRequestClose={() => setIsOpen(false)}
                ariaHideApp={false}
            >
                <PostForm 
                    handleSubmit={handleCreation} 
                    onClose={() => setIsOpen(false)}
                    task="Create Job Post" 
                />
            </Modal>
        </>
    );
}