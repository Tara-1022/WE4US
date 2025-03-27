import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";

export type MeetUpPostBody = {
    title: string; 
    location: string;
    datetime: string;
    open_to: string;
    additional_details?: string;
};

export default function MeetUpPostSnippet({ postView }: { postView: PostView }) {
    let parsedBody: MeetUpPostBody & { url?: string } = {
        title: "",
        location: "Unknown",
        datetime: "Not Specified",
        open_to: "All",
        url: undefined,
        additional_details: "",
    };

    if (postView.post.body) {
        try {
            parsedBody = JSON.parse(postView.post.body);
        } catch (error) {
            console.error("Error parsing post body:", error);
            parsedBody = {
                title: "Error: Unable to parse title",
                location: "Error: Unable to parse location",
                datetime: "Error: Unable to parse date/time",
                open_to: "Error: Unable to parse access information",
                url: undefined,
                additional_details: "",
            };
        }
    }

    return (
        <div>
            <div>
                <h4>
                    <Link to={`/meet-up/${postView.post.id}`} style={{ textDecoration: "none", color: "black" }}>
                        {parsedBody.title}
                    </Link>
                </h4>
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
                {parsedBody.additional_details?.trim() && ( 
                    <p><strong>Additional Details:</strong> {parsedBody.additional_details}</p>
                )}
            </div>
        </div>
    );
}
