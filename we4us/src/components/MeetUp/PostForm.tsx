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
    <form onSubmit={handleClick}>
      <h2>{task} Meet Up Post</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label htmlFor="title">Title</label>
      <input
        name="title"
        required
        className="input"
        defaultValue={initialData?.title || ""}
      />

      <label htmlFor="location">Location</label>
      <input
        name="location"
        required
        className="input"
        defaultValue={initialData?.body.location || ""}
      />

      <label htmlFor="url">URL (Optional)</label>
      <input
        name="url"
        type="url"
        className="input"
        defaultValue={initialData?.url || ""}
      />

      <label htmlFor="datetime">Time & Date</label>
      <input
        name="datetime"
        type="datetime-local"
        required
        className="input"
        defaultValue={initialData?.body.datetime || ""}
      />

      <label htmlFor="open_to">Open To</label>
      <input
        name="open_to"
        className="input"
        defaultValue={initialData?.body.open_to || "All"}
      />

      <label htmlFor="additional_details">Additional Details (Optional)</label>
      <textarea
        name="additional_details"
        rows={3}
        className="input textarea"
        defaultValue={initialData?.body.additional_details || ""}
      />

      <button type="submit" className="primary-button">{task}</button>
      <button type="reset" className="secondary-button">Reset</button>
      <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
    </form>
  );
}
