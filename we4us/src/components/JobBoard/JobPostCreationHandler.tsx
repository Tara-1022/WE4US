import { useState } from "react";
import PostForm from "./JobPostForm";
import { createPost } from "../../library/LemmyApi";
import { PostView } from "lemmy-js-client";
import { useLemmyInfo } from "../LemmyContextProvider";
import { JobPostData } from "./JobTypes";
import Modal from "react-modal";
import "../../styles/JobNewPostForm.css"; 

export default function PostCreationHandler({ 
  handleCreatedPost, 
  buttonStyle 
}: { 
  handleCreatedPost: (newPost: PostView) => void;
  buttonStyle?: React.CSSProperties;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { lemmyInfo } = useLemmyInfo();

    if (!lemmyInfo) return <h3>Could not fetch Job Board community!</h3>;

    function handleCreation(data: JobPostData) {
        console.log(data);

        if (!lemmyInfo) {
            console.error("Error creating post: Lemmy details not available");
            return;
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

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="new-job-post-button"
                style={buttonStyle}
            >
                 New Post
            </button>
            <Modal 
                isOpen={isOpen}
                contentLabel="Create Job Post"
                onRequestClose={() => setIsOpen(false)}
                ariaHideApp={false}
                style={{
                    content: {
                        backgroundColor: ' #1e1e1e', 
                        color: 'white', 
                        border: 'None'                
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)' 
                    }
                }}
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
