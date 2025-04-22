import { MeetUpPostBody, MeetUpPostType } from "./MeetUpPostTypes";

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
        <form onSubmit={handleClick} style={styles.form}>
            <h2>Create Meet Up Post</h2>

            {errorMessage && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                    {errorMessage}
                </p>
            )}

            <label htmlFor="title">Title</label>
            <input name="title" required style={styles.input}
                defaultValue={initialData?.title || undefined} />
            <br />

            <label htmlFor="location">Location</label>
            <input name="location" required style={styles.input}
                defaultValue={initialData?.body.location || undefined} />
            <br />

            <label htmlFor="url">URL (Optional)</label>
            <input name="url" type="url" style={styles.input}
                defaultValue={initialData?.url || undefined} />
            <br />

            <label htmlFor="datetime">Time & Date</label>
            <input name="datetime" type="datetime-local" required style={styles.input}
                defaultValue={initialData?.body.datetime || undefined} />
            <br />

            <label htmlFor="open_to">Open To</label>
            <input name="open_to" style={styles.input}
                defaultValue={initialData?.body.open_to || "All"} />
            <br />

            <label htmlFor="additional_details">Additional Details (Optional)</label>
            <textarea name="additional_details" rows={3} style={{ ...styles.input, height: "60px" }}
                defaultValue={initialData?.body.additional_details || undefined} />
            <br />

            <button type="submit">{task}</button>
            <button type="reset">Reset</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}
