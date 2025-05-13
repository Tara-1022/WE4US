import { MeetUpPostBody, MeetUpPostType } from "./MeetUpPostTypes";
import './CreatePostModal.css';

export default function PostForm({
  handleSubmit,
  errorMessage,
  onClose,
  initialData,
  task
}: {
  handleSubmit: (data: MeetUpPostType) => void;
  errorMessage: string | null;
  onClose: () => void;
  task: string;
  initialData?: MeetUpPostType;
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

    handleSubmit({
      title: title.toString(),
      url: url?.toString() || "",
      body: {
        location: location.toString(),
        datetime: datetime.toString(),
        open_to: open_to?.toString().trim() || "All",
        additional_details: additional_details?.toString() || "",
      } as MeetUpPostBody
    });
  }

  return (
    <form onSubmit={handleClick} className="meet-up-form-container">
      <h2>{task} Meet Up Post</h2>

      {errorMessage && <p className="meet-up-error-message">{errorMessage}</p>}

      <label htmlFor="title" className="meet-up-label">Title</label>
      <input
        name="title"
        required
        className="meet-up-input"
        defaultValue={initialData?.title || ""}
      />

      <label htmlFor="location" className="meet-up-label">Location</label>
      <input
        name="location"
        required
        className="meet-up-input"
        defaultValue={initialData?.body.location || ""}
      />

      <label htmlFor="url" className="meet-up-label">URL (Optional)</label>
      <input
        name="url"
        type="url"
        className="meet-up-input"
        defaultValue={initialData?.url || ""}
      />

      <label htmlFor="datetime" className="meet-up-label">Time & Date</label>
      <input
        name="datetime"
        type="datetime-local"
        required
        className="meet-up-input"
        defaultValue={initialData?.body.datetime || ""}
      />

      <label htmlFor="open_to" className="meet-up-label">Open To</label>
      <input
        name="open_to"
        className="meet-up-input"
        defaultValue={initialData?.body.open_to || "All"}
      />

      <label htmlFor="additional_details" className="meet-up-label">Additional Details (Optional)</label>
      <textarea
        name="additional_details"
        rows={5}
        className="meet-up-additional-textarea"  
        defaultValue={initialData?.body.additional_details || ""}
      />
    
      <button type="submit" className="meet-up-button">{task}</button>
      <button type="reset" className="meet-up-button">Reset</button>
      <button type="button" className="meet-up-button" onClick={onClose}>Cancel</button>
    </form>
  );
}
