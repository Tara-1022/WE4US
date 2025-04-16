import { useState } from "react";
import CreatePostModal from "./JobPostCreationModal";
import { createPost } from "../../library/LemmyApi";
import { PostView } from "lemmy-js-client";
import { useLemmyInfo } from "../LemmyContextProvider"
import { JobPostData } from "./JobTypes";

export default function PostCreationHandler({ handleCreatedPost }: { handleCreatedPost: (newPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {lemmyInfo} = useLemmyInfo();

    async function handleCreation(data: JobPostData): Promise<void> {
        console.log(data);
        setErrorMessage(null);


        if (!lemmyInfo) {
            setErrorMessage("Could not fetch Job Board community!");
            return 
        }
        
        try {
            const newPost = await createPost({
                body: JSON.stringify(data),
                name: data.name,
                community_id: lemmyInfo.job_board_details.community.id || -1,
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
               <button onClick={() => setIsOpen(true)}>New Post</button>
               <CreatePostModal
                   isOpen={isOpen}
                   handleCreation={handleCreation}
                   setIsOpen={setIsOpen}
                   errorMessage={errorMessage}
               />
           </>
       );
   }
   
