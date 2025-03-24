import MeetUpPostSnippet from "./MeetUpSnippet";
import { PostView } from "lemmy-js-client";

let styles = {
    list: {
        listStyleType: "none",
        margin: 0,
        padding: 0
    },
    listItem: {}
};

export default function MeetUpPostList({ postViews }: { postViews: PostView[] }) {
    const list = postViews.map(postView => {
        let parsedBody = {
            location: "Unknown",
            datetime: "Not Specified",
            access: "Open to All"
        };

        if (postView.post.body) {
            try {
                parsedBody = JSON.parse(postView.post.body);
            } catch (error) {
                console.error("Error parsing post body:", error);
                parsedBody = {
                    location: "Error: Unable to parse location",
                    datetime: "Error: Unable to parse date/time",
                    access: "Error: Unable to parse access information"
                };
            }
        }

        return (
            <li key={postView.post.id} style={styles.listItem}>
                <MeetUpPostSnippet 
                    location={parsedBody.location} 
                    datetime={parsedBody.datetime} 
                    access={parsedBody.access} 
                />
            </li>
        );
    });

    return <ul style={styles.list}>{list}</ul>;
}
