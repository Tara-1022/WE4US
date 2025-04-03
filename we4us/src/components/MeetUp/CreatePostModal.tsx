import { useState } from "react";
import { MeetUpPostBody } from "./MeetUpPostTypes";
import Modal from "react-modal";

let styles = {
    form: { color: "black" },
    input: {
        color: "white",
        backgroundColor: "black",
        border: "1px solid gray",
        padding: "5px",
        borderRadius: "5px",
    },
};

Modal.setAppElement("#root");

export default function CreatePostModal({
    isOpen,
    setIsOpen,
    handleCreation,
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleCreation: (data: MeetUpPostBody) => Promise<string | null>; 
}) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { title, location, url, datetime, open_to, additional_details } = Object.fromEntries(formData);

        const selectedDate = new Date(datetime.toString());
        const currentDate = new Date();
        if (selectedDate < currentDate) {
            setErrorMessage("Please select a future date and time for the Meet Up.");
            return;
        }

        const error = await handleCreation({
            title: title.toString(),
            location: location.toString(),
            url: url?.toString() || "",
            datetime: datetime.toString(),
            open_to: open_to?.toString().trim() || "All",
            additional_details: additional_details?.toString() || "",
        });

        setErrorMessage(error);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Create Meet Up Post"
            style={{
                overlay: { zIndex: 10000, backgroundColor: "rgba(0, 0, 0, 0.5)" },
                content: {
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50%",
                    maxWidth: "500px",
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "10px",
                },
            }}
        >
            <h2>Create Meet Up Post</h2>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}  
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
