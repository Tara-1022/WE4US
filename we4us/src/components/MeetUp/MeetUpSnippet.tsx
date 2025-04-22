import { Link } from "react-router-dom";
import { PostView } from "lemmy-js-client";
import { MeetUpPostType, defaultPostData } from "./MeetUpPostTypes";

export default function MeetUpPostSnippet({ postView }: { postView: PostView }) {
    let parsedBody: MeetUpPostType = defaultPostData;

    if (postView.post.body) {
        try {
            parsedBody =
            {
                title: postView.post.name,
                url: postView.post.url,
                body: JSON.parse(postView.post.body)
            }
        } catch (error) {
            console.error("Error parsing post body:", error);
            parsedBody = {
                title: "Error: Unable to parse title",
                url: undefined,
                body: {
                    location: "Error: Unable to parse location",
                    datetime: "Error: Unable to parse date/time",
                    open_to: "Error: Unable to parse access information",
                    additional_details: "",
                }
            };
        }
    }

    return (
        <div>
            <div>
                <h3>
                    <Link
                        to={`/meetup/${postView.post.id}`}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <span style={{ color: "inherit" }}>
                            {parsedBody.title}
                        </span>
                    </Link>
                </h3>
                <p><strong>Location:</strong> {parsedBody.body.location}</p>
                <p><strong>Time & Date:</strong> {parsedBody.body.datetime}</p>
                <p><strong>Open To:</strong> {parsedBody.body.open_to}</p>
                {parsedBody.url && (
                    <p>
                        <strong>Event Link:</strong>{" "}
                        <a href={parsedBody.url} target="_blank" rel="noopener noreferrer">
                            {parsedBody.url}
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
