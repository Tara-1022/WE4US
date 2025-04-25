import { PostView } from "lemmy-js-client";
import { editPost } from "../../library/LemmyApi";
import { JobPostBody } from "./JobTypes";
import { isDateInFuture } from "../../library/Utils";
import Modal from "react-modal";
import { useState } from "react";
import "../../styles/JobStatusChangeForm.css";

export default function JobStatusChanger({ postId, initialView, onUpdate }:
    { postId: number, initialView: PostView, onUpdate: (updatedPost: PostView) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const jobBody = JSON.parse(initialView.post.body || "{}") as JobPostBody;

    const [deadline, setDeadline] = useState<string | undefined>(jobBody.deadline || undefined);
    const [isHovered, setIsHovered] = useState(false);


    function changeStatus(updateDeadline = false) {
        if (!confirm("Changing job status from \"" +
            (jobBody.open ? "Open" : "Closed") +
            "\" to \"" +
            (jobBody.open ? "Closed" : "Open") +
            "\". \nAre you sure?"
        )) return

        const newJobBody = {
            ...jobBody,
            open: !jobBody.open,
            ...(updateDeadline && deadline && { deadline: deadline.toString() })
        }

        editPost({
            post_id: postId,
            body: JSON.stringify(newJobBody)
        })
            .then(
                (updatedPost) => {
                    window.alert("Job status changed!");
                    onUpdate(updatedPost);
                }
            )
            .catch((error) => window.alert("Could not update! " + error))
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setDeadline(event.target.value);
    }

    function handleMarkJob(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        // If changing from 'Closed' to 'Open'
        if (!jobBody.open && jobBody.deadline && !isDateInFuture(jobBody.deadline)) {
            setIsOpen(true);
        }
        else changeStatus(false);
    }

    function handleNewDate(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        changeStatus(true);
        setIsOpen(false);
    }

    function handleJustUpdate(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        changeStatus(false);
        setIsOpen(false);
    }

    return <>
        <button onClick={handleMarkJob}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    cursor: "pointer",
                    marginLeft: "10px",
                    backgroundColor: isHovered ? " #00aaff" : " #0767b3",
                    color: "white",
                    padding: "7px 25px",
                    border: "none",
                    borderRadius: "1rem",
                    transition: "background-color 0.2s ease",
                    }}
        >
             Mark Job {jobBody.open ? 'Closed' : 'Open'}
        </button>

        <Modal
    isOpen={isOpen}
    style={{
        overlay: {
            alignItems: "center",
            justifyContent: "center",
        },
    }}
>
    <h4 className="modal-header">
        You're trying to mark the job open, but the deadline has passed. Would you like to set a future date?
    </h4>
    
    <label htmlFor="deadline" className="modal-label">
        Deadline
    </label>
    <input
        name="deadline"
        type="date"
        value={deadline}
        onChange={handleChange}
        className="modal-input"
    />
    <br />

    <button
        onClick={handleNewDate}
        className="modal-button modal-button-new-date"
    >
        Set New Date
    </button>
    
    <button
        onClick={handleJustUpdate}
        className="modal-button modal-button-update-status"
    >
        Just Update Status
    </button>
    
    <button
        onClick={() => setIsOpen(false)}
        className="modal-button modal-button-cancel"
    >
        Cancel
    </button>
</Modal>
</>
    }
