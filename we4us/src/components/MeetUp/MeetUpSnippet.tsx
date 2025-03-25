import { Link } from 'react-router-dom';
import { PostView } from "lemmy-js-client";

let styles: { [key: string]: React.CSSProperties } = {
    post: {
        display: "flex",
        flexFlow: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "2%"
        
    },
    details: {
        flex: 4
    }
};

export default function MeetUpPostSnippet({ postView }: { postView: PostView }) {
    let parsedBody = {
        location: "Unknown",
        datetime: "Not Specified",
        open_to: "Open to All"
    };

    if (postView.post.body) {
        try {
            parsedBody = JSON.parse(postView.post.body);
        } catch (error) {
            console.error("Error parsing post body:", error);
            parsedBody = {
                location: "Error: Unable to parse location",
                datetime: "Error: Unable to parse date/time",
                open_to: "Error: Unable to parse access information"
            };
        }
    }

    return (
        <div style={styles.post}>
            <div style={styles.details}>
                <p><strong>Location:</strong> {parsedBody.location}</p>
                <p><strong>Time & Date:</strong> {parsedBody.datetime}</p>
                <p><strong>Open To:</strong> {parsedBody.open_to}</p>
                <Link to="/meet-up">View Details</Link>
            </div>
        </div>
    );
}
