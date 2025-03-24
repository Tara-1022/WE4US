import { MeetUpPostData } from "./PostCreationHandler";
import Modal from "react-modal";

let styles = {
    form: {
        color: "black"
    }
};

export default function CreatePostModal({ isOpen, setIsOpen, handleCreation }:
    { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleCreation: (data: MeetUpPostData) => void }) {

    function handleClick(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const { location, datetime, access } = Object.fromEntries(formData);

        const selectedDate = new Date(datetime.toString());
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            alert("Please select a future date and time for the Meet Up.");
            return;
        }

        handleCreation({
            location: location.toString(),
            datetime: datetime.toString(),
            access: access.toString()
        });
    }

    return (
        <Modal isOpen={isOpen} contentLabel="Create Meet Up Post">
            <form onSubmit={handleClick} style={styles.form}>
                <label htmlFor="location">Location (Link if Online)</label>
                <input name="location" required />
                <br />
                <label htmlFor="datetime">Time & Date</label>
                <input name="datetime" type="datetime-local" required />
                <br />
                <label htmlFor="access">Open To? (Access Restrictions)</label>
                <input name="access" required />
                <br />
                <button type="submit">Create Meet Up Post</button>
                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
            </form>
        </Modal>
    );
}
