import { useState } from "react";
import { MeetUpPostData } from "./PostCreationHandler";
import Modal from "react-modal";

let styles = {
    form: {
        color: "black"
    },
    input: {
        color: "white", 
        backgroundColor: "black", 
        border: "1px solid gray", 
        padding: "5px", 
        borderRadius: "5px" 
    }
};

export default function CreatePostModal({ 
    isOpen, 
    setIsOpen, 
    handleCreation 
}: { 
    isOpen: boolean; 
    setIsOpen: (isOpen: boolean) => void; 
    handleCreation: (data: MeetUpPostData) => void; 
}) {
    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { title, location, url, datetime, open_to, additional_details } = Object.fromEntries(formData);

        const selectedDate = new Date(datetime.toString());
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            alert("Please select a future date and time for the Meet Up.");
            return;
        }

        handleCreation({
            title: title.toString(),
            location: location.toString(),
            url: url?.toString() || "", 
            datetime: datetime.toString(),
            open_to: open_to?.toString().trim() || "All",
            additional_details: additional_details?.toString() || "",
        });
    }

    return (
        <Modal isOpen={isOpen} contentLabel="Create Meet Up Post">
            <form onSubmit={handleClick} style={styles.form}>
                <label htmlFor="title">Title</label>
                <input name="title" required style={styles.input} />
                <br />

                <label htmlFor="location">Location</label>
                <input name="location" required style={styles.input} />
                <br />

                <label htmlFor="url">URL (Optional)</label>
                <input name="url" type="url" style={styles.input} />
                <br />

                <label htmlFor="datetime">Time & Date</label>
                <input name="datetime" type="datetime-local" required style={styles.input} />
                <br />

                <label htmlFor="open_to">Open To</label>
                <input name="open_to" defaultValue="All" style={styles.input} />
                <br />

                <label htmlFor="additional_details">Additional Details (Optional)</label>
                <textarea name="additional_details" rows={3} style={{ ...styles.input, height: "60px" }} />
                <br />

                <button type="submit">Create Meet Up Post</button>
                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    );
}
