import { MeetUpPostBody } from "./MeetUpPostTypes";
import Modal from "react-modal";
import './CreatePostModal.css';

export default function CreatePostModal({
  isOpen,
  setIsOpen,
  handleCreation,
  errorMessage,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleCreation: (data: MeetUpPostBody) => void;
  errorMessage: string | null;
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
    <Modal
      isOpen={isOpen}
      contentLabel="Create Meet Up Post"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <form onSubmit={handleClick}>
        <h2>Create Meet Up Post</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <label htmlFor="title">Title</label>
        <input name="title" required className="input" />

        <label htmlFor="location">Location</label>
        <input name="location" required className="input" />

        <label htmlFor="url">URL (Optional)</label>
        <input name="url" type="url" className="input" />

        <label htmlFor="datetime">Time & Date</label>
        <input name="datetime" type="datetime-local" required className="input" />

        <label htmlFor="open_to">Open To</label>
        <input name="open_to" defaultValue="All" className="input" />

        <label htmlFor="additional_details">Additional Details (Optional)</label>
        <textarea name="additional_details" rows={3} className="input textarea" />

        <button type="submit" className="primary-button">Create Meet Up Post</button>
        <button type="button" className="secondary-button" onClick={() => setIsOpen(false)}>
          Cancel
        </button>
      </form>
    </Modal>
  );
}