import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";

export type MeetUpPostBody = {
    location: string;
    datetime: string;
    open_to: string;
};

export default function MeetUpPostSnippet({ postView }: { postView: PostView }) {
    let parsedBody: MeetUpPostBody & { url?: string } = {
        location: "Unknown",
        datetime: "Not Specified",
        open_to: "Open to All",
        url: undefined,
    };

    if (postView.post.body) {
        try {
            parsedBody = JSON.parse(postView.post.body);
        } catch (error) {
            console.error("Error parsing post body:", error);
            parsedBody = {
                location: "Error: Unable to parse location",
                datetime: "Error: Unable to parse date/time",
                open_to: "Error: Unable to parse access information",
                url: undefined,
            };
        }
    }

    return (
        <div>
            <div>
                <p><strong>Location:</strong> {parsedBody.location}</p>
                <p><strong>Time & Date:</strong> {parsedBody.datetime}</p>
                <p><strong>Open To:</strong> {parsedBody.open_to}</p>
                {parsedBody.url && (
                    <p>
                        <strong>Event Link:</strong>{" "}
                        <a href={parsedBody.url} target="_blank" rel="noopener noreferrer">
                            {parsedBody.url}
                        </a>
                    </p>
                )}
                <Link to={`/meet-up/${postView.post.id}`}>View Details</Link>
                </div>
        </div>
    );
}
